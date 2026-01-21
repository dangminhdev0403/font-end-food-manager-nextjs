"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Shield,
  Users,
  ChevronRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Suspense } from "react";
import { useRBACManagement } from "@/app/manage/roles-permissions/hooks";
import { RoleDialog } from "@/app/manage/roles-permissions/role-dialog";
import Loading from "@/app/manage/roles-permissions/loading";
import { Role } from "@/constants/types/rbac.type";

export default function RolesPermissionsPage() {
  const {
    roles,
    permissions,
    getRolesWithPermissions,
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    getPermissionsByCategory,
  } = useRBACManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const rolesWithPermissions = getRolesWithPermissions();
  const permissionsByCategory = getPermissionsByCategory();

  const filteredRoles = rolesWithPermissions.filter((role) =>
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
    if (confirm("Bạn có chắc chắn muốn xóa vai trò này?")) {
      deleteRole(roleId);
      if (selectedRole?.id === roleId) {
        setSelectedRole(null);
      }
    }
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 lg:p-8 text-lg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 animate-fade-in-down">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <Shield size={24} className="text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Phân Quyền & Vai Trò
              </h1>
            </div>
            <p className="text-slate-400 text-base ml-11">
              RBAC Management - Kiểm soát quyền hạn dựa trên vai trò
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingRole(null);
              setShowDialog(true);
            }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 animate-scale-in"
          >
            <Plus size={20} />
            Tạo Vai Trò
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roles List Sidebar */}
          <div className="lg:col-span-1 animate-fade-in-left">
            <Card className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-6 sticky top-6 max-h-[calc(100vh-8rem)] flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-emerald-400" />
                Danh Sách Vai Trò
              </h2>

              <div className="mb-4 relative">
                <Search
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <Input
                  placeholder="Tìm vai trò..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white pl-10 placeholder:text-slate-600 text-md focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-2 overflow-y-auto flex-1">
                {filteredRoles.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 text-md">
                    Không có vai trò nào
                  </p>
                ) : (
                  filteredRoles.map((role, idx) => (
                    <button
                      key={role.id}
                      onClick={() => handleSelectRole(role)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-300 animate-fade-in-up border ${
                        selectedRole?.id === role.id
                          ? "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10"
                          : "bg-slate-700/30 border-slate-700/30 text-slate-300 hover:bg-slate-700/60 hover:border-slate-600/50"
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-md line-clamp-1">
                          {role.name}
                        </h3>
                        <Badge
                          className={`text-xs flex-shrink-0 ${
                            selectedRole?.id === role.id
                              ? "bg-emerald-600/40 text-emerald-200 border border-emerald-500/50"
                              : "bg-slate-600/50 text-slate-300"
                          }`}
                        >
                          {role.userCount}
                        </Badge>
                      </div>
                      <p
                        className={`text-xs line-clamp-2 ${
                          selectedRole?.id === role.id
                            ? "text-slate-200"
                            : "text-slate-500"
                        }`}
                      >
                        {role.description}
                      </p>
                      {role.isSystem && (
                        <Badge className="mt-2 bg-purple-600/30 text-purple-300 text-xs border border-purple-500/50">
                          <Lock size={12} className="mr-1 inline" />
                          Hệ thống
                        </Badge>
                      )}
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Role Details */}
          <div className="lg:col-span-2 animate-fade-in-right">
            {selectedRole ? (
              <div className="space-y-6">
                {/* Role Info Card */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2">
                        {selectedRole.name}
                      </h2>
                      <p className="text-slate-400 text-base">
                        {selectedRole.description}
                      </p>
                    </div>
                    {!selectedRole.isSystem && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditRole(selectedRole)}
                          className="bg-emerald-600/80 hover:bg-emerald-600 text-white gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                          size="sm"
                        >
                          <Edit size={16} />
                          Chỉnh Sửa
                        </Button>
                        <Button
                          onClick={() => handleDeleteRole(selectedRole.id)}
                          className="bg-red-600/20 text-red-400 hover:bg-red-600/40 gap-2 px-4 py-2 rounded-lg transition-all duration-300 border border-red-500/20"
                          size="sm"
                        >
                          <Trash2 size={16} />
                          Xóa
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">
                        Người Dùng
                      </p>
                      <p className="text-3xl font-black text-emerald-400">
                        {selectedRole.userCount}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">
                        Quyền Hạn
                      </p>
                      <p className="text-3xl font-black text-blue-400">
                        {selectedRole.permissionIds.length}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Permissions Card */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                    Quyền Hạn
                  </h3>

                  <div className="space-y-8">
                    {Object.entries(permissionsByCategory).map(
                      ([category, perms]) => {
                        const categoryPermissions = perms.filter((p) =>
                          selectedRole.permissionIds.includes(p.id),
                        );

                        return (
                          <div key={category}>
                            <h4 className="text-white font-bold mb-3 text-md uppercase tracking-widest text-slate-300 flex items-center gap-2">
                              <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                              {category}
                            </h4>
                            {categoryPermissions.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {categoryPermissions.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="p-4 rounded-lg bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 group cursor-pointer"
                                  >
                                    <div className="flex items-start gap-3">
                                      <CheckCircle2
                                        size={16}
                                        className="text-emerald-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                                      />
                                      <div>
                                        <p className="text-white text-md font-semibold">
                                          {permission.name}
                                        </p>
                                        <p className="text-slate-500 text-xs mt-1">
                                          {permission.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-600 text-md italic">
                                Không có quyền hạn
                              </p>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 p-12 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="inline-block p-4 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl mb-4">
                    <Shield size={48} className="text-emerald-400" />
                  </div>
                  <p className="text-slate-300 text-base font-medium">
                    Chọn một vai trò từ danh sách
                  </p>
                  <p className="text-slate-500 text-md mt-1">
                    để xem chi tiết quyền hạn
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Role Dialog */}
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
    </div>
  );
}
