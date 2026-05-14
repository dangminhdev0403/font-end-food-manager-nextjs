"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Permission, Role } from "@/constants/types/rbac.type";

interface RoleDialogProps {
  role?: Role | null;
  permissions: Record<string, Permission[]>;
  onSave: (name: string, description: string, permissionIds: string[]) => void;
  onClose: () => void;
}

export function RoleDialog({
  role,
  permissions,
  onSave,
  onClose,
}: Readonly<RoleDialogProps>) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissionIds || [],
  );

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setSelectedPermissions(role.permissionIds);
    }
  }, [role]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, description, selectedPermissions);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border p-4 sm:p-6">
          <DialogTitle className="text-lg font-semibold sm:text-xl">
            {role ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {role
              ? "Cập nhật thông tin và quyền hạn của vai trò."
              : "Định nghĩa vai trò mới với các quyền hạn phù hợp."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60dvh] overflow-y-auto">
          <div className="space-y-6 p-4 sm:p-6">
            <div className="space-y-2">
              <Label htmlFor="role-name">Tên vai trò</Label>
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Quản lý nhà hàng"
                className="h-11"
                aria-required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description">Mô tả</Label>
              <Input
                id="role-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết vai trò này"
                className="h-11"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground sm:text-base">
                  Phân quyền
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Chọn các quyền hạn cho vai trò này
                </p>
              </div>

              {Object.entries(permissions).map(([category, perms]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {perms.map((permission) => {
                      const isChecked = selectedPermissions.includes(
                        permission.id,
                      );
                      return (
                        <label
                          key={permission.id}
                          htmlFor={`perm-${permission.id}`}
                          className="flex min-h-10 cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 transition-colors duration-base hover:bg-accent has-checked:border-primary has-checked:bg-primary/5"
                        >
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={isChecked}
                            onCheckedChange={() =>
                              handleTogglePermission(permission.id)
                            }
                            className="mt-0.5"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {permission.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted/30 p-4 sm:p-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11"
          >
            Huỷ
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="h-11"
          >
            {role ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
