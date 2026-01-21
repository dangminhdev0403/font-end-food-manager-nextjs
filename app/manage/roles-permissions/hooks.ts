"use client";

import { Permission, Role, RoleWithPermissions } from "@/constants/types/rbac.type";
import { useState, useCallback } from "react";


// Mock data
const PERMISSIONS: Permission[] = [
  {
    id: "view_dashboard",
    name: "Xem Dashboard",
    description: "Xem tổng quan dashboard",
    category: "Dashboard",
    createdAt: new Date(),
  },
  {
    id: "view_menu",
    name: "Xem Thực Đơn",
    description: "Xem danh sách món ăn",
    category: "Menu",
    createdAt: new Date(),
  },
  {
    id: "edit_menu",
    name: "Chỉnh Sửa Thực Đơn",
    description: "Thêm, sửa, xóa món ăn",
    category: "Menu",
    createdAt: new Date(),
  },
  {
    id: "manage_inventory",
    name: "Quản Lý Kho",
    description: "Quản lý nguyên liệu",
    category: "Menu",
    createdAt: new Date(),
  },
  {
    id: "view_orders",
    name: "Xem Đơn Hàng",
    description: "Xem danh sách đơn hàng",
    category: "Đơn Hàng",
    createdAt: new Date(),
  },
  {
    id: "edit_orders",
    name: "Quản Lý Đơn Hàng",
    description: "Xác nhận, hủy đơn hàng",
    category: "Đơn Hàng",
    createdAt: new Date(),
  },
  {
    id: "manage_reservations",
    name: "Quản Lý Đặt Bàn",
    description: "Quản lý đặt bàn khách",
    category: "Đặt Bàn",
    createdAt: new Date(),
  },
  {
    id: "view_analytics",
    name: "Xem Báo Cáo",
    description: "Xem báo cáo doanh thu",
    category: "Báo Cáo",
    createdAt: new Date(),
  },
  {
    id: "export_data",
    name: "Xuất Dữ Liệu",
    description: "Xuất báo cáo",
    category: "Báo Cáo",
    createdAt: new Date(),
  },
  {
    id: "manage_staff",
    name: "Quản Lý Nhân Viên",
    description: "Thêm, sửa, xóa nhân viên",
    category: "Hệ Thống",
    createdAt: new Date(),
  },
  {
    id: "manage_roles",
    name: "Quản Lý Phân Quyền",
    description: "Quản lý vai trò và quyền hạn",
    category: "Hệ Thống",
    createdAt: new Date(),
  },
  {
    id: "system_settings",
    name: "Cài Đặt Hệ Thống",
    description: "Cài đặt hệ thống tổng quát",
    category: "Hệ Thống",
    createdAt: new Date(),
  },
];

const INITIAL_ROLES: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Quản trị viên hệ thống - có đầy đủ quyền hạn",
    permissionIds: PERMISSIONS.map((p) => p.id),
    userCount: 2,
    isSystem: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Quản Lý Nhà Hàng",
    description: "Quản lý hoạt động nhà hàng hàng ngày",
    permissionIds: [
      "view_dashboard",
      "view_menu",
      "edit_menu",
      "view_orders",
      "edit_orders",
      "manage_reservations",
      "view_analytics",
      "manage_staff",
    ],
    userCount: 3,
    isSystem: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "Nhân Viên Phục Vụ",
    description: "Nhân viên phục vụ khách hàng",
    permissionIds: ["view_menu", "view_orders", "manage_reservations"],
    userCount: 12,
    isSystem: false,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
];

export function useRBACManagement() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [permissions] = useState<Permission[]>(PERMISSIONS);

  const getRolesWithPermissions = useCallback((): RoleWithPermissions[] => {
    return roles.map((role) => ({
      ...role,
      permissions: permissions.filter((p) => role.permissionIds.includes(p.id)),
    }));
  }, [roles, permissions]);

  const createRole = useCallback(
    (name: string, description: string, permissionIds: string[]) => {
      const newRole: Role = {
        id: Date.now().toString(),
        name,
        description,
        permissionIds,
        userCount: 0,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setRoles((prev) => [...prev, newRole]);
      return newRole;
    },
    [],
  );

  const updateRole = useCallback(
    (id: string, updates: Partial<Omit<Role, "id">>) => {
      setRoles((prev) =>
        prev.map((role) =>
          role.id === id
            ? { ...role, ...updates, updatedAt: new Date() }
            : role,
        ),
      );
    },
    [],
  );

  const deleteRole = useCallback((id: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
  }, []);

  const getRoleById = useCallback(
    (id: string) => {
      const role = roles.find((r) => r.id === id);
      if (!role) return null;
      return {
        ...role,
        permissions: permissions.filter((p) =>
          role.permissionIds.includes(p.id),
        ),
      };
    },
    [roles, permissions],
  );

  const getPermissionsByCategory = useCallback(() => {
    return permissions.reduce(
      (acc, perm) => {
        if (!acc[perm.category]) {
          acc[perm.category] = [];
        }
        acc[perm.category].push(perm);
        return acc;
      },
      {} as Record<string, Permission[]>,
    );
  }, [permissions]);

  return {
    roles,
    permissions,
    getRolesWithPermissions,
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    getPermissionsByCategory,
  };
}
