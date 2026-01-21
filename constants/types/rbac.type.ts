// User-Role Management Types (RBAC)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive" | "suspended";
  roleIds: string[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserWithRoles extends User {
  roles: Array<{
    id: string;
    name: string;
    description: string;
    permissions: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  }>;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
}

// RBAC Type Definitions
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissionIds: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}
