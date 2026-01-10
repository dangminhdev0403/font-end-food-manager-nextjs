import { ApiError } from "@/services/http/httpClient";
import { AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function responseError(error: ApiError) {
  return NextResponse.json(
    {
      status: error.status,
      error: error.error,
      message: error.message,
      data: null,
    },
    { status: error.status }
  );
}
export function responseSuccess(res: AxiosResponse) {
  return NextResponse.json(res, { status: res.status });
}
