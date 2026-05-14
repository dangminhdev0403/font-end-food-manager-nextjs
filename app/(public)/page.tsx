import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock3, Flame, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = ["Món chính", "Món nhẹ", "Đồ uống", "Tráng miệng"];

const featuredItems = [
  {
    name: "Beef Burger Signature",
    description: "Bò nướng than, sốt đặc biệt và phô mai tan chảy",
    price: "89.000đ",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=80",
    rating: 4.8,
  },
  {
    name: "Gà sốt cay Hàn Quốc",
    description: "Giòn rụm bên ngoài, mềm mọng bên trong",
    price: "75.000đ",
    image:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=900&auto=format&fit=crop&q=80",
    rating: 4.7,
  },
  {
    name: "Mì Ý sốt bò bằm",
    description: "Sốt cà chua nấu chậm với thịt bò xay",
    price: "82.000đ",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&auto=format&fit=crop&q=80",
    rating: 4.9,
  },
  {
    name: "Pizza hải sản",
    description: "Đế giòn mỏng cùng topping tươi mỗi ngày",
    price: "149.000đ",
    image:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=900&auto=format&fit=crop&q=80",
    rating: 4.8,
  },
];

export default function Home() {
  return (
    <div className="w-full space-y-10 pb-10 sm:space-y-14 sm:pb-14">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-muted/20 shadow-sm">
        <Image
          src="/banner.png"
          width={1600}
          height={700}
          quality={90}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/45"
          aria-hidden
        />

        <div className="relative grid gap-8 px-5 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-20">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Flame className="size-3.5" />
              Ưu đãi hôm nay - giảm 20%
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Đặt món nhanh, ăn ngon mỗi ngày
            </h1>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              Chọn món yêu thích, đặt trong vài giây và theo dõi trạng thái đơn
              ngay trên điện thoại của bạn.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg" className="h-11 min-w-39.5 px-6">
                <Link href="/menu">
                  Đặt hàng ngay
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 min-w-39.5 border-border/80 bg-background/75 px-6 backdrop-blur-sm"
              >
                <Link href="/tables">Quét mã tại bàn</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Card className="border-border/60 bg-card/85 shadow-sm backdrop-blur">
              <CardContent className="flex items-center gap-3 p-4">
                <Clock3 className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Giao nhanh</p>
                  <p className="text-xs text-muted-foreground">20-30 phút</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/85 shadow-sm backdrop-blur">
              <CardContent className="flex items-center gap-3 p-4">
                <Truck className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Miễn phí ship</p>
                  <p className="text-xs text-muted-foreground">Đơn từ 150.000đ</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/85 shadow-sm backdrop-blur">
              <CardContent className="flex items-center gap-3 p-4">
                <Star className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">4.8/5 đánh giá</p>
                  <p className="text-xs text-muted-foreground">Từ 2.000+ khách hàng</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Danh mục nổi bật
          </h2>
          <Button asChild variant="ghost" className="h-9 rounded-full px-3 text-sm">
            <Link href="/menu">
              Xem toàn bộ menu
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Món bán chạy</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((item) => (
            <Card
              key={item.name}
              className="group overflow-hidden border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="space-y-2.5 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-semibold sm:text-base">
                    {item.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    <Star className="size-3" />
                    {item.rating}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold sm:text-base">{item.price}</span>
                  <Button asChild size="sm" className="h-8 px-3">
                    <Link href="/menu">Chọn món</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
