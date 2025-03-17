import type { ProductCategory } from "@/src/@types/database";
import { productsDB } from "../exports";

export function getProductCategories() {
  return productsDB.get() as ProductCategory[];
}
