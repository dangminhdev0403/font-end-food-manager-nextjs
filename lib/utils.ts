import { toast } from "@/components/ui/use-toast";
import { DishStatus } from "@/constants/types/auth.type";
import { ApiError } from "@/services/http/apiError";
import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//! helper
export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus],
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

//!  Hanlde  API BACKEND
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
// utils/response.ts

export function responseSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function responseError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        status: error.status,
        error: error.error ?? null,
        message: error.message,
        data: error.data ?? null,
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      status: 500,
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
      data: null,
    },
    { status: 500 },
  );
}

//? handleErrorApi
export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof ApiError && setError) {
    //@ts-ignore
    error.data.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem("accessToken");
};
export const getRefreshTokenFromLocalStorage = () => {
  return localStorage.getItem("refreshToken");
};
