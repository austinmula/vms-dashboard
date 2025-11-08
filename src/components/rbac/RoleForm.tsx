"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Transfer,
  Spin,
} from "antd";
import type { TransferProps } from "antd";
import {
  rolesApi,
  Role,
  CreateRoleInput,
  UpdateRoleInput,
} from "@/lib/api/roles";
import { permissionsApi, Permission } from "@/lib/api/permissions";

const { TextArea } = Input;

interface RoleFormProps {
  visible: boolean;
  role?: Role | null;
  organizationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface PermissionRecord {
  key: string;
  title: string;
  description?: string;
  resource: string;
  action: string;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  visible,
  role,
  organizationId,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const isEditMode = !!role;

  useEffect(() => {
    if (visible) {
      fetchPermissions();
      if (role) {
        form.setFieldsValue({
          name: role.name,
          slug: role.slug,
          description: role.description,
          isActive: role.isActive,
        });
        // Set selected permissions
        if (role.permissions) {
          setSelectedPermissions(role.permissions.map((p) => p.id));
        }
      } else {
        form.resetFields();
        setSelectedPermissions([]);
      }
    }
  }, [visible, role, form]);

  const fetchPermissions = async () => {
    setLoadingPermissions(true);
    try {
      const response = await permissionsApi.list({ limit: 200 });
      const permissionRecords: PermissionRecord[] = response.data.map(
        (p: Permission) => ({
          key: p.id,
          title: p.name,
          description: p.description,
          resource: p.resource,
          action: p.action,
        })
      );
      setPermissions(permissionRecords);
    } catch (error: any) {
      message.error("Failed to fetch permissions");
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode && role) {
        // Update role
        const updateData: UpdateRoleInput = {
          name: values.name,
          description: values.description,
          isActive: values.isActive,
        };
        await rolesApi.update(role.id, updateData);

        // Update permissions separately
        await rolesApi.assignPermissions(role.id, {
          permissionIds: selectedPermissions,
        });

        message.success("Role updated successfully");
      } else {
        // Create role
        const createData: CreateRoleInput = {
          name: values.name,
          slug: values.slug,
          description: values.description,
          organizationId,
          isSystemRole: false,
          permissionIds: selectedPermissions,
        };
        await rolesApi.create(createData);
        message.success("Role created successfully");
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      if (error.errorFields) {
        message.error("Please fill in all required fields");
      } else {
        message.error(
          error.response?.data?.error || "Failed to save role"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedPermissions([]);
    onClose();
  };

  const handleSlugGeneration = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    form.setFieldValue("slug", slug);
  };

  const handleTransferChange: TransferProps["onChange"] = (
    targetKeys
  ) => {
    setSelectedPermissions(targetKeys as string[]);
  };

  const filterOption = (inputValue: string, option: PermissionRecord) => {
    return (
      option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.resource.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.action.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  return (
    <Modal
      title={isEditMode ? "Edit Role" : "Create New Role"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      width={800}
      confirmLoading={loading}
      okText={isEditMode ? "Update" : "Create"}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isActive: true,
        }}
      >
        <Form.Item
          name="name"
          label="Role Name"
          rules={[
            { required: true, message: "Please enter a role name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input
            placeholder="e.g., Security Manager"
            onChange={(e) => !isEditMode && handleSlugGeneration(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, message: "Please enter a slug" },
            {
              pattern: /^[a-z0-9-_]+$/,
              message: "Slug must be lowercase letters, numbers, hyphens, and underscores only",
            },
          ]}
        >
          <Input
            placeholder="e.g., security-manager"
            disabled={isEditMode}
          />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea
            rows={3}
            placeholder="Describe the purpose of this role..."
          />
        </Form.Item>

        {isEditMode && (
          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        )}

        <Form.Item label="Permissions">
          {loadingPermissions ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin />
            </div>
          ) : (
            <Transfer
              dataSource={permissions}
              titles={["Available", "Assigned"]}
              targetKeys={selectedPermissions}
              onChange={handleTransferChange}
              render={(item) => (
                <div>
                  <strong>{item.title}</strong>
                  <br />
                  <small style={{ color: "#888" }}>
                    {item.resource}:{item.action}
                  </small>
                </div>
              )}
              showSearch
              filterOption={filterOption}
              listStyle={{
                width: 350,
                height: 400,
              }}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
