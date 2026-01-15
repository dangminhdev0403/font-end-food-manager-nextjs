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
import { useLoginMutation } from "@/queries/useAuth";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;
    try {
      setLoading(true);
      await loginMutation.mutateAsync(data);
      toast({
        description: "Đăng nhập thành công",
        variant: "success",
      });
      router.push("/manage/dashboard");
    } catch (error: any) {
      toast({
        description: error.message as string,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
        <CardDescription>Chào mừng bạn quay lại 👋</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    className="h-11"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label>Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="h-11 pr-10"
                      aria-autocomplete="inline"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng nhập
            </Button>

            {/* DIVIDER */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Hoặc
                </span>
              </div>
            </div>

            {/* GOOGLE */}
            <Button type="button" variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M21.805 10.023h-9.82v3.955h5.627c-.246 1.318-1.478 3.865-5.627 3.865-3.381 0-6.14-2.8-6.14-6.244s2.759-6.244 6.14-6.244c1.928 0 3.223.83 3.96 1.547l2.7-2.626C16.928 2.703 14.71 1.7 11.985 1.7 6.932 1.7 2.83 5.88 2.83 11.6c0 5.72 4.102 9.9 9.155 9.9 5.288 0 8.786-3.728 8.786-8.98 0-.604-.066-1.062-.151-1.497z"
                  fill="currentColor"
                />
              </svg>
              Đăng nhập bằng Google
            </Button>

            {/* REGISTER */}
            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <a href="#" className="font-medium text-primary hover:underline">
                Đăng ký ngay
              </a>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
