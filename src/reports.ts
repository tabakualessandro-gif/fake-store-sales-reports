import type {
  Cart,
  CustomerRankingRow,
  CustomerReport,
  PeriodInterval,
  Product,
  ProductRankingRow,
  ProductReport,
  StoreUser,
} from "./types.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const LAST_MONTH_DEFINITION =
  "30 giorni mobili terminanti alla data del carrello più recente; entrambi gli estremi inclusi";

function parseDate(value: string): Date | null {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : new Date(timestamp);
}

function compareIds(a: number, b: number): number {
  return a - b;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function buildReports(
  products: Product[],
  carts: Cart[],
  users: StoreUser[],
  generatedAt = new Date(),
): { productReport: ProductReport; customerReport: CustomerReport } {
  const productById = new Map(products.map((product) => [product.id, product]));
  const userById = new Map(users.map((user) => [user.id, user]));

  const validDatedCarts = carts
    .map((cart) => ({ cart, date: parseDate(cart.date) }))
    .filter(
      (entry): entry is { cart: Cart; date: Date } => entry.date !== null,
    );

  const anchorTimestamp = validDatedCarts.reduce<number | null>(
    (latest, entry) =>
      latest === null || entry.date.getTime() > latest
        ? entry.date.getTime()
        : latest,
    null,
  );

  const anchor = anchorTimestamp === null ? null : new Date(anchorTimestamp);
  const periodStart =
    anchorTimestamp === null ? null : new Date(anchorTimestamp - 30 * DAY_MS);

  const interval: PeriodInterval = {
    start_inclusive: periodStart?.toISOString() ?? null,
    end_inclusive: anchor?.toISOString() ?? null,
    definition: LAST_MONTH_DEFINITION,
  };

  const includedInPeriod = (date: Date, period: "all_time" | "last_month") =>
    period === "all_time" ||
    (periodStart !== null &&
      anchor !== null &&
      date.getTime() >= periodStart.getTime() &&
      date.getTime() <= anchor.getTime());

  function buildProductRanking(
    period: "all_time" | "last_month",
  ): ProductRankingRow[] {
    const unitsByProduct = new Map<number, number>();

    for (const { cart, date } of validDatedCarts) {
      if (!includedInPeriod(date, period)) continue;

      for (const item of cart.products ?? []) {
        const quantity = Number(item.quantity);
        const productId = Number(item.productId);
        if (!Number.isInteger(productId) || !Number.isFinite(quantity) || quantity <= 0) {
          continue;
        }
        unitsByProduct.set(
          productId,
          (unitsByProduct.get(productId) ?? 0) + quantity,
        );
      }
    }

    return [...unitsByProduct.entries()]
      .sort(([idA, unitsA], [idB, unitsB]) => unitsB - unitsA || compareIds(idA, idB))
      .slice(0, 3)
      .map(([productId, units], index) => {
        const product = productById.get(productId);
        const price =
          product && Number.isFinite(Number(product.price))
            ? Number(product.price)
            : null;

        return {
          rank: index + 1,
          product_id: productId,
          title: product?.title ?? `Prodotto ${productId} (non presente nel catalogo)`,
          category: product?.category ?? null,
          unit_catalog_price: price === null ? null : roundMoney(price),
          units_sold: units,
          revenue: price === null ? null : roundMoney(price * units),
        };
      });
  }

  function buildCustomerRanking(
    period: "all_time" | "last_month",
  ): CustomerRankingRow[] {
    const stats = new Map<
      number,
      { orders: number; units: number; spend: number }
    >();

    for (const { cart, date } of validDatedCarts) {
      if (!includedInPeriod(date, period)) continue;

      const userId = Number(cart.userId);
      if (!Number.isInteger(userId)) continue;

      const current = stats.get(userId) ?? { orders: 0, units: 0, spend: 0 };
      current.orders += 1;

      for (const item of cart.products ?? []) {
        const quantity = Number(item.quantity);
        const productId = Number(item.productId);
        if (!Number.isInteger(productId) || !Number.isFinite(quantity) || quantity <= 0) {
          continue;
        }

        current.units += quantity;
        const product = productById.get(productId);
        const price = product ? Number(product.price) : Number.NaN;
        // Senza prezzo di catalogo, il valore di quell'articolo non è calcolabile.
        if (Number.isFinite(price)) current.spend += price * quantity;
      }

      stats.set(userId, current);
    }

    return [...stats.entries()]
      .sort(([idA, a], [idB, b]) => b.spend - a.spend || compareIds(idA, idB))
      .slice(0, 3)
      .map(([userId, statsForUser], index) => {
        const user = userById.get(userId);
        const firstName = user?.name?.firstname ?? "";
        const lastName = user?.name?.lastname ?? "";
        const fullName = `${firstName} ${lastName}`.trim();

        return {
          rank: index + 1,
          user_id: userId,
          username: user?.username ?? null,
          full_name: fullName || null,
          email: user?.email ?? null,
          orders_count: statsForUser.orders,
          total_units_purchased: statsForUser.units,
          total_spend: roundMoney(statsForUser.spend),
        };
      });
  }

  const productReport: ProductReport = {
    report_id: "top_3_products_by_units",
    generated_at: generatedAt.toISOString(),
    anchor_order_date: anchor?.toISOString() ?? null,
    last_month_interval: interval,
    ranking_criterion:
      "Unità vendute decrescenti; a parità, product_id crescente",
    periods: {
      all_time: { interval: null, top_products: buildProductRanking("all_time") },
      last_month: {
        interval,
        top_products: buildProductRanking("last_month"),
      },
    },
  };

  const customerReport: CustomerReport = {
    report_id: "top_3_customers_by_spend",
    generated_at: generatedAt.toISOString(),
    anchor_order_date: anchor?.toISOString() ?? null,
    last_month_interval: interval,
    ranking_criterion:
      "Spesa totale decrescente; a parità, user_id crescente",
    periods: {
      all_time: {
        interval: null,
        top_customers: buildCustomerRanking("all_time"),
      },
      last_month: {
        interval,
        top_customers: buildCustomerRanking("last_month"),
      },
    },
  };

  return { productReport, customerReport };
}
