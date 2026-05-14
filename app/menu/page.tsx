import MenuClient from "@/app/menu/menu-client";
import { logger } from "@/lib/logger";
import { getProductsISR } from "@/services/internal/products/product.isr";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}
export default async function MenuPage({ searchParams }: Readonly<Props>) {
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
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-6 text-foreground sm:px-6">
        <p className="text-base text-destructive sm:text-lg" role="alert">
          Lỗi khi tải sản phẩm
        </p>
      </div>
    );
  }
}
