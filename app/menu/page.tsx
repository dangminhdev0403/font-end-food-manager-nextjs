import MenuClient from "@/app/menu/menu-client";
import { logger } from "@/lib/logger";
import { getProductsISR } from "@/services/internal/products/product.isr";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}
export default async function MenuPage({ searchParams }: Props) {
  const params = await searchParams; //
  const page = Number(params.page || 1);
  try {
    const response = await getProductsISR({
      page,
      size: 12,
    });

    const listProduct = response?.data?.items || [];
    const meta = response?.data?.meta || {};

    return <MenuClient meta={meta} listProduct={listProduct} />;
  } catch (error) {
    logger.error({ error }, "Error ISR fetching products");
    return <div className="p-8">Lỗi khi tải sản phẩm</div>;
  }
}
