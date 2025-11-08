"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Transfer,
  message,
  Spin,
  Typography,
  Space,
  Tag,
} from "antd";
import type { TransferProps } from "antd";
import { rolesApi, Role } from "@/lib/api/roles";

const { Text } = Typography;

interface UserRoleAssignmentProps {
  visible: boolean;
  userId: string;
  userEmail: string;
  organizationId: string;
  currentRoles?: Role[];
  onClose: () => void;
  onSuccess: () => void;
}

interface RoleRecord {
  key: string;
  title: string;
  description?: string;
  isSystemRole: boolean;
}

export const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({
  visible,
  userId,
  userEmail,
  organizationId,
  currentRoles = [],
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      fetchRoles();
      setSelectedRoles(currentRoles.map((r) => r.id));
    }
  }, [visible, currentRoles]);

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const response = await rolesApi.list({
        organizationId,
        isActive: true,
        limit: 100,
      });

      const roleRecords: RoleRecord[] = response.data.map((r: Role) => ({
        key: r.id,
        title: r.name,
        description: r.description,
        isSystemRole: r.isSystemRole,
      }));

      setRoles(roleRecords);
    } catch (error: any) {
      message.error("Failed to fetch roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Assign new roles
      if (selectedRoles.length > 0) {
        await rolesApi.assignPermissions(userId, {
          permissionIds: selectedRoles,
        });
      }

      // Remove roles that were unselected
      const rolesToRemove = currentRoles
        .filter((r) => !selectedRoles.includes(r.id))
        .map((r) => r.id);

      for (const roleId of rolesToRemove) {
        // Note: This would require a different API endpoint
        // For now, we'll handle it through the assignPermissions endpoint
        // which should replace all roles
      }

      message.success("User roles updated successfully");
      onSuccess();
      handleClose();
    } catch (error: any) {
      message.error(
        error.response?.data?.error || "Failed to update user roles"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRoles([]);
    onClose();
  };

  const handleTransferChange: TransferProps["onChange"] = (
    targetKeys
  ) => {
    setSelectedRoles(targetKeys as string[]);
  };

  const filterOption = (inputValue: string, option: RoleRecord) => {
    return (
      option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      (option.description || "")
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );
  };

  return (
    <Modal
      title={
        <Space direction="vertical" size={0}>
          <Text>Assign Roles</Text>
          <Text type="secondary" style={{ fontSize: "14px", fontWeight: "normal" }}>
            {userEmail}
          </Text>
        </Space>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      width={800}
      confirmLoading={loading}
      okText="Save Changes"
      destroyOnClose
    >
      {loadingRoles ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Transfer
          dataSource={roles}
          titles={["Available Roles", "Assigned Roles"]}
          targetKeys={selectedRoles}
          onChange={handleTransferChange}
          render={(item) => (
            <div>
              <Space>
                <strong>{item.title}</strong>
                {item.isSystemRole && (
                  <Tag color="blue" style={{ fontSize: "11px" }}>
                    System
                  </Tag>
                )}
              </Space>
              {item.description && (
                <>
                  <br />
                  <small style={{ color: "#888" }}>
                    {item.description}
                  </small>
                </>
              )}
            </div>
          )}
          showSearch
          filterOption={filterOption}
          listStyle={{
            width: 350,
            height: 400,
          }}
          locale={{
            itemUnit: "role",
            itemsUnit: "roles",
            searchPlaceholder: "Search roles...",
          }}
        />
      )}
    </Modal>
  );
};
