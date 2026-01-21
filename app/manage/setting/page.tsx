"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ChangePasswordForm from "@/app/manage/setting/change-password-form";
import UpdateProfileForm from "@/app/manage/setting/update-profile-form";

/* =========================
   PAGE
========================= */
export default function SettingPage() {
  return (
    <main className="flex-1 space-y-6 p-6 text-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cài đặt tài khoản
          </h1>
          <p className="text-md text-muted-foreground">
            Quản lý thông tin cá nhân và bảo mật
          </p>
        </div>
        <Badge variant="secondary">Owner</Badge>
      </div>

      {/* Profile Summary */}
      <ProfileSummary />

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="security">Đổi mật khẩu</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <UpdateProfileForm />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </main>
  );
}

/* =========================
   PROFILE SUMMARY
========================= */
function ProfileSummary() {
  return (
    <Card className="flex items-center gap-4 p-6">
      <Avatar className="h-16 w-16">
        <AvatarImage src="" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="text-lg font-medium">User Name</p>
        <p className="text-md text-muted-foreground">Owner • Active</p>
      </div>
    </Card>
  );
}
