"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { User } from "@/constants/types/rbac.type";

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
}: UserDialogProps) {
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur border-b border-slate-700/50 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {user ? "✏️ Chỉnh Sửa Người Dùng" : "➕ Tạo Người Dùng Mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-white font-bold mb-2 text-sm">
              Tên Người Dùng
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ví dụ: Nguyễn Văn A"
              className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-600 focus:border-emerald-500/50"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-white font-bold mb-2 text-sm">
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@restaurant.com"
              type="email"
              className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-600 focus:border-emerald-500/50"
            />
          </div>

          {/* Roles Selection */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full" />
              Vai Trò
            </h3>
            <div className="space-y-3">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-slate-700/40 to-slate-800/40 hover:from-emerald-600/20 hover:to-teal-600/20 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 group"
                >
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={() => toggleRole(role.id)}
                    className="mt-1 border-slate-500 group-hover:border-emerald-400"
                  />
                  <div className="flex-1">
                    <p className="text-white font-semibold group-hover:text-emerald-300 transition-colors">
                      {role.name}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      {role.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur border-t border-slate-700/50 p-6 flex gap-3 justify-end">
          <Button
            onClick={onClose}
            className="bg-slate-700/50 hover:bg-slate-700 text-slate-200 hover:text-white px-6 py-2 rounded-lg transition-all"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-emerald-500/50"
          >
            {user ? "Cập Nhật" : "Tạo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
