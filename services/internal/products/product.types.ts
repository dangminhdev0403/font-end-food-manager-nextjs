import { Pageable } from "@/constants/types/page.type";

export interface ProductItem {
  id: number;

  price: {
    base: number;
    virtual: number;
  };

  name: string ;
  description: string ;
  cookingInstructions: string ;

  images: { url: string }[];
}

export interface ListProductResponse {
  items: ProductItem[];
  meta: Pageable;
}
