"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
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
}: RoleDialogProps) {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur border-b border-slate-700/50 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {role ? "✏️ Chỉnh Sửa Vai Trò" : "➕ Tạo Vai Trò Mới"}
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
              Tên Vai Trò
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ví dụ: Quản Lý Nhà Hàng"
              className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-600 focus:border-emerald-500/50 text-sm"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-white font-bold mb-2 text-sm">
              Mô Tả
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết vai trò này"
              className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-600 focus:border-emerald-500/50 text-sm"
            />
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full" />
              Phân Quyền
            </h3>
            <div className="space-y-6">
              {Object.entries(permissions).map(([category, perms]) => (
                <div key={category}>
                  <h4 className="text-emerald-400 font-bold mb-3 text-xs uppercase tracking-widest opacity-90">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {perms.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-slate-700/40 to-slate-800/40 hover:from-emerald-600/20 hover:to-teal-600/20 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 group"
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() =>
                            handleTogglePermission(permission.id)
                          }
                          className="mt-1 border-slate-500 group-hover:border-emerald-400"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm font-semibold group-hover:text-emerald-300 transition-colors">
                            {permission.name}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur border-t border-slate-700/50 p-6 flex gap-3 justify-end">
          <Button
            onClick={onClose}
            className="bg-slate-700/50 hover:bg-slate-700 text-slate-200 hover:text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
          >
            {role ? "Cập Nhật" : "Tạo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
