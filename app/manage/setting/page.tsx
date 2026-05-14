"use client";

import ChangePasswordForm from "@/app/manage/setting/change-password-form";
import UpdateProfileForm from "@/app/manage/setting/update-profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAccountProfileQuery } from "@/queries/useAccount";

export default function SettingPage() {
  const { data } = useAccountProfileQuery();
  const profile = data?.data;

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Cài đặt tài khoản
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Quản lý thông tin cá nhân và bảo mật
            </p>
          </div>
          {profile?.name && (
            <Badge variant="secondary" className="self-start text-xs">
              {profile.name}
            </Badge>
          )}
        </header>

        <ProfileSummary />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile" className="text-sm">
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger value="security" className="text-sm">
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <UpdateProfileForm />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function ProfileSummary() {
  const { data } = useAccountProfileQuery();
  const profile = data?.data;

  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
        <Avatar className="size-16 shrink-0 sm:size-20">
          <AvatarImage src="" alt={profile?.name || "Avatar"} />
          <AvatarFallback>
            {profile?.name?.slice(0, 2).toUpperCase() || "AC"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-base font-semibold text-foreground sm:text-lg">
            {profile?.name || "—"}
          </p>
          <p className="text-sm text-muted-foreground">Owner • Active</p>
        </div>
      </CardContent>
    </Card>
  );
}
