"use client";

import React, { useState } from "react";
import { Card, Tabs } from "antd";
import {
  SafetyOutlined,
  KeyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { RoleList } from "@/components/rbac/RoleList";
import { RoleForm } from "@/components/rbac/RoleForm";
import { PermissionList } from "@/components/rbac/PermissionList";
import { PermissionForm } from "@/components/rbac/PermissionForm";
import { Role } from "@/lib/api/roles";
import { Permission } from "@/lib/api/permissions";
import { PermissionGate } from "@/components/wrappers/PermissionGate";

type TabKey = "roles" | "permissions";

export default function RBACPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("roles");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [isRoleFormVisible, setIsRoleFormVisible] = useState(false);
  const [isPermissionFormVisible, setIsPermissionFormVisible] = useState(false);
  const [refreshRolesKey, setRefreshRolesKey] = useState(0);
  const [refreshPermissionsKey, setRefreshPermissionsKey] = useState(0);

  // TODO: Get this from the authenticated user's context
  const organizationId = "your-org-id-here";

  // Role handlers
  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsRoleFormVisible(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleFormVisible(true);
  };

  const handleRoleFormClose = () => {
    setIsRoleFormVisible(false);
    setSelectedRole(null);
  };

  const handleRoleFormSuccess = () => {
    setRefreshRolesKey((prev) => prev + 1);
  };

  const handleViewUsers = (role: Role) => {
    console.log("View users for role:", role);
    // You could implement a modal to show users with this role
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsRoleFormVisible(true);
  };

  // Permission handlers
  const handleCreatePermission = () => {
    setSelectedPermission(null);
    setIsPermissionFormVisible(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsPermissionFormVisible(true);
  };

  const handlePermissionFormClose = () => {
    setIsPermissionFormVisible(false);
    setSelectedPermission(null);
  };

  const handlePermissionFormSuccess = () => {
    setRefreshPermissionsKey((prev) => prev + 1);
    // Also refresh roles if permissions changed
    setRefreshRolesKey((prev) => prev + 1);
  };

  const items = [
    {
      key: "roles",
      label: (
        <span>
          <SafetyOutlined /> Roles
        </span>
      ),
      children: (
        <PermissionGate
          permission="roles:read"
          fallback={
            <div style={{ padding: "24px", textAlign: "center" }}>
              <h3>Access Denied</h3>
              <p>You do not have permission to view roles.</p>
            </div>
          }
        >
          <RoleList
            key={refreshRolesKey}
            organizationId={organizationId}
            onEdit={handleEditRole}
            onCreate={handleCreateRole}
            onViewUsers={handleViewUsers}
            onManagePermissions={handleManagePermissions}
          />
        </PermissionGate>
      ),
    },
    {
      key: "permissions",
      label: (
        <span>
          <KeyOutlined /> Permissions
        </span>
      ),
      children: (
        <PermissionGate
          permission="permissions:read"
          fallback={
            <div style={{ padding: "24px", textAlign: "center" }}>
              <h3>Access Denied</h3>
              <p>You do not have permission to view permissions.</p>
            </div>
          }
        >
          <PermissionList
            key={refreshPermissionsKey}
            onEdit={handleEditPermission}
            onCreate={handleCreatePermission}
          />
        </PermissionGate>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={
          <div>
            <h2 style={{ margin: 0 }}>
              <TeamOutlined /> Access Control Management
            </h2>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
              Manage roles, permissions, and user access across your
              organization
            </p>
          </div>
        }
        bordered={false}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          items={items}
          size="large"
        />
      </Card>

      <RoleForm
        visible={isRoleFormVisible}
        role={selectedRole}
        organizationId={organizationId}
        onClose={handleRoleFormClose}
        onSuccess={handleRoleFormSuccess}
      />

      <PermissionForm
        visible={isPermissionFormVisible}
        permission={selectedPermission}
        onClose={handlePermissionFormClose}
        onSuccess={handlePermissionFormSuccess}
      />
    </div>
  );
}
