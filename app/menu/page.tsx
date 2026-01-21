"use client";

import { AnimatedSection } from "@/components/animated-section";
import { MagneticButton } from "@/components/magnetic-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const allMenuItems = [
  {
    id: 1,
    name: "Phở Bò Tái Chín",
    description:
      "Phở bò truyền thống với thịt bò tái và chín, nước dùng đậm đà",
    price: "75,000đ",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=600&fit=crop&q=80",
    category: "Món chính",
    isPopular: true,
  },
  {
    id: 2,
    name: "Bánh Mì Thịt Nướng",
    description: "Bánh mì giòn với thịt nướng, đồ chua và rau thơm",
    price: "35,000đ",
    image:
      "https://images.unsplash.com/photo-1600688640154-9619e002df30?w=600&h=600&fit=crop&q=80",
    category: "Ăn nhẹ",
    isPopular: true,
  },
  {
    id: 3,
    name: "Bún Chả Hà Nội",
    description: "Bún chả truyền thống với thịt nướng thơm lừng, nước mắm pha",
    price: "65,000đ",
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=600&fit=crop&q=80",
    category: "Món chính",
    isPopular: false,
  },
  {
    id: 4,
    name: "Gỏi Cuốn Tôm Thịt",
    description: "Gỏi cuốn tươi mát với tôm, thịt heo, bún và rau sống",
    price: "45,000đ",
    image:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=600&h=600&fit=crop&q=80",
    category: "Khai vị",
    isPopular: false,
  },
  {
    id: 5,
    name: "Cơm Tấm Sườn Bì",
    description: "Cơm tấm với sườn nướng, bì, chả và trứng ốp la",
    price: "55,000đ",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=600&fit=crop&q=80",
    category: "Món chính",
    isPopular: true,
  },
  {
    id: 6,
    name: "Chè Ba Màu",
    description: "Chè đậu xanh, đậu đỏ, thạch và nước cốt dừa",
    price: "25,000đ",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=600&fit=crop&q=80",
    category: "Tráng miệng",
    isPopular: false,
  },
  {
    id: 7,
    name: "Cánh Gà Nướng Mật Ong",
    description: "Cánh gà nướng với mật ong, ớt và lạc rang",
    price: "65,000đ",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=600&fit=crop&q=80",
    category: "Khai vị",
    isPopular: true,
  },
  {
    id: 8,
    name: "Mì Hoành Thánh",
    description: "Mì hoành thánh trong nước dùng thanh và nóng hổi",
    price: "45,000đ",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221fcf0f?w=600&h=600&fit=crop&q=80",
    category: "Món chính",
    isPopular: false,
  },
  {
    id: 9,
    name: "Tôm Sú Hấp",
    description: "Tôm sú tươi hấp với sốt mỡ hành",
    price: "120,000đ",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=600&fit=crop&q=80",
    category: "Hải sản",
    isPopular: true,
  },
  {
    id: 10,
    name: "Lẩu Thái",
    description: "Lẩu Thái chua cay đặc biệt với hải sản và rau tươi",
    price: "200,000đ",
    image:
      "https://images.unsplash.com/photo-1605521209485-b4701d8cf32a?w=600&h=600&fit=crop&q=80",
    category: "Món chính",
    isPopular: false,
  },
  {
    id: 11,
    name: "Cơm Cháy Nấu Cà Chua",
    description: "Cơm cháy nấu cà chua chuẩn vị Huế",
    price: "85,000đ",
    image:
      "https://images.unsplash.com/photo-1585032226651-d98fa7577f1e?w=600&h=600&fit=crop&q=80",
    category: "Món chính",
    isPopular: false,
  },
  {
    id: 12,
    name: "Sinh Tố Chua Ngọt",
    description: "Sinh tố trái cây tươi với đá và sữa đặc",
    price: "30,000đ",
    image:
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&h=600&fit=crop&q=80",
    category: "Tráng miệng",
    isPopular: false,
  },
];

const categories = [
  "Tất cả",
  ...Array.from(new Set(allMenuItems.map((item) => item.category))),
];
const ITEMS_PER_PAGE = 8;

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredItems =
    selectedCategory === "Tất cả"
      ? allMenuItems
      : allMenuItems.filter((item) => item.category === selectedCategory);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              BIG BOY
            </span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto">
          <AnimatedSection animation="fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-center">
              Thực Đơn Đầy Đủ
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={100}>
            <p className="mt-4 text-center text-muted-foreground text-lg max-w-2xl mx-auto">
              Khám phá bộ sưu tập đồ ăn Việt Nam đa dạng với các hương vị độc
              đáo
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-15 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4 px-6">
        <div className="container mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <AnimatedSection
                key={category}
                animation="fade-in"
                delay={index * 50}
              >
                <button
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                    selectedCategory === category
                      ? "bg-amber-600 text-white"
                      : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                  }`}
                >
                  {category}
                </button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedItems.map((item, index) => (
              <AnimatedSection
                key={item.id}
                animation="fade-in-up"
                delay={index * 50}
                className="h-full"
              >
                <Card className="group overflow-hidden h-full flex flex-col bg-gradient-to-br from-amber-950/20 to-orange-950/10 border-amber-900/20 hover:border-amber-700/40 hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-500">
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
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
                  <CardContent className="p-5 flex-1 flex flex-col">
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
                    <h3 className="text-lg font-semibold text-foreground tracking-tight line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          {displayedItems.length === 0 && (
            <AnimatedSection
              animation="fade-in-up"
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                Không có món ăn trong danh mục này
              </p>
            </AnimatedSection>
          )}
        </div>
      </section>

      {filteredItems.length > 0 && (
        <section className="py-8 px-6 bg-background/50 border-t border-border">
          <div className="container mx-auto flex items-center justify-between">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="gap-2 border-amber-700/30 text-amber-400 hover:bg-amber-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Trang trước
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                        : "bg-foreground/5 text-foreground hover:bg-amber-600/20"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="gap-2 border-amber-700/30 text-amber-400 hover:bg-amber-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mt-4 text-sm text-muted-foreground">
            Trang {currentPage} trong {totalPages} • Hiển thị{" "}
            {displayedItems.length} / {filteredItems.length} món
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-amber-900 via-orange-900 to-amber-950 text-white">
        <div className="container mx-auto text-center">
          <AnimatedSection animation="fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold">
              Sẵn sàng đặt bàn?
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={100}>
            <p className="mt-4 text-amber-100/70">
              Liên hệ với chúng tôi để đặt bàn tại nhà hàng
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={200} className="mt-8">
            <MagneticButton
              size="lg"
              className="bg-white text-amber-900 hover:bg-white/90 px-8"
            >
              Đặt bàn ngay
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
