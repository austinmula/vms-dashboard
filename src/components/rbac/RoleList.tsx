"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TeamOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { rolesApi, Role } from "@/lib/api/roles";
import { PermissionGate } from "@/components/wrappers/PermissionGate";

interface RoleListProps {
  organizationId?: string;
  onEdit?: (role: Role) => void;
  onCreate?: () => void;
  onViewUsers?: (role: Role) => void;
  onManagePermissions?: (role: Role) => void;
}

const { Search } = Input;
const { Option } = Select;

export const RoleList: React.FC<RoleListProps> = ({
  organizationId,
  onEdit,
  onCreate,
  onViewUsers,
  onManagePermissions,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | undefined>(
    undefined
  );
  const [filterSystemRole, setFilterSystemRole] = useState<
    boolean | undefined
  >(undefined);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await rolesApi.list({
        search: searchText || undefined,
        isActive: filterActive,
        isSystemRole: filterSystemRole,
        organizationId,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
      });

      setRoles(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error: any) {
      message.error(error.response?.data?.error || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [
    searchText,
    filterActive,
    filterSystemRole,
    pagination.current,
    pagination.pageSize,
    organizationId,
  ]);

  const handleDelete = async (id: string) => {
    try {
      await rolesApi.delete(id);
      message.success("Role deleted successfully");
      fetchRoles();
    } catch (error: any) {
      message.error(
        error.response?.data?.error || "Failed to delete role"
      );
    }
  };

  const columns: ColumnsType<Role> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <strong>{text}</strong>
          {record.isSystemRole && (
            <Tooltip title="System Role">
              <Tag color="blue" icon={<SafetyOutlined />}>
                System
              </Tag>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text) => <code>{text}</code>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Permissions",
      dataIndex: "permissionCount",
      key: "permissionCount",
      align: "center",
      render: (count, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => onManagePermissions?.(record)}
        >
          {count || 0} permissions
        </Button>
      ),
    },
    {
      title: "Users",
      dataIndex: "userCount",
      key: "userCount",
      align: "center",
      render: (count, record) => (
        <Button
          type="link"
          size="small"
          icon={<TeamOutlined />}
          onClick={() => onViewUsers?.(record)}
        >
          {count || 0}
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <PermissionGate permission="roles:update">
            <Tooltip title="Edit Role">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit?.(record)}
                disabled={record.isSystemRole}
              />
            </Tooltip>
          </PermissionGate>

          <PermissionGate permission="roles:delete">
            <Popconfirm
              title="Delete Role"
              description="Are you sure you want to delete this role?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              disabled={record.isSystemRole}
            >
              <Tooltip
                title={
                  record.isSystemRole
                    ? "System roles cannot be deleted"
                    : "Delete Role"
                }
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={record.isSystemRole}
                />
              </Tooltip>
            </Popconfirm>
          </PermissionGate>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Roles Management"
      extra={
        <PermissionGate permission="roles:create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreate}
          >
            Create Role
          </Button>
        </PermissionGate>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space wrap>
          <Search
            placeholder="Search roles..."
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchText}
            onChange={(e) => !e.target.value && setSearchText("")}
            prefix={<SearchOutlined />}
          />

          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 150 }}
            onChange={setFilterActive}
            value={filterActive}
          >
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>

          <Select
            placeholder="Filter by type"
            allowClear
            style={{ width: 150 }}
            onChange={setFilterSystemRole}
            value={filterSystemRole}
          >
            <Option value={true}>System Roles</Option>
            <Option value={false}>Custom Roles</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} roles`,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize,
              }));
            },
          }}
        />
      </Space>
    </Card>
  );
};
