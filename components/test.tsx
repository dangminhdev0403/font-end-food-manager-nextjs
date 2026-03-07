"use client";
import { ListProductResponse } from "@/services/internal/products/product.types";
import { motion } from "motion/react";

interface Props {
  listProduct: ListProductResponse["items"];
}
export default function TestComponet({ listProduct }: Props) {
  if (!listProduct?.length) {
    return <div>Không có sản phẩm</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {listProduct?.map((item, index) => (
        <motion.div key={item.id} className="text-black">
          {item.name}
        </motion.div>
      ))}
    </div>
  );
}
