"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { authenticate } from "@/config/authentication/actions";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { isSafeInternalCallbackUrl } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBodyType) => {
    setLoading(true);

    const res = await authenticate(data.email, data.password);

    if (res.success == false) {
      toast({
        description: res.message,
        variant: "error",
      });
    } else {
      toast({
        description: "Đăng nhập thành công",
        variant: "success",
      });
      const callbackUrl = searchParams.get("callbackUrl");
      const nextPath = isSafeInternalCallbackUrl(callbackUrl)
        ? callbackUrl
        : "/user";
      router.refresh();
      router.push(nextPath);
    }
    setLoading(false);
  };

  return (
    <Card className="mx-auto w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold sm:text-2xl">
          Đăng nhập
        </CardTitle>
        <CardDescription>Chào mừng bạn quay lại</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="h-11 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-fast hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Đăng nhập
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Hoặc</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
            >
              <svg
                className="mr-2 size-4"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M21.805 10.023h-9.82v3.955h5.627c-.246 1.318-1.478 3.865-5.627 3.865-3.381 0-6.14-2.8-6.14-6.244s2.759-6.244 6.14-6.244c1.928 0 3.223.83 3.96 1.547l2.7-2.626C16.928 2.703 14.71 1.7 11.985 1.7 6.932 1.7 2.83 5.88 2.83 11.6c0 5.72 4.102 9.9 9.155 9.9 5.288 0 8.786-3.728 8.786-8.98 0-.604-.066-1.062-.151-1.497z"
                  fill="currentColor"
                />
              </svg>
              Đăng nhập bằng Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <a
                href="#"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Đăng ký ngay
              </a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
