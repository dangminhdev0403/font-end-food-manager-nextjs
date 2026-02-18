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
    password: false,
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

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Đổi mật khẩu</CardTitle>
            <CardDescription>
              Bạn sẽ bị đăng xuất khỏi các thiết bị khác sau khi đổi mật khẩu.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {(
              [
                { name: "oldPassword", label: "Mật khẩu cũ" },
                { name: "newPassword", label: "Mật khẩu mới" },
                { name: "confirmPassword", label: "Nhập lại mật khẩu mới" },
              ] as const
            ).map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <Label>{item.label}</Label>

                    <div className="relative">
                      <Input
                        type={visible[item.name] ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => toggle(item.name)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {visible[item.name] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button">
                Hủy
              </Button>
              <Button variant="destructive" type="submit">
                Cập nhật mật khẩu
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
