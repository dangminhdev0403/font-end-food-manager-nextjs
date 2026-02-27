"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface WelcomePageProps {
  onSubmit: (name: string) => void;
  isLoading: boolean;
  serverError?: string;
}

export default function WelcomePage({
  onSubmit,
  isLoading,
  serverError,
}: WelcomePageProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const displayError = error || serverError;
  const isBlocked = !!serverError;

  useEffect(() => {
    if (serverError) {
      setError("");
    }
  }, [serverError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Vui lòng nhập tên để bắt đầu hành trình ẩm thực.");
      return;
    }

    setError("");
    onSubmit(name.trim());
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1a120c]">
      <div className="absolute inset-0 opacity-[0.05] bg-[url('/marble-texture.jpg')] bg-cover bg-center" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#f08a00]/10 rounded-full blur-[150px] animate-[floatLight_14s_ease-in-out_infinite]" />
      </div>

      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2 }}
        className="w-full max-w-md text-center px-6 relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-serif text-7xl font-bold tracking-wide text-[#f08a00] drop-shadow-[0_0_30px_rgba(240,138,0,0.4)]"
        >
          Big Boy
        </motion.h1>

        <div className="h-[1px] w-full my-10 bg-gradient-to-r from-transparent via-[#f08a00]/70 to-transparent" />

        <h3 className="font-serif text-3xl mb-3">Kính chào Quý khách</h3>

        <p className="text-[#c9b8a6] text-lg mb-8">
          Vui lòng nhập tên để bắt đầu hành trình thưởng thức của bạn
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* INPUT (Shake nếu lỗi) */}
          <motion.div
            animate={displayError ? { x: [-5, 5, -4, 4, -2, 2, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Nhập họ và tên của bạn"
              disabled={isLoading || isBlocked}
              className={`
                peer w-full px-5 py-3 rounded-md
                bg-[#24160f]
                border
                ${
                  displayError
                    ? "border-red-500 shadow-[0_0_25px_rgba(255,80,80,0.25)]"
                    : "border-[#f08a00]/20"
                }
                text-[#f5f1e8]
                placeholder-[#c9b8a6]
                focus:outline-none
                focus:border-[#f08a00]
                focus:shadow-[0_0_40px_rgba(240,138,0,0.3)]
                transition-all duration-500
              `}
            />

            <span
              className={`
                absolute left-0 bottom-0 h-[2px] w-0
                ${displayError ? "bg-red-500" : "bg-[#f08a00]"}
                transition-all duration-500
                peer-focus:w-full
              `}
            />
          </motion.div>

          {/* ERROR MESSAGE */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-2 text-red-400 text-sm tracking-wide"
            >
              <AlertTriangle size={16} />
              <span>{displayError}</span>
            </motion.div>
          )}

          {/* BUTTON */}
          <motion.button
            type="submit"
            disabled={isLoading || !name.trim() || isBlocked}
            whileHover={!isBlocked ? { scale: 1.05 } : {}}
            whileTap={!isBlocked ? { scale: 0.97 } : {}}
            className={`
              w-full py-3 rounded-md
              ${
                isBlocked
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#c76b00] via-[#f08a00] to-[#c76b00] text-black shadow-[0_0_35px_rgba(240,138,0,0.35)] hover:shadow-[0_0_60px_rgba(240,138,0,0.6)]"
              }
              tracking-[0.2em]
              uppercase
              transition-all duration-500
            `}
          >
            {isLoading
              ? "Đang xử lý..."
              : isBlocked
                ? "Bàn đã được sử dụng"
                : "Bắt đầu khám phá"}
          </motion.button>

          <p className="text-sm text-[#c9b8a6] mt-4 italic">
            Tên của bạn sẽ được sử dụng để cá nhân hoá trải nghiệm
          </p>
        </form>

        <div className="mt-10 text-xs text-[#c9b8a6] tracking-widest">
          ✦ EST. 2026 ✦
        </div>
      </motion.div>
    </div>
  );
}
