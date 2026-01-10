import { ApiError } from "@/services/http/httpClient";
import { AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function responseSuccess<T>(res: AxiosResponse<T>) {
  // Chỉ trả data, không trả nguyên AxiosResponse
  return NextResponse.json(res.data, { status: res.status });
}

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