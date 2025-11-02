"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  message,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchOrganizations,
  deleteOrganization,
  selectOrganizations,
  selectOrganizationsLoading,
  selectOrganizationsError,
  selectOrganizationsPagination,
} from "../../store/slices/organizationsSlice";
import { Organization } from "../../types/organization";

const { Search } = Input;
const { confirm } = Modal;

interface OrganizationListProps {
  onView?: (organization: Organization) => void;
  onEdit?: (organization: Organization) => void;
  onCreate?: () => void;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

const OrganizationList: React.FC<OrganizationListProps> = ({
  onView,
  onEdit,
  onCreate,
  canCreate = false,
  canEdit = false,
  canDelete = false,
}) => {
  const dispatch = useAppDispatch();
  const organizations = useAppSelector(selectOrganizations);
  console.log("Organizations:", organizations);
  const loading = useAppSelector(selectOrganizationsLoading);
  const error = useAppSelector(selectOrganizationsError);
  const pagination = useAppSelector(selectOrganizationsPagination);

  const [searchText, setSearchText] = useState("");
  const [tierFilter, setTierFilter] = useState<string | undefined>();
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>();

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const loadOrganizations = (page = 1, limit = 10) => {
    dispatch(
      fetchOrganizations({
        page,
        limit,
        search: searchText || undefined,
        subscriptionTier: tierFilter as any,
        isActive: activeFilter,
      })
    );
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setTimeout(() => loadOrganizations(1, pagination.limit), 300);
  };

  const handleTierFilterChange = (value: string | undefined) => {
    setTierFilter(value);
    setTimeout(() => loadOrganizations(1, pagination.limit), 300);
  };

  const handleActiveFilterChange = (value: string | undefined) => {
    setActiveFilter(
      value === "true" ? true : value === "false" ? false : undefined
    );
    setTimeout(() => loadOrganizations(1, pagination.limit), 300);
  };

  const handleDelete = (organization: Organization) => {
    confirm({
      title: "Delete Organization",
      icon: <ExclamationCircleFilled />,
      content: `Are you sure you want to delete "${organization.name}"? This action will deactivate the organization and cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteOrganization(organization.id)).unwrap();
          message.success("Organization deleted successfully");
          loadOrganizations(pagination.page, pagination.limit);
        } catch (error: any) {
          message.error(error || "Failed to delete organization");
        }
      },
    });
  };

  const handleTableChange = (newPagination: any) => {
    loadOrganizations(newPagination.current, newPagination.pageSize);
  };

  const columns: ColumnsType<Organization> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 150,
    },
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
      width: 180,
      render: (domain) => domain || "-",
    },
    {
      title: "Subscription Tier",
      dataIndex: "subscriptionTier",
      key: "subscriptionTier",
      width: 150,
      render: (tier: string) => {
        const colors = {
          free: "default",
          basic: "blue",
          premium: "purple",
          enterprise: "gold",
        };
        return (
          <Tag color={colors[tier as keyof typeof colors] || "default"}>
            {tier.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {onView && (
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            >
              View
            </Button>
          )}
          {canEdit && onEdit && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (loading && !organizations.length) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <div>
      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Space wrap>
          <Search
            placeholder="Search by name, slug, or domain"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Filter by tier"
            allowClear
            style={{ width: 150 }}
            onChange={handleTierFilterChange}
            options={[
              { label: "All Tiers", value: undefined },
              { label: "Free", value: "free" },
              { label: "Basic", value: "basic" },
              { label: "Premium", value: "premium" },
              { label: "Enterprise", value: "enterprise" },
            ]}
          />

          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 150 }}
            onChange={handleActiveFilterChange}
            options={[
              { label: "All Status", value: undefined },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />

          {canCreate && onCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreate}
              style={{ marginLeft: "auto" }}
            >
              Create Organization
            </Button>
          )}
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={organizations}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} organizations`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default OrganizationList;
