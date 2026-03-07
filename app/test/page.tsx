import TestComponet from "@/components/test";
import { getProductsISR } from "@/services/internal/products/product.isr";

export default async function PageTest() {
  try {
    const response = await getProductsISR({
      page: 1,
      size: 10,
    });

    console.log(" API Response:", response);
    const listProduct = response?.data?.items || [];

    return <TestComponet listProduct={listProduct} />;
  } catch (error) {
    console.error("[v0] Error fetching products:", error);
    return <div className="p-8">Lỗi khi tải sản phẩm</div>;
  }
}
