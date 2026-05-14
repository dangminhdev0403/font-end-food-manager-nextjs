"use client";

import { UserDialog } from "@/app/manage/users-roles/user-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Mail,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import { useUserRoleManagement } from "./hooks";

const statusConfig: Record<
  "active" | "inactive" | "suspended",
  {
    label: string;
    badgeClass: string;
    icon: LucideIcon;
  }
> = {
  active: {
    label: "Hoạt động",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  inactive: {
    label: "Không hoạt động",
    badgeClass: "border-border bg-muted text-muted-foreground",
    icon: AlertCircle,
  },
  suspended: {
    label: "Tạm khoá",
    badgeClass:
      "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300",
    icon: AlertCircle,
  },
};

export default function UsersRolesPage() {
  const {
    users,
    selectedUser,
    setSelectedUser,
    createUser,
    updateUser,
    deleteUser,
    assignRoleToUser,
    removeRoleFromUser,
    getRolesByUser,
    mockRoles,
  } = useUserRoleManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const filteredUsers = users.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowDialog(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      createUser(userData);
    }
    setShowDialog(false);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
  };

  const userRoles = selectedUser ? getRolesByUser(selectedUser.id) : [];

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-11">
                <Users aria-hidden className="size-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Quản lý người dùng
              </h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Quản lý vai trò và quyền hạn cho người dùng hệ thống
            </p>
          </div>
          <Button onClick={handleCreateUser} className="h-11 gap-2 self-start">
            <Plus aria-hidden className="size-4" />
            Thêm người dùng
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users aria-hidden className="size-5 text-primary" />
                  Danh sách người dùng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search
                    aria-hidden
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Tìm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Tìm người dùng"
                    className="h-11 pl-9"
                  />
                </div>

                <div className="max-h-[60dvh] space-y-2 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Không có người dùng
                    </p>
                  ) : (
                    filteredUsers.map((user: any) => {
                      const status =
                        statusConfig[
                          user.status as keyof typeof statusConfig
                        ] ?? statusConfig.inactive;
                      const isSelected = selectedUser?.id === user.id;
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          aria-pressed={isSelected}
                          className={cn(
                            "min-h-10 w-full rounded-md border p-3 text-left transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected
                              ? "border-primary bg-primary/10 text-foreground shadow-sm"
                              : "border-border bg-card hover:bg-accent",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {user.name}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn("shrink-0 text-xs", status.badgeClass)}
                            >
                              {status.label}
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {user.roleIds.length} vai trò
                          </p>
                        </button>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="space-y-6 p-4 sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h2 className="truncate text-2xl font-bold text-foreground sm:text-3xl">
                          {selectedUser.name}
                        </h2>
                        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail aria-hidden className="size-4" />
                          <span className="truncate">{selectedUser.email}</span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleEditUser(selectedUser)}
                          size="sm"
                          className="h-10 gap-2"
                        >
                          <Edit aria-hidden className="size-4" />
                          Chỉnh sửa
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(selectedUser.id)}
                          size="sm"
                          variant="outline"
                          className="h-10 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 aria-hidden className="size-4" />
                          Xoá
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Trạng thái
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            {(() => {
                              const Icon =
                                statusConfig[
                                  selectedUser.status as keyof typeof statusConfig
                                ]?.icon ?? AlertCircle;
                              return (
                                <Icon
                                  aria-hidden
                                  className="size-5 text-primary"
                                />
                              );
                            })()}
                            <span className="font-semibold text-foreground">
                              {
                                statusConfig[
                                  selectedUser.status as keyof typeof statusConfig
                                ]?.label
                              }
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Vai trò
                          </p>
                          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                            {selectedUser.roleIds.length}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Tham gia
                          </p>
                          <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">
                            {new Date(selectedUser.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Shield aria-hidden className="size-5 text-primary" />
                      Vai trò &amp; Quyền hạn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {userRoles.length > 0 ? (
                      <ul className="space-y-3">
                        {userRoles.map((role: any) => (
                          <li
                            key={role.id}
                            className="flex items-start justify-between gap-3 rounded-md border border-border bg-muted/40 p-4"
                          >
                            <div className="min-w-0">
                              <h4 className="font-bold text-foreground">
                                {role.name}
                              </h4>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {role.description}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeRoleFromUser(selectedUser.id, role.id)
                              }
                              aria-label={`Gỡ vai trò ${role.name}`}
                              className="size-9 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X aria-hidden className="size-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        Chưa có vai trò nào
                      </p>
                    )}

                    <div>
                      <p className="mb-3 text-sm font-semibold text-foreground">
                        Gán vai trò mới
                      </p>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {mockRoles
                          .filter(
                            (r: any) =>
                              !userRoles.find((ur: any) => ur.id === r.id),
                          )
                          .map((role: any) => (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() =>
                                assignRoleToUser(selectedUser.id, role.id)
                              }
                              className="min-h-10 rounded-md border border-border bg-card p-3 text-left transition-colors duration-base hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <p className="text-sm font-semibold text-foreground">
                                + {role.name}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {role.description}
                              </p>
                            </button>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-md bg-primary/10">
                    <Users aria-hidden className="size-8 text-primary" />
                  </div>
                  <p className="text-base font-medium text-foreground sm:text-lg">
                    Chọn một người dùng từ danh sách
                  </p>
                  <p className="text-sm text-muted-foreground">
                    để xem chi tiết vai trò và quyền hạn
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <UserDialog
          user={editingUser}
          roles={mockRoles}
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleSaveUser}
        />
      </Suspense>
    </main>
  );
}
