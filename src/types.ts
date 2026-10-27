export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}

export interface CartProduct {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}

export interface StoreUser {
  id: number;
  username: string;
  email: string;
  name?: {
    firstname?: string;
    lastname?: string;
  };
}

export interface PeriodInterval {
  start_inclusive: string | null;
  end_inclusive: string | null;
  definition: string;
}

export interface ProductRankingRow {
  rank: number;
  product_id: number;
  title: string;
  category: string | null;
  unit_catalog_price: number | null;
  units_sold: number;
  revenue: number | null;
}

export interface CustomerRankingRow {
  rank: number;
  user_id: number;
  username: string | null;
  full_name: string | null;
  email: string | null;
  orders_count: number;
  total_units_purchased: number;
  total_spend: number;
}

export interface ProductReport {
  report_id: string;
  generated_at: string;
  anchor_order_date: string | null;
  last_month_interval: PeriodInterval;
  ranking_criterion: string;
  periods: {
    all_time: { interval: null; top_products: ProductRankingRow[] };
    last_month: { interval: PeriodInterval; top_products: ProductRankingRow[] };
  };
}

export interface CustomerReport {
  report_id: string;
  generated_at: string;
  anchor_order_date: string | null;
  last_month_interval: PeriodInterval;
  ranking_criterion: string;
  periods: {
    all_time: { interval: null; top_customers: CustomerRankingRow[] };
    last_month: { interval: PeriodInterval; top_customers: CustomerRankingRow[] };
  };
}
