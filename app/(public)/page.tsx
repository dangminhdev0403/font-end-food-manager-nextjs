import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const featuredItems = [
  { name: "Bánh mì", description: "Bánh mì sandwich", price: "123,123đ" },
  { name: "Bánh mì", description: "Bánh mì sandwich", price: "123,123đ" },
  { name: "Bánh mì", description: "Bánh mì sandwich", price: "123,123đ" },
  { name: "Bánh mì", description: "Bánh mì sandwich", price: "123,123đ" },
];

export default function Home() {
  return (
    <div className="w-full space-y-6 sm:space-y-10">
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden rounded-xl border border-border bg-muted/30"
      >
        <Image
          src="/banner.png"
          width={1600}
          height={600}
          quality={90}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/40 to-background/80"
          aria-hidden
        />
        <div className="relative px-4 py-12 text-center sm:px-8 sm:py-16 md:py-20 lg:py-24">
          <h1
            id="hero-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Nhà hàng Big Boy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
            Vị ngon, trọn khoảnh khắc
          </p>
        </div>
      </section>

      <section
        aria-labelledby="featured-title"
        className="space-y-6 sm:space-y-8"
      >
        <h2
          id="featured-title"
          className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl"
        >
          Đa dạng các món ăn
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {featuredItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-shadow duration-base hover:shadow-md"
            >
              <CardContent className="flex gap-4 p-4 sm:p-6">
                <div className="size-24 shrink-0 overflow-hidden rounded-md sm:size-32 md:size-36">
                  <Image
                    src="https://ik.imagekit.io/freeflo/production/6b91c700-92c4-4601-8e96-37d84ac3c28c.png?tr=w-2048,q-75&alt=media&pr-true"
                    alt={item.name}
                    width={400}
                    height={400}
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-auto text-sm font-semibold text-foreground sm:text-base">
                    {item.price}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
