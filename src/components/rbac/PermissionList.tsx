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
  SafetyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { permissionsApi, Permission } from "@/lib/api/permissions";
import { PermissionGate } from "@/components/wrappers/PermissionGate";

interface PermissionListProps {
  onEdit?: (permission: Permission) => void;
  onCreate?: () => void;
}

const { Search } = Input;
const { Option } = Select;

export const PermissionList: React.FC<PermissionListProps> = ({
  onEdit,
  onCreate,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterResource, setFilterResource] = useState<string | undefined>(
    undefined
  );
  const [filterAction, setFilterAction] = useState<string | undefined>(
    undefined
  );
  const [filterSystemPermission, setFilterSystemPermission] = useState<
    boolean | undefined
  >(undefined);
  const [resources, setResources] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await permissionsApi.list({
        search: searchText || undefined,
        resource: filterResource,
        action: filterAction,
        isSystemPermission: filterSystemPermission,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
      });

      setPermissions(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error: any) {
      message.error(
        error.response?.data?.error || "Failed to fetch permissions"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [resourcesRes, actionsRes] = await Promise.all([
        permissionsApi.getResources(),
        permissionsApi.getActions(),
      ]);
      setResources(resourcesRes.data);
      setActions(actionsRes.data);
    } catch (error) {
      console.error("Failed to fetch filter options", error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [
    searchText,
    filterResource,
    filterAction,
    filterSystemPermission,
    pagination.current,
    pagination.pageSize,
  ]);

  const handleDelete = async (id: string) => {
    try {
      await permissionsApi.delete(id);
      message.success("Permission deleted successfully");
      fetchPermissions();
    } catch (error: any) {
      message.error(
        error.response?.data?.error || "Failed to delete permission"
      );
    }
  };

  const columns: ColumnsType<Permission> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <strong>{text}</strong>
          {record.isSystemPermission && (
            <Tooltip title="System Permission">
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
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => <Tag color="cyan">{text}</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Roles",
      dataIndex: "roleCount",
      key: "roleCount",
      align: "center",
      render: (count) => count || 0,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <PermissionGate permission="permissions:update">
            <Tooltip title="Edit Permission">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit?.(record)}
                disabled={record.isSystemPermission}
              />
            </Tooltip>
          </PermissionGate>

          <PermissionGate permission="permissions:delete">
            <Popconfirm
              title="Delete Permission"
              description="Are you sure you want to delete this permission?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              disabled={record.isSystemPermission}
            >
              <Tooltip
                title={
                  record.isSystemPermission
                    ? "System permissions cannot be deleted"
                    : "Delete Permission"
                }
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={record.isSystemPermission}
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
      title="Permissions Management"
      extra={
        <PermissionGate permission="permissions:create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreate}
          >
            Create Permission
          </Button>
        </PermissionGate>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space wrap>
          <Search
            placeholder="Search permissions..."
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchText}
            onChange={(e) => !e.target.value && setSearchText("")}
            prefix={<SearchOutlined />}
          />

          <Select
            placeholder="Filter by resource"
            allowClear
            style={{ width: 180 }}
            onChange={setFilterResource}
            value={filterResource}
          >
            {resources.map((resource) => (
              <Option key={resource} value={resource}>
                {resource}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Filter by action"
            allowClear
            style={{ width: 150 }}
            onChange={setFilterAction}
            value={filterAction}
          >
            {actions.map((action) => (
              <Option key={action} value={action}>
                {action}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Filter by type"
            allowClear
            style={{ width: 180 }}
            onChange={setFilterSystemPermission}
            value={filterSystemPermission}
          >
            <Option value={true}>System Permissions</Option>
            <Option value={false}>Custom Permissions</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} permissions`,
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
