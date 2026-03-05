import { PaginationResponse } from "@/constants/types/page.type";

export interface ProductItem {
  id: number;
  basePrice: number;
  virtualPrice: number;
  name: string | null;
  description: string | null;
  cookingInstructions: string | null;
  images: string[];
}

export interface ListProductResponse extends PaginationResponse<ProductItem> {}
