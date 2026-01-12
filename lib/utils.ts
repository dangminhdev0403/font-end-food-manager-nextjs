import { toast } from "@/components/ui/use-toast";
import { ApiError } from "@/services/http/httpClient";
import { AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//! helper

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export function responseSuccess<T>(res: AxiosResponse<T>) {
  // Chỉ trả data, không trả nguyên AxiosResponse
  return NextResponse.json(res, { status: res.status });
}

//!  Hanlde  API BACKEND
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export function responseError(error: unknown) {
  const isApi =
    (error as ApiError)?.name === "ApiError" && "status" in (error as any);

  if (isApi) {
    const apiError = error as ApiError;
    return NextResponse.json(
      {
        status: apiError.status,
        error: apiError.error,
        message: apiError.message,
        data: apiError.data ?? null,
      },
      { status: apiError.status }
    );
  }

  console.error(error);

  return NextResponse.json(
    {
      status: 500,
      error: "Internal Server Error",
      message: "Lỗi linh tinh nào đó chưa xử lí",
      data: null,
    },
    { status: 500 }
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
