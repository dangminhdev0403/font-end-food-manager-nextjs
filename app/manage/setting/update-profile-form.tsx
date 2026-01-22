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
  const email = form.watch("email");
  const name = form.watch("name");
  const previewAvatar = file ? URL.createObjectURL(file) : avatar;
  useEffect(() => {
    if (!profile) return;

    form.reset({
      name: profile.name,
      email: profile.email,
      // avatar: profile.avatar,
    });
  }, [profile, form]);

  return (
    <Form {...form}>
      <form className="space-y-6" noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Thông tin này sẽ hiển thị trên hồ sơ của bạn
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewAvatar} />
                  <AvatarFallback>{name?.[0]}</AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 hidden group-hover:flex items-center justify-center rounded-full bg-black/40 text-white"
                >
                  <Upload className="h-5 w-5" />
                </button>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                JPG, PNG • Tối đa 2MB
              </p>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Tên hiển thị</Label>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Name */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="reset">
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
