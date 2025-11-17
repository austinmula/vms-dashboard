"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  message,
  Transfer,
  Spin,
  Typography,
  Divider,
  Card,
  Space,
  Tag,
  Tooltip,
  Button,
  Drawer,
  theme,
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

  const { token } = theme.useToken();

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
    <Drawer
      title={
        <Space direction="vertical" size={2} style={{ width: "100%" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {isEditMode ? "Edit Role" : "Create New Role"}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Define role details and assign granular permissions to control access.
          </Typography.Text>
        </Space>
      }
      open={visible}
      onClose={handleClose}
      width={880}
      placement="right"
      maskClosable={false}
      destroyOnClose
      styles={{ body: { background: token.colorBgLayout, padding: 16 } }}
      footer={
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Review details before clicking {isEditMode ? "Update" : "Create"}.
          </Typography.Text>
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              {isEditMode ? "Update" : "Create"}
            </Button>
          </Space>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Card size="small" title="Role Details" bordered>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              isActive: true,
            }}
          >
            <Form.Item
              name="name"
              label={<Space><span>Role Name</span><Typography.Text type="secondary" style={{ fontSize: 11 }}>(human readable)</Typography.Text></Space>}
              rules={[
                { required: true, message: "Please enter a role name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                placeholder="e.g., Security Manager"
                onChange={(e) => !isEditMode && handleSlugGeneration(e.target.value)}
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label={<Space><span>Slug</span><Typography.Text type="secondary" style={{ fontSize: 11 }}>(system identifier)</Typography.Text></Space>}
              rules={[
                { required: true, message: "Please enter a slug" },
                {
                  pattern: /^[a-z0-9-_]+$/,
                  message: "Slug must be lowercase letters, numbers, hyphens, and underscores only",
                },
              ]}
              extra={<Typography.Text type="secondary">Auto-generated from name. Used internally.</Typography.Text>}
            >
              <Input
                placeholder="e.g., security-manager"
                disabled={isEditMode}
                suffix={!isEditMode ? (
                  <Tooltip title="Regenerate from name">
                    <Button
                      size="small"
                      type="text"
                      onClick={() => {
                        const name = form.getFieldValue("name") || "";
                        handleSlugGeneration(name);
                      }}
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                ) : null}
              />
            </Form.Item>

            <Form.Item name="description" label="Description" extra={<Typography.Text type="secondary">Short summary of the role purpose.</Typography.Text>}>
              <TextArea rows={3} placeholder="Describe the purpose of this role..." showCount maxLength={300} />
            </Form.Item>

            {isEditMode && (
              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            )}
          </Form>
        </Card>

        <Card size="small" title={
          <Space direction="vertical" size={0}>
            <span>Permissions</span>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              Move permissions from Available to Assigned to grant access.
            </Typography.Text>
          </Space>
        } bordered>
          <Form.Item>
            {loadingPermissions ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <Space direction="vertical">
                  <Spin />
                  <Typography.Text type="secondary">Loading permissions...</Typography.Text>
                </Space>
              </div>
            ) : (
              <Transfer
                dataSource={permissions}
                titles={["Available", "Assigned"]}
                targetKeys={selectedPermissions}
                onChange={handleTransferChange}
                render={(item) => (
                  <Space direction="vertical" size={0} style={{ width: "100%" }}>
                    <Typography.Text strong style={{ fontSize: 12 }}>
                      {item.title}
                    </Typography.Text>
                    <Space size={4} wrap>
                      <Tag color="blue" style={{ margin: 0 }}>{item.resource}</Tag>
                      <Tag color="green" style={{ margin: 0 }}>{item.action}</Tag>
                    </Space>
                    {item.description && (
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                        {item.description}
                      </Typography.Text>
                    )}
                  </Space>
                )}
                showSearch
                filterOption={filterOption}
                listStyle={{
                  width: 370,
                  height: 430,
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorder}`,
                }}
              />
            )}
          </Form.Item>
        </Card>
      </Space>
      <Divider style={{ margin: "16px 0 8px" }} />
    </Drawer>
  );
};
