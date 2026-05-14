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
import { useUpdateProfileMutation } from "@/queries/useAccount";
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from "@/schemaValidations/account.schema";
import { UpdatePasswordBody } from "@/services/internal/me/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ChangePasswordForm() {
  const updatePasswordMutaion = useUpdateProfileMutation();

  const form = useForm<UpdatePasswordBody>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      refreshToken: localStorage.getItem("refreshToken") || "",
    },
  });

  const [visible, setVisible] = useState<Record<string, boolean>>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggle = (key: keyof typeof visible) =>
    setVisible((v) => ({ ...v, [key]: !v[key] }));

  const onSubmit = async (data: ChangePasswordBodyType) => {
    if (updatePasswordMutaion.isPending) return;
    try {
      await updatePasswordMutaion.mutateAsync(data);
      toast({ description: "Đổi mật khẩu thành công", variant: "success" });
    } catch (error: any) {
      toast({ description: error.message, variant: "error" });
    } finally {
      setTimeout(() => {
        globalThis.location.reload();
      }, 1500);
      form.reset();
      globalThis.location.reload();
    }
  };

  const fields = [
    { name: "oldPassword", label: "Mật khẩu cũ" },
    { name: "newPassword", label: "Mật khẩu mới" },
    { name: "confirmPassword", label: "Nhập lại mật khẩu mới" },
  ] as const;

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-base text-destructive sm:text-lg">
              Đổi mật khẩu
            </CardTitle>
            <CardDescription className="text-sm">
              Bạn sẽ bị đăng xuất khỏi các thiết bị khác sau khi đổi mật khẩu.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {fields.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={`pwd-${item.name}`}>{item.label}</Label>

                    <div className="relative">
                      <Input
                        id={`pwd-${item.name}`}
                        type={visible[item.name] ? "text" : "password"}
                        autoComplete={
                          item.name === "oldPassword"
                            ? "current-password"
                            : "new-password"
                        }
                        className="h-11 pr-11"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => toggle(item.name)}
                        aria-label={
                          visible[item.name]
                            ? "Ẩn mật khẩu"
                            : "Hiện mật khẩu"
                        }
                        className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-base hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {visible[item.name] ? (
                          <EyeOff aria-hidden className="size-4" />
                        ) : (
                          <Eye aria-hidden className="size-4" />
                        )}
                      </button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                type="button"
                className="h-11 sm:w-auto"
              >
                Huỷ
              </Button>
              <Button
                variant="destructive"
                type="submit"
                className="h-11 sm:w-auto"
                disabled={updatePasswordMutaion.isPending}
              >
                Cập nhật mật khẩu
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
