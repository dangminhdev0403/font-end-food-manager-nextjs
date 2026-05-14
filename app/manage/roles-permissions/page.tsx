"use client";

import Loading from "@/app/manage/roles-permissions/loading";
import { RoleDialog } from "@/app/manage/roles-permissions/role-dialog";
import { useRBACManagement } from "@/app/manage/roles-permissions/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Role } from "@/constants/types/rbac.type";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Edit,
  Lock,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { Suspense, useState } from "react";

export default function RolesPermissionsPage() {
  const {
    getRolesWithPermissions,
    createRole,
    updateRole,
    deleteRole,
    getPermissionsByCategory,
  } = useRBACManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const rolesWithPermissions = getRolesWithPermissions();
  const permissionsByCategory = getPermissionsByCategory();

  const filteredRoles = rolesWithPermissions.filter((role: Role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateRole = (
    name: string,
    description: string,
    permissionIds: string[],
  ) => {
    createRole(name, description, permissionIds);
    setShowDialog(false);
    setEditingRole(null);
  };

  const handleUpdateRole = (
    name: string,
    description: string,
    permissionIds: string[],
  ) => {
    if (editingRole) {
      updateRole(editingRole.id, {
        name,
        description,
        permissionIds,
      });
      setShowDialog(false);
      setEditingRole(null);
      setSelectedRole(null);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowDialog(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá vai trò này?")) {
      deleteRole(roleId);
      if (selectedRole?.id === roleId) {
        setSelectedRole(null);
      }
    }
  };

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary sm:size-11">
                <Shield aria-hidden className="size-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Phân quyền &amp; vai trò
              </h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Quản lý quyền hạn dựa trên vai trò (RBAC)
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingRole(null);
              setShowDialog(true);
            }}
            className="h-11 gap-2 self-start"
          >
            <Plus aria-hidden className="size-4" />
            Tạo vai trò
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users aria-hidden className="size-5 text-primary" />
                  Danh sách vai trò
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search
                    aria-hidden
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Tìm vai trò..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Tìm vai trò"
                    className="h-11 pl-9"
                  />
                </div>

                <div className="max-h-[60dvh] space-y-2 overflow-y-auto">
                  {filteredRoles.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Không có vai trò
                    </p>
                  ) : (
                    filteredRoles.map((role: Role) => {
                      const isSelected = selectedRole?.id === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          aria-pressed={isSelected}
                          className={cn(
                            "min-h-10 w-full rounded-md border p-3 text-left transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected
                              ? "border-primary bg-primary/10 text-foreground shadow-sm"
                              : "border-border bg-card hover:bg-accent",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="truncate text-sm font-semibold text-foreground">
                              {role.name}
                            </h3>
                            <Badge
                              variant={isSelected ? "default" : "secondary"}
                              className="shrink-0 text-xs"
                            >
                              {role.userCount}
                            </Badge>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {role.description}
                          </p>
                          {role.isSystem && (
                            <Badge
                              variant="outline"
                              className="mt-2 gap-1 text-xs"
                            >
                              <Lock aria-hidden className="size-3" />
                              Hệ thống
                            </Badge>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedRole ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="space-y-6 p-4 sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h2 className="truncate text-2xl font-bold text-foreground sm:text-3xl">
                          {selectedRole.name}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                          {selectedRole.description}
                        </p>
                      </div>
                      {!selectedRole.isSystem && (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => handleEditRole(selectedRole)}
                            size="sm"
                            className="h-10 gap-2"
                          >
                            <Edit aria-hidden className="size-4" />
                            Chỉnh sửa
                          </Button>
                          <Button
                            onClick={() => handleDeleteRole(selectedRole.id)}
                            size="sm"
                            variant="outline"
                            className="h-10 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 aria-hidden className="size-4" />
                            Xoá
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Người dùng
                          </p>
                          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                            {selectedRole.userCount}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Quyền hạn
                          </p>
                          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                            {selectedRole.permissionIds.length}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <CheckCircle2
                        aria-hidden
                        className="size-5 text-primary"
                      />
                      Quyền hạn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(permissionsByCategory).map(
                      ([category, perms]: [string, any]) => {
                        const categoryPermissions = perms.filter((p: any) =>
                          selectedRole.permissionIds.includes(p.id),
                        );
                        return (
                          <div key={category}>
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                              {category}
                            </h4>
                            {categoryPermissions.length > 0 ? (
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {categoryPermissions.map((permission: any) => (
                                  <div
                                    key={permission.id}
                                    className="flex items-start gap-3 rounded-md border border-border bg-muted/40 p-4"
                                  >
                                    <CheckCircle2
                                      aria-hidden
                                      className="mt-0.5 size-4 shrink-0 text-primary"
                                    />
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">
                                        {permission.name}
                                      </p>
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        {permission.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm italic text-muted-foreground">
                                Không có quyền hạn
                              </p>
                            )}
                          </div>
                        );
                      },
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-md bg-primary/10">
                    <Shield aria-hidden className="size-8 text-primary" />
                  </div>
                  <p className="text-base font-medium text-foreground sm:text-lg">
                    Chọn một vai trò từ danh sách
                  </p>
                  <p className="text-sm text-muted-foreground">
                    để xem chi tiết quyền hạn
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        {showDialog && (
          <RoleDialog
            role={editingRole}
            permissions={permissionsByCategory}
            onSave={editingRole ? handleUpdateRole : handleCreateRole}
            onClose={() => {
              setShowDialog(false);
              setEditingRole(null);
            }}
          />
        )}
      </Suspense>
    </main>
  );
}
