import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Clock3,
  QrCode,
  ReceiptText,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quickActions = [
  {
    title: "Đặt món tại bàn",
    description: "Vào khu vực bàn ăn và chọn món trực tiếp",
    href: "/tables",
    cta: "Bắt đầu đặt món",
    icon: UtensilsCrossed,
  },
  {
    title: "Theo dõi đơn hiện tại",
    description: "Xem trạng thái đơn và các món đã gọi",
    href: "/orders/guest",
    cta: "Xem đơn hàng",
    icon: ReceiptText,
  },
  {
    title: "Quét mã QR tại bàn",
    description: "Quét mã để vào đúng bàn và gọi món nhanh",
    href: "/tables",
    cta: "Mở quét mã",
    icon: QrCode,
  },
];

export default function UserPage() {
  return (
    <div className="w-full space-y-10 pb-12 sm:space-y-12 sm:pb-14 lg:space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
        <Image
          src="/banner.png"
          width={1400}
          height={500}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-background/45"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background/92 to-transparent"
        />

        <div className="relative space-y-6 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Clock3 className="size-3.5" />
                Xin chào, bạn đã đăng nhập
              </span>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-secondary/60 bg-secondary/20 px-3 py-1 text-xs font-semibold text-foreground">
                <Sparkles className="size-3.5" />
                Trải nghiệm gọi món nhanh tại nhà hàng
              </span>
            </div>
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Chọn cách bạn muốn đặt món
            </h1>
            <p className="max-w-xl text-sm leading-6 text-amber-100/80 sm:text-base">
              Truy cập nhanh các tác vụ đặt món, theo dõi đơn và gọi món tại bàn.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 w-full bg-amber-200 text-amber-950 hover:bg-amber-100 px-6 text-sm font-semibold sm:w-auto sm:min-w-40">
              <Link href="/tables" className="inline-flex items-center gap-2">
                Đặt món ngay
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full border-border/80 bg-background/75 px-6 text-sm sm:w-auto sm:min-w-40"
            >
              <Link href="/orders/guest">Theo dõi đơn</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Thao tác nhanh</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">3 lựa chọn phổ biến nhất</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Card
                key={action.title}
                className="group border-border/75 bg-card/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
              >
                <CardContent className="flex h-full flex-col space-y-4 p-5 sm:p-6">
                  <div className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 p-2.5 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-base font-semibold leading-6 sm:text-lg">{action.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{action.description}</p>
                  </div>
                  <Button asChild variant="outline" className="mt-auto h-11 w-full border-amber-300/30 bg-amber-50/5 text-amber-100 hover:bg-amber-100/10">
                    <Link href={action.href} className="inline-flex items-center gap-2">
                      {action.cta}
                      <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
