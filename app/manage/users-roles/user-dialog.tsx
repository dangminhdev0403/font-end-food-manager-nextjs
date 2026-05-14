"use client";

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
import { User } from "@/constants/types/rbac.type";
import { useEffect, useState } from "react";

interface UserDialogProps {
  user: User | null;
  roles: Array<{ id: string; name: string; description: string }>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, "id" | "createdAt">) => void;
}

export function UserDialog({
  user,
  roles,
  isOpen,
  onClose,
  onSave,
}: Readonly<UserDialogProps>) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSelectedRoles(user.roleIds);
    } else {
      setName("");
      setEmail("");
      setSelectedRoles([]);
    }
  }, [user, isOpen]);

  const handleSave = () => {
    onSave({
      name,
      email,
      status: user?.status || "active",
      roleIds: selectedRoles,
    });
    onClose();
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId],
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {user ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Cập nhật thông tin và vai trò của người dùng."
              : "Nhập thông tin và chọn vai trò cho người dùng mới."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="user-name">Tên người dùng</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@restaurant.com"
              className="h-11"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Vai trò</p>
            <ul className="space-y-2">
              {roles.map((role) => {
                const checked = selectedRoles.includes(role.id);
                const inputId = `user-role-${role.id}`;
                return (
                  <li key={role.id}>
                    <label
                      htmlFor={inputId}
                      className="flex min-h-10 cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 transition-colors duration-base hover:bg-accent"
                    >
                      <Checkbox
                        id={inputId}
                        checked={checked}
                        onCheckedChange={() => toggleRole(role.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {role.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11"
          >
            Huỷ
          </Button>
          <Button type="button" onClick={handleSave} className="h-11">
            {user ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
