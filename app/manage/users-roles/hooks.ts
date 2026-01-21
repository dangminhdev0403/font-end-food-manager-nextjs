"use client";

import { User } from "@/constants/types/rbac.type";
import { useState, useCallback } from "react";

// Mock data for demonstration
const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@restaurant.com",
    status: "active",
    roleIds: ["1", "2"],
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2024-01-19"),
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@restaurant.com",
    status: "active",
    roleIds: ["2"],
    createdAt: new Date("2024-02-01"),
    lastLogin: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@restaurant.com",
    status: "inactive",
    roleIds: ["3"],
    createdAt: new Date("2024-02-10"),
    lastLogin: new Date("2024-01-10"),
  },
  {
    id: "4",
    name: "Phạm Minh D",
    email: "phammind@restaurant.com",
    status: "active",
    roleIds: ["2", "3"],
    createdAt: new Date("2024-02-15"),
    lastLogin: new Date("2024-01-17"),
  },
];

const MOCK_ROLES = [
  { id: "1", name: "Admin", description: "Quản trị viên hệ thống" },
  { id: "2", name: "Quản Lý", description: "Quản lý nhà hàng" },
  { id: "3", name: "Nhân Viên", description: "Nhân viên phục vụ" },
];

export function useUserRoleManagement() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // CRUD Operations
  const createUser = useCallback((user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, []);

  const updateUser = useCallback(
    (userId: string, updates: Partial<User>) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)),
      );
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, ...updates } : null));
      }
    },
    [selectedUser],
  );

  const deleteUser = useCallback(
    (userId: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    },
    [selectedUser],
  );

  // Role assignment
  const assignRoleToUser = useCallback(
    (userId: string, roleId: string) => {
      updateUser(userId, {
        roleIds: Array.from(
          new Set([
            ...(users.find((u) => u.id === userId)?.roleIds || []),
            roleId,
          ]),
        ),
      });
    },
    [updateUser, users],
  );

  const removeRoleFromUser = useCallback(
    (userId: string, roleId: string) => {
      updateUser(userId, {
        roleIds:
          users
            .find((u) => u.id === userId)
            ?.roleIds.filter((r) => r !== roleId) || [],
      });
    },
    [updateUser, users],
  );

  const getRolesByUser = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      return user
        ? user.roleIds
            .map((roleId) => MOCK_ROLES.find((r) => r.id === roleId))
            .filter(Boolean)
        : [];
    },
    [users],
  );

  const getUsersByRole = useCallback(
    (roleId: string) => {
      return users.filter((u) => u.roleIds.includes(roleId));
    },
    [users],
  );

  const changeUserStatus = useCallback(
    (userId: string, status: "active" | "inactive" | "suspended") => {
      updateUser(userId, { status });
    },
    [updateUser],
  );

  return {
    users,
    selectedUser,
    setSelectedUser,
    createUser,
    updateUser,
    deleteUser,
    assignRoleToUser,
    removeRoleFromUser,
    getRolesByUser,
    getUsersByRole,
    changeUserStatus,
    mockRoles: MOCK_ROLES,
  };
}

// Alias for stats component
export const useUserManagement = useUserRoleManagement;
