import ListProduct from "@/components/list-product";
import { logger } from "@/lib/logger";
import { getProductsISR } from "@/services/internal/products/product.isr";

export default async function Home() {
  try {
    const response = await getProductsISR({
      page: 1,
      size: 12,
    });

    const listProduct = response?.data?.items || [];

    return <ListProduct listProduct={listProduct} />;
  } catch (error) {
    logger.error({ error }, " Error ISR fetching products:");
    return (
      <div className="flex min-h-[60dvh] items-center justify-center p-4 sm:p-6 lg:p-8">
        <p className="text-base text-muted-foreground sm:text-lg">
          Lỗi khi tải sản phẩm
        </p>
      </div>
    );
  }
}
