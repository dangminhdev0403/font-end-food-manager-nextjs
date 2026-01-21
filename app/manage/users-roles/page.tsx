"use client";

import { UserDialog } from "@/app/manage/users-roles/user-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useUserRoleManagement } from "./hooks";

export default function UsersRolesPage() {
  const searchParams = useSearchParams();
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
    changeUserStatus,
    mockRoles,
  } = useUserRoleManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowDialog(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleSaveUser = (userData) => {
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

  const statusConfig = {
    active: {
      label: "Hoạt Động",
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      icon: CheckCircle2,
    },
    inactive: {
      label: "Không Hoạt Động",
      color: "bg-slate-500/20 text-slate-300 border-slate-500/50",
      icon: AlertCircle,
    },
    suspended: {
      label: "Tạm Khóa",
      color: "bg-red-500/20 text-red-300 border-red-500/50",
      icon: AlertCircle,
    },
  };

  const userRoles = selectedUser ? getRolesByUser(selectedUser.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 lg:p-8 text-lg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 animate-fade-in-down">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <Users size={24} className="text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Quản Lý Người Dùng
              </h1>
            </div>
            <p className="text-slate-400 text-base ml-11">
              Quản lý vai trò và quyền hạn cho người dùng hệ thống
            </p>
          </div>
          <Button
            onClick={handleCreateUser}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            <Plus size={20} />
            Thêm Người Dùng
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users List Sidebar */}
          <div className="lg:col-span-1 animate-fade-in-left">
            <Card className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-6 sticky top-6 max-h-[calc(100vh-8rem)] flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-blue-400" />
                Danh Sách Người Dùng
              </h2>

              <div className="mb-4 relative">
                <Search
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <Input
                  placeholder="Tìm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white pl-10 placeholder:text-slate-600 text-md focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-2 overflow-y-auto flex-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 text-md">
                    Không có người dùng
                  </p>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-300 animate-fade-in-up border ${
                        selectedUser?.id === user.id
                          ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/50 text-white shadow-lg shadow-blue-500/10"
                          : "bg-slate-700/30 border-slate-700/30 text-slate-300 hover:bg-slate-700/60 hover:border-slate-600/50"
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-md line-clamp-1">
                            {user.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {user.email}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs flex-shrink-0 ml-2 ${statusConfig[user.status].color} border`}
                        >
                          {statusConfig[user.status].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">
                        {user.roleIds.length} vai trò
                      </p>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* User Details */}
          <div className="lg:col-span-2 animate-fade-in-right">
            {selectedUser ? (
              <div className="space-y-6">
                {/* User Info Card */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2">
                        {selectedUser.name}
                      </h2>
                      <div className="flex items-center gap-2 text-slate-400 text-md">
                        <Mail size={16} />
                        {selectedUser.email}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditUser(selectedUser)}
                        className="bg-blue-600/80 hover:bg-blue-600 text-white gap-2 px-4 py-2 rounded-lg transition-all"
                        size="sm"
                      >
                        <Edit size={16} />
                        Chỉnh Sửa
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(selectedUser.id)}
                        className="bg-red-600/20 text-red-400 hover:bg-red-600/40 gap-2 px-4 py-2 rounded-lg transition-all border border-red-500/20"
                        size="sm"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">
                        Trạng Thái
                      </p>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const Icon = statusConfig[selectedUser.status].icon;
                          return <Icon size={20} className="text-blue-400" />;
                        })()}
                        <span className="text-white font-semibold">
                          {statusConfig[selectedUser.status].label}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">
                        Vai Trò
                      </p>
                      <p className="text-3xl font-black text-emerald-400">
                        {selectedUser.roleIds.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">
                        Tham Gia
                      </p>
                      <p className="text-white text-md font-semibold">
                        {new Date(selectedUser.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Roles and Permissions Card */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-emerald-400" />
                    Vai Trò & Quyền Hạn
                  </h3>

                  {userRoles.length > 0 ? (
                    <div className="space-y-4">
                      {userRoles.map((role) => (
                        <div
                          key={role.id}
                          className="p-4 rounded-lg bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/30 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-bold">
                                {role.name}
                              </h4>
                              <p className="text-slate-500 text-md mt-1">
                                {role.description}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                removeRoleFromUser(selectedUser.id, role.id)
                              }
                              className="text-slate-400 hover:text-red-400 transition-colors p-1 hover:bg-red-600/20 rounded-lg"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">
                      Chưa có vai trò nào
                    </p>
                  )}

                  {/* Assign Role Dropdown */}
                  <div className="mt-6">
                    <label className="block text-white font-bold mb-3 text-md">
                      Gán Vai Trò Mới
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {mockRoles
                        .filter((r) => !userRoles.find((ur) => ur.id === r.id))
                        .map((role) => (
                          <button
                            key={role.id}
                            onClick={() =>
                              assignRoleToUser(selectedUser.id, role.id)
                            }
                            className="p-3 rounded-lg bg-gradient-to-br from-slate-700/40 to-slate-800/40 hover:from-blue-600/20 hover:to-cyan-600/20 border border-slate-700/50 hover:border-blue-500/50 transition-all text-left"
                          >
                            <p className="text-white font-semibold text-md hover:text-blue-300">
                              + {role.name}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {role.description}
                            </p>
                          </button>
                        ))}
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 p-12 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="inline-block p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl mb-4">
                    <Users size={48} className="text-blue-400" />
                  </div>
                  <p className="text-slate-300 text-base font-medium">
                    Chọn một người dùng từ danh sách
                  </p>
                  <p className="text-slate-500 text-md mt-1">
                    để xem chi tiết vai trò và quyền hạn
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* User Dialog */}
      <Suspense fallback={null}>
        <UserDialog
          user={editingUser}
          roles={mockRoles}
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleSaveUser}
        />
      </Suspense>
    </div>
  );
}
