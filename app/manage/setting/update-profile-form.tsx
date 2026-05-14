"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAccountProfileQuery } from "@/queries/useAccount";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdateProfileForm() {
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { data } = useAccountProfileQuery();

  const profile = data?.data;
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: { name: profile?.name, avatar: "", email: profile?.email },
  });

  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const previewAvatar = file ? URL.createObjectURL(file) : avatar;

  useEffect(() => {
    if (!profile) return;

    form.reset({
      name: profile?.name,
      email: profile?.email,
    });
  }, [profile, form]);

  return (
    <Form {...form}>
      <form className="space-y-6" noValidate>
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Thông tin cá nhân
            </CardTitle>
            <CardDescription className="text-sm">
              Thông tin này sẽ hiển thị trên hồ sơ của bạn
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="group relative">
                <Avatar className="size-20 sm:size-24">
                  <AvatarImage src={previewAvatar} alt={name || "Avatar"} />
                  <AvatarFallback>{name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label="Thay đổi ảnh đại diện"
                  className="absolute inset-0 hidden items-center justify-center rounded-full bg-foreground/40 text-background transition-opacity duration-base group-hover:flex group-focus-within:flex"
                >
                  <Upload aria-hidden className="size-5" />
                </button>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Tải ảnh đại diện"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Ảnh đại diện
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG • Tối đa 2MB
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="profile-name">Tên hiển thị</Label>
                  <Input id="profile-name" className="h-11" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    className="h-11"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                type="reset"
                className="h-11 sm:w-auto"
              >
                Huỷ
              </Button>
              <Button type="submit" className="h-11 sm:w-auto">
                Lưu thay đổi
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
