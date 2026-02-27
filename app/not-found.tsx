"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-stone-100 to-yellow-50 dark:from-stone-900 dark:via-amber-950 dark:to-stone-900 flex items-center justify-center p-4 relative">
      {/* Animated background orbs - restaurant style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 dark:bg-amber-900 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float-left" />
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 dark:bg-yellow-900 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float-right"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-200 dark:bg-orange-900 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl">
        {/* Decorative top line */}
        <div className="mb-8 flex justify-center items-center gap-4">
          <div className="h-1 w-12 bg-gradient-to-r from-transparent to-amber-700 dark:to-amber-400" />
          <span className="text-amber-700 dark:text-amber-400 text-lg">•</span>
          <div className="h-1 w-12 bg-gradient-to-l from-transparent to-amber-700 dark:to-amber-400" />
        </div>

        {/* Animated 404 number */}
        <div className="relative mb-8 inline-block">
          <div className="text-9xl md:text-9xl font-bold bg-gradient-to-r from-amber-900 via-yellow-700 to-orange-900 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-200 bg-clip-text text-transparent animate-slide-in">
            404
          </div>

          {/* Decorative shapes - restaurant ornaments */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-32 h-32 border-2 border-amber-400 dark:border-amber-300 rounded-lg opacity-25 animate-spin-slow" />
            <div
              className="absolute w-20 h-20 border-2 border-yellow-600 dark:border-yellow-300 rounded-full opacity-25 animate-pulse-glow"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute w-40 h-40 border-2 border-orange-300 dark:border-orange-400 rounded-full opacity-15"
              style={{
                animation: "spin-slow 30s linear infinite reverse",
              }}
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-4xl md:text-5xl font-bold text-amber-900 dark:text-amber-200 mb-4 animate-slide-in"
          style={{ animationDelay: "0.2s" }}
        >
          Không tìm thấy trang
        </h1>

        {/* Subheading */}
        <p
          className="text-sm text-amber-700 dark:text-amber-300 mb-6 animate-slide-in tracking-widest uppercase"
          style={{ animationDelay: "0.3s" }}
        >
          Trang này không tồn tại
        </p>

        {/* Description */}
        <p
          className="text-lg text-amber-800 dark:text-amber-100 mb-12 max-w-xl mx-auto animate-slide-in"
          style={{ animationDelay: "0.4s" }}
        >
          Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển. Vui lòng quay
          trở lại trang chủ để tiếp tục hành trình của bạn.
        </p>

        {/* Action buttons - restaurant style */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in mb-12"
          style={{ animationDelay: "0.6s" }}
        >
          <Link href="/">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-900 to-amber-800 dark:from-amber-400 dark:to-amber-300 text-white dark:text-amber-950 font-semibold rounded-md hover:shadow-lg hover:shadow-amber-700/40 dark:hover:shadow-amber-400/40 transition-all duration-300 hover:scale-105 active:scale-95 border border-amber-800 dark:border-amber-200">
              🏠 Về Trang Chủ
            </button>
          </Link>
        </div>

        {/* Decorative bottom line */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <div className="h-1 w-12 bg-gradient-to-r from-transparent to-amber-700 dark:to-amber-400" />
          <span className="text-amber-700 dark:text-amber-400 text-lg">•</span>
          <div className="h-1 w-12 bg-gradient-to-l from-transparent to-amber-700 dark:to-amber-400" />
        </div>

        {/* Floating elements - restaurant themed */}
        <div
          className="flex justify-center items-center gap-8 text-4xl animate-slide-in"
          style={{ animationDelay: "0.8s" }}
        >
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>
            🍷
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
            ✨
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
            🍽️
          </span>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-900 via-yellow-700 to-orange-800 dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400 opacity-50" />
    </div>
  );
}
