"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  Switch,
  message,
  Tooltip,
  Card,
  Typography,
  Dropdown,
  MenuProps,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SafetyOutlined,
  ReloadOutlined,
  MoreOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { usersApi, User, CreateUserInput, UpdateUserInput } from "@/lib/api/users";
import { rolesApi, Role } from "@/lib/api/roles";

const { Title, Text } = Typography;
const { Search } = Input;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [roleForm] = Form.useForm();

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await usersApi.list({
        search: searchText || undefined,
        isActive: filterActive,
      });
      setUsers(response.data || []);
    } catch (error) {
      message.error("Failed to load users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await rolesApi.list();
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [searchText, filterActive]);

  // Create user
  const handleCreate = async (values: CreateUserInput) => {
    try {
      await usersApi.create(values);
      message.success("User created successfully");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      fetchUsers();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "Failed to create user");
    }
  };

  // Update user
  const handleUpdate = async (values: UpdateUserInput) => {
    if (!selectedUser) return;
    try {
      await usersApi.update(selectedUser.id, values);
      message.success("User updated successfully");
      setIsEditModalOpen(false);
      editForm.resetFields();
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "Failed to update user");
    }
  };

  // Deactivate user
  const handleDeactivate = (user: User) => {
    Modal.confirm({
      title: "Deactivate User",
      content: `Are you sure you want to deactivate ${user.email}?`,
      okText: "Deactivate",
      okType: "danger",
      onOk: async () => {
        try {
          await usersApi.deactivate(user.id);
          message.success("User deactivated successfully");
          fetchUsers();
        } catch (error: any) {
          message.error(error?.response?.data?.error || "Failed to deactivate user");
        }
      },
    });
  };

  // Assign roles
  const handleAssignRoles = async (values: { roleIds: string[] }) => {
    if (!selectedUser) return;
    try {
      await usersApi.assignRoles(selectedUser.id, values);
      message.success("Roles assigned successfully");
      setIsRoleModalOpen(false);
      roleForm.resetFields();
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      message.error(error?.response?.data?.error || "Failed to assign roles");
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      email: user.email,
      mfaEnabled: user.mfaEnabled,
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  // Open role assignment modal
  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    roleForm.setFieldsValue({
      roleIds: user.roles?.map(r => r.id) || [],
    });
    setIsRoleModalOpen(true);
  };

  // Table columns
  const columns: ColumnsType<User> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email: string, record: User) => (
        <Space direction="vertical" size={0}>
          <Text strong>{email}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Employee ID: {record.employeeId}
          </Text>
        </Space>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: User["roles"]) => (
        <Space wrap>
          {roles && roles.length > 0 ? (
            roles.map((role) => (
              <Tag key={role.id} color="blue">
                {role.name}
              </Tag>
            ))
          ) : (
            <Tag color="default">No roles</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "MFA",
      dataIndex: "mfaEnabled",
      key: "mfaEnabled",
      render: (mfaEnabled: boolean) => (
        <Tag icon={mfaEnabled ? <LockOutlined /> : <UnlockOutlined />} color={mfaEnabled ? "green" : "default"}>
          {mfaEnabled ? "Enabled" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      render: (lastLoginAt?: string) =>
        lastLoginAt ? new Date(lastLoginAt).toLocaleString() : "Never",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: User) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit User',
            onClick: () => openEditModal(record),
          },
          {
            key: 'roles',
            icon: <SafetyOutlined />,
            label: 'Assign Roles',
            onClick: () => openRoleModal(record),
          },
          {
            type: 'divider',
          },
          {
            key: 'deactivate',
            icon: <DeleteOutlined />,
            label: 'Deactivate',
            danger: true,
            onClick: () => handleDeactivate(record),
            disabled: !record.isActive,
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Title level={3} style={{ margin: 0 }}>
              User Management
            </Title>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create User
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
                Refresh
              </Button>
            </Space>
          </div>

          <Space style={{ marginBottom: 16 }}>
            <Search
              placeholder="Search by email or employee ID"
              allowClear
              onSearch={setSearchText}
              onChange={(e) => !e.target.value && setSearchText("")}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 150 }}
              onChange={setFilterActive}
              options={[
                { label: "All", value: undefined },
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        title={
          <Space>
            <UserAddOutlined />
            Create New User
          </Space>
        }
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
        }}
        onOk={() => createForm.submit()}
        width={600}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Employee ID"
            name="employeeId"
            rules={[{ required: true, message: "Please enter employee ID" }]}
          >
            <Input placeholder="Enter employee ID" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 10, message: "Password must be at least 10 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password (min 10 chars)" />
          </Form.Item>

          <Form.Item label="Roles" name="roleIds">
            <Select
              mode="multiple"
              placeholder="Select roles"
              options={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Enable MFA" name="mfaEnabled" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            Edit User
          </Space>
        }
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
          setSelectedUser(null);
        }}
        onOk={() => editForm.submit()}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Please enter valid email" }]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item label="Password (leave blank to keep current)" name="password">
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item label="Enable MFA" name="mfaEnabled" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Roles Modal */}
      <Modal
        title={
          <Space>
            <SafetyOutlined />
            Assign Roles
          </Space>
        }
        open={isRoleModalOpen}
        onCancel={() => {
          setIsRoleModalOpen(false);
          roleForm.resetFields();
          setSelectedUser(null);
        }}
        onOk={() => roleForm.submit()}
        width={600}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleAssignRoles}>
          <Form.Item
            label="Roles"
            name="roleIds"
            rules={[{ required: true, message: "Please select at least one role" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select roles"
              options={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
