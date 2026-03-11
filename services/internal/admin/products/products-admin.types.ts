import {
  PaginationQuery,
  PaginationResponse,
} from "@/constants/types/page.type";

export interface ProductTranslationBody {
  languageId: number;
  name: string;
  description?: string;
  cookingInstructions?: string;
}

interface BaseProductBody {
  categoryId?: number;
  basePrice?: number;
  virtualPrice?: number;
  translations?: ProductTranslationBody[];
  imagesId?: number[];
}

export interface CreateProductBody extends BaseProductBody {
  categoryId: number;
  basePrice: number;
  virtualPrice: number;
  translations: ProductTranslationBody[];

}

export interface UpdateProductBody extends BaseProductBody {
  id: number;
  
}

export interface ProductItem {
  id: number;
  basePrice: number;
  virtualPrice: number;
  name: string | null;
  description: string | null;
  cookingInstructions: string | null;
  images: string[] | null;
}

export interface ListProductResponse extends PaginationResponse<ProductItem> {}

export interface FilterProductQuery {
  search: string;
}
export type GetListProductParams = PaginationQuery & FilterProductQuery;
