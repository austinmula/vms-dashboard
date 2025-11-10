"use client";

import React, { useState } from "react";
import { Space } from "antd";
import { PermissionList } from "@/components/rbac/PermissionList";
import { PermissionForm } from "@/components/rbac/PermissionForm";
import { Permission } from "@/lib/api/permissions";
import { PermissionGate } from "@/components/wrappers/PermissionGate";

export default function PermissionsPage() {
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setSelectedPermission(null);
    setIsFormVisible(true);
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setSelectedPermission(null);
  };

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PermissionGate
      permission="permissions:read"
      fallback={
        <div style={{ padding: "24px", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <p>You do not have permission to view permissions.</p>
        </div>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <PermissionList
          key={refreshKey}
          onEdit={handleEdit}
          onCreate={handleCreate}
        />

        <PermissionForm
          visible={isFormVisible}
          permission={selectedPermission}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      </Space>
    </PermissionGate>
  );
}
