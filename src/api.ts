import type { Cart, Product, StoreUser } from "./types.js";

const BASE_URL = "https://fakestoreapi.com";
const TIMEOUT_MS = 20_000;

async function getList<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Richiesta /${endpoint} fallita: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`La risposta di /${endpoint} non è una lista JSON.`);
  }

  return data as T[];
}

export async function fetchStoreData(): Promise<{
  products: Product[];
  carts: Cart[];
  users: StoreUser[];
}> {
  const [products, carts, users] = await Promise.all([
    getList<Product>("products"),
    getList<Cart>("carts"),
    getList<StoreUser>("users"),
  ]);

  return { products, carts, users };
}
