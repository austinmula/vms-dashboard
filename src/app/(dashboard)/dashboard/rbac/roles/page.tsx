"use client";

import React, { useState } from "react";
import { Space, Tabs } from "antd";
import { RoleList } from "@/components/rbac/RoleList";
import { RoleForm } from "@/components/rbac/RoleForm";
import { UserRoleAssignment } from "@/components/rbac/UserRoleAssignment";
import { Role } from "@/lib/api/roles";
import { PermissionGate } from "@/components/wrappers/PermissionGate";

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUserAssignmentVisible, setIsUserAssignmentVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // TODO: Get this from the authenticated user's context
  const organizationId = "your-org-id-here";

  const handleCreate = () => {
    setSelectedRole(null);
    setIsFormVisible(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setSelectedRole(null);
  };

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleViewUsers = (role: Role) => {
    // You could implement a modal to show users with this role
    console.log("View users for role:", role);
  };

  const handleManagePermissions = (role: Role) => {
    // Open the role form in edit mode to manage permissions
    setSelectedRole(role);
    setIsFormVisible(true);
  };

  return (
    <PermissionGate
      permission="roles:read"
      fallback={
        <div style={{ padding: "24px", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <p>You do not have permission to view roles.</p>
        </div>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <RoleList
          key={refreshKey}
          organizationId={organizationId}
          onEdit={handleEdit}
          onCreate={handleCreate}
          onViewUsers={handleViewUsers}
          onManagePermissions={handleManagePermissions}
        />

        <RoleForm
          visible={isFormVisible}
          role={selectedRole}
          organizationId={organizationId}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      </Space>
    </PermissionGate>
  );
}
