"use client";

import { AnimatedSection } from "@/components/animated-section";
import { CursorGlow } from "@/components/cursor-glow";
import { MagneticButton } from "@/components/magnetic-button";
import { TextReveal } from "@/components/text-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowRight,
  ChefHat,
  Clock,
  MapPin,
  Phone,
  Star,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
const menuItems = [
  {
    id: 1,
    name: "Phở Bò Tái Chín",
    description:
      "Phở bò truyền thống với thịt bò tái và chín, nước dùng đậm đà",
    price: "75,000đ",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=400&fit=crop&q=80",
    category: "Món chính",
    isPopular: true,
  },
  {
    id: 2,
    name: "Bánh Mì Thịt Nướng",
    description: "Bánh mì giòn với thịt nướng, đồ chua và rau thơm",
    price: "35,000đ",
    image:
      "https://images.unsplash.com/photo-1600688640154-9619e002df30?w=400&h=400&fit=crop&q=80",
    category: "Ăn nhẹ",
    isPopular: true,
  },
  {
    id: 3,
    name: "Bún Chả Hà Nội",
    description: "Bún chả truyền thống với thịt nướng thơm lừng, nước mắm pha",
    price: "65,000đ",
    image:
      "https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=400&h=400&fit=crop&q=80",
    category: "Món chính",
    isPopular: false,
  },
  {
    id: 4,
    name: "Gỏi Cuốn Tôm Thịt",
    description: "Gỏi cuốn tươi mát với tôm, thịt heo, bún và rau sống",
    price: "45,000đ",
    image:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=400&fit=crop&q=80",
    category: "Khai vị",
    isPopular: false,
  },
  {
    id: 5,
    name: "Cơm Tấm Sườn Bì",
    description: "Cơm tấm với sườn nướng, bì, chả và trứng ốp la",
    price: "55,000đ",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop&q=80",
    category: "Món chính",
    isPopular: true,
  },
  {
    id: 6,
    name: "Chè Ba Màu",
    description: "Chè đậu xanh, đậu đỏ, thạch và nước cốt dừa",
    price: "25,000đ",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&q=80",
    category: "Tráng miệng",
    isPopular: false,
  },
];

const features = [
  {
    icon: ChefHat,
    title: "Đầu bếp chuyên nghiệp",
    description: "Đội ngũ đầu bếp giàu kinh nghiệm",
  },
  {
    icon: Utensils,
    title: "Nguyên liệu tươi ngon",
    description: "Chọn lọc nguyên liệu mỗi ngày",
  },
  {
    icon: Star,
    title: "Chất lượng 5 sao",
    description: "Được khách hàng đánh giá cao",
  },
];
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=900&fit=crop&q=80",
    alt: "Không gian nhà hàng sang trọng",
    span: "col-span-2 row-span-2",
    height: "h-[400px] md:h-[500px]",
  },
  {
    src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=450&fit=crop&q=80",
    alt: "Món ăn đặc sắc",
    span: "",
    height: "h-[190px] md:h-[240px]",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=450&fit=crop&q=80",
    alt: "Bàn ăn trang nhã",
    span: "",
    height: "h-[190px] md:h-[240px]",
  },
  {
    src: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&h=450&fit=crop&q=80",
    alt: "Quầy bar hiện đại",
    span: "",
    height: "h-[190px] md:h-[240px]",
  },
  {
    src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=450&fit=crop&q=80",
    alt: "Đầu bếp tài năng",
    span: "",
    height: "h-[190px] md:h-[240px]",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark">
      <CursorGlow />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <AnimatedSection animation="fade-in-left" delay={100}>
            <span className="text-xl font-bold tracking-tight text-foreground">
              BIG BOY
            </span>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-right" delay={100}>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a
                href="#menu"
                className="hover:text-foreground transition-colors"
              >
                Thực đơn
              </a>
              <a
                href="#about"
                className="hover:text-foreground transition-colors"
              >
                Về chúng tôi
              </a>
              <a
                href="#gallery"
                className="hover:text-foreground transition-colors"
              >
                Không gian
              </a>
              <a
                href="#contact"
                className="hover:text-foreground transition-colors"
              >
                Liên hệ
              </a>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-right" delay={200}>
            <MagneticButton className="bg-foreground text-background hover:bg-foreground/90">
              Đặt bàn
            </MagneticButton>
          </AnimatedSection>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background z-10" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop&q=80"
            alt="Nhà hàng Big Boy"
            fill
            priority
            className="object-cover opacity-40"
          />
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
          <AnimatedSection animation="blur-in" delay={300}>
            <Badge className="mb-6 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border backdrop-blur-sm px-4 py-2 text-sm">
              Ẩm thực Việt Nam đích thực
            </Badge>
          </AnimatedSection>

          <div className="overflow-hidden">
            <AnimatedSection animation="fade-in-up" delay={500}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter text-foreground">
                <TextReveal text="BIG" delay={600} />
                <span className="block">
                  <TextReveal text="BOY" delay={800} />
                </span>
              </h1>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="fade-in-up" delay={1000}>
            <p className="mt-8 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl text-pretty font-light tracking-wide">
              Vị ngon, trọn khoảnh khắc
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" delay={1200}>
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <MagneticButton
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 px-8 group"
              >
                Khám phá thực đơn
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton
                size="lg"
                variant="outline"
                className="border-foreground/30 text-foreground bg-transparent hover:bg-foreground/10 px-8"
              >
                Đặt bàn ngay
              </MagneticButton>
            </div>
          </AnimatedSection>

          <AnimatedSection
            animation="fade-in"
            delay={1500}
            className="absolute bottom-12"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground animate-float">
              <span className="text-xs uppercase tracking-widest">
                Cuộn xuống
              </span>
              <ArrowDown className="w-4 h-4" />
            </div>
          </AnimatedSection>
        </div>

        {/* Decorative lines */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
          <AnimatedSection animation="fade-in-left" delay={1400}>
            <div className="w-px h-32 bg-gradient-to-b from-transparent via-foreground/30 to-transparent" />
          </AnimatedSection>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
          <AnimatedSection animation="fade-in-right" delay={1400}>
            <div className="w-px h-32 bg-gradient-to-b from-transparent via-foreground/30 to-transparent" />
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        id="about"
        className="py-32  from-amber-950/40 via-orange-950/20 to-background"
      >
        <div className="container mx-auto px-6">
          <AnimatedSection animation="fade-in-up" className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-300/70">
              Tại sao chọn chúng tôi
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Sự khác biệt
            </h2>
            <div className="mt-4 w-12 h-px bg-amber-500/50 mx-auto animate-line-expand" />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <AnimatedSection
                key={index}
                animation="fade-in-up"
                delay={index * 200}
                className="h-full"
              >
                <div className="group text-center p-8 rounded-2xl h-full bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-800/20 hover:border-amber-600/40 hover:shadow-lg hover:shadow-amber-900/20 transition-all duration-500">
                  <div className="w-20 h-20 rounded-full border border-amber-500/30 bg-amber-800/20 flex items-center justify-center mx-auto mb-6 group-hover:border-amber-400/60 group-hover:bg-amber-700/30 group-hover:scale-110 transition-all duration-500">
                    <feature.icon className="w-8 h-8 text-amber-400 group-hover:text-amber-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-amber-100/60 text-sm leading-relaxed line-clamp-3">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Menu Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        id="menu"
        className="py-32 px-6"
      >
        <div className="container mx-auto">
          <AnimatedSection animation="fade-in-up" className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Thực đơn
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Tinh hoa ẩm thực
            </h2>
            <div className="mt-4 w-12 h-px bg-foreground/30 mx-auto" />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <AnimatedSection
                key={item.id}
                animation="fade-in-up"
                delay={index * 100}
                className="h-full"
              >
                <Card className="group overflow-hidden h-full flex flex-col bg-gradient-to-br from-amber-950/20 to-orange-950/10 border-amber-900/20 hover:border-amber-700/40 hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-500">
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                    {item.isPopular && (
                      <Badge className="absolute top-4 left-4 z-10 bg-amber-600 text-white border-none">
                        Bán chạy
                      </Badge>
                    )}
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className="text-xs border-amber-700/30 text-amber-200/80 bg-amber-900/20"
                      >
                        {item.category}
                      </Badge>
                      <span className="text-lg font-semibold text-amber-400">
                        {item.price}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground tracking-tight">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                      {item.description}
                    </p>
                    <Button variant="food">Thêm vào giỏ</Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection
            animation="fade-in-up"
            delay={600}
            className="text-center mt-16"
          >
            <MagneticButton
              variant="outline"
              size="lg"
              className="border-amber-600/40 text-amber-100 hover:bg-amber-600 hover:text-white hover:border-amber-500 px-12"
            >
              Xem toàn bộ thực đơn
              <ArrowRight className="ml-2 w-4 h-4" />
            </MagneticButton>
          </AnimatedSection>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-secondary/20">
        <div className="container mx-auto px-6">
          <AnimatedSection animation="fade-in-up" className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Không gian
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Trải nghiệm độc đáo
            </h2>
            <div className="mt-4 w-12 h-px bg-foreground/30 mx-auto" />
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <AnimatedSection
                key={index}
                animation="scale-in"
                delay={index * 150}
                className={`relative ${image.span} ${image.height} rounded-lg overflow-hidden group`}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-background/40 group-hover:bg-transparent transition-all duration-500" />
                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-sm text-foreground font-medium">
                    {image.alt}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection animation="fade-in-up" className="text-center">
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(255,200,0,0.6)]"
                  fill="currentColor"
                />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-relaxed">
              "Đậm chất Việt – một trải nghiệm ẩm thực tinh tế trong từng chi
              tiết."
            </blockquote>
            <div className="mt-8">
              <p className="text-foreground font-semibold">
                Big Boy Restaurant
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Ẩm thực Việt hiện đại
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        id="contact"
        className="py-32 px-6 bg-gradient-to-br from-amber-900 via-orange-900 to-amber-950 text-white "
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="fade-in-left">
              <span className="text-xs uppercase tracking-[0.3em] text-amber-200/60">
                Liên hệ
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-white">
                Đặt bàn ngay hôm nay
              </h2>
              <p className="mt-6 text-amber-100/70 text-lg leading-relaxed">
                Trải nghiệm ẩm thực Việt Nam đích thực trong không gian sang
                trọng và ấm cúng.
              </p>
              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-amber-400/30 bg-amber-500/10 flex items-center justify-center group-hover:border-amber-400/60 group-hover:bg-amber-500/20 transition-all duration-300">
                    <MapPin className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-amber-100/90">
                    123 Nguyễn Huệ, Quận 1, TP.HCM
                  </span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-amber-400/30 bg-amber-500/10 flex items-center justify-center group-hover:border-amber-400/60 group-hover:bg-amber-500/20 transition-all duration-300">
                    <Phone className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-amber-100/90">0123 456 789</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-amber-400/30 bg-amber-500/10 flex items-center justify-center group-hover:border-amber-400/60 group-hover:bg-amber-500/20 transition-all duration-300">
                    <Clock className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-amber-100/90">
                    8:00 - 22:00 (Thứ 2 - Chủ nhật)
                  </span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection
              animation="fade-in-right"
              className="flex justify-center lg:justify-end"
            >
              <div className="bg-white/10 backdrop-blur-md border border-amber-300/20 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-black/20">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Đặt bàn
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full px-4 py-3 bg-white/5 border border-amber-300/30 rounded-lg text-white placeholder:text-amber-200/50 focus:border-amber-400/60 focus:bg-white/10 focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    className="w-full px-4 py-3 bg-white/5 border border-amber-300/30 rounded-lg text-white placeholder:text-amber-200/50 focus:border-amber-400/60 focus:bg-white/10 focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white/5 border border-amber-300/30 rounded-lg text-white placeholder:text-amber-200/50 focus:border-amber-400/60 focus:bg-white/10 focus:outline-none transition-all duration-300"
                  />
                  <select className="w-full px-4 py-3 bg-white/5 border border-amber-300/30 rounded-lg text-white focus:border-amber-400/60 focus:bg-white/10 focus:outline-none transition-all duration-300">
                    <option value="" className="text-gray-900 bg-white">
                      Số người
                    </option>
                    <option value="2" className="text-gray-900 bg-white">
                      2 người
                    </option>
                    <option value="4" className="text-gray-900 bg-white">
                      4 người
                    </option>
                    <option value="6" className="text-gray-900 bg-white">
                      6 người
                    </option>
                    <option value="8" className="text-gray-900 bg-white">
                      8+ người
                    </option>
                  </select>
                  <MagneticButton className="w-full bg-amber-500 text-white hover:bg-amber-400 border-none font-semibold shadow-lg shadow-amber-900/30">
                    Xác nhận đặt bàn
                  </MagneticButton>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-background to-amber-950/20 border-t border-amber-900/20 py-16 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <AnimatedSection animation="fade-in-left">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  BIG BOY
                </h3>
                <p className="mt-2 text-amber-200/60 text-sm">
                  Vị ngon, trọn khoảnh khắc
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection
              animation="fade-in"
              className="flex gap-8 text-sm text-muted-foreground"
            >
              <a href="#" className="hover:text-amber-400 transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                TikTok
              </a>
            </AnimatedSection>

            <AnimatedSection animation="fade-in-right">
              <p className="text-xs text-muted-foreground">
                © 2026 Big Boy Restaurant. All rights reserved.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </footer>
    </div>
  );
}
