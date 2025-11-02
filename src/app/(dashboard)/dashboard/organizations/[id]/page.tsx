"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Space,
  Breadcrumb,
  Button,
  Skeleton,
  Tabs,
  Alert,
} from "antd";
import {
  BankOutlined,
  HomeOutlined,
  EditOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import {
  fetchOrganizationById,
  fetchOrganizationStats,
  selectCurrentOrganization,
  selectOrganizationStats,
  selectOrganizationsLoading,
  selectOrganizationsError,
  clearCurrentOrganization,
} from "../../../../../store/slices/organizationsSlice";
import { selectPermissions } from "../../../../../store/slices/authSlice";
import OrganizationForm from "../../../../../components/organizations/OrganizationForm";
import OrganizationStats from "../../../../../components/organizations/OrganizationStats";

const { Title, Text } = Typography;

const OrganizationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectPermissions);

  const organization = useAppSelector(selectCurrentOrganization);
  const stats = useAppSelector(selectOrganizationStats);
  const loading = useAppSelector(selectOrganizationsLoading);
  const error = useAppSelector(selectOrganizationsError);

  const [formVisible, setFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const canUpdate = permissions.includes("organizations:update");

  const organizationId = params.id as string;

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchOrganizationById(organizationId));
      dispatch(fetchOrganizationStats(organizationId));
    }

    return () => {
      dispatch(clearCurrentOrganization());
    };
  }, [organizationId, dispatch]);

  const handleEdit = () => {
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
  };

  const handleFormSuccess = () => {
    // Refresh organization data
    if (organizationId) {
      dispatch(fetchOrganizationById(organizationId));
      dispatch(fetchOrganizationStats(organizationId));
    }
  };

  if (loading && !organization) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Error"
          description={error || "Organization not found"}
          type="error"
          showIcon
          action={
            <Button onClick={() => router.push("/dashboard/organizations")}>
              Back to Organizations
            </Button>
          }
        />
      </div>
    );
  }

  const tabItems = [
    {
      key: "overview",
      label: (
        <span>
          <InfoCircleOutlined /> Overview
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Basic Information Card */}
          <Card title="Basic Information" bordered={false}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <Text type="secondary">Name</Text>
                <div style={{ marginTop: 4 }}>
                  <Text strong>{organization.name}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Slug</Text>
                <div style={{ marginTop: 4 }}>
                  <Text code>{organization.slug}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Domain</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>{organization.domain || "-"}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Phone</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>{organization.phone || "-"}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Website</Text>
                <div style={{ marginTop: 4 }}>
                  {organization.website ? (
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {organization.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
              <div>
                <Text type="secondary">Timezone</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>{organization.timezone}</Text>
                </div>
              </div>
            </div>

            {organization.address && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">Address</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>{organization.address}</Text>
                </div>
              </div>
            )}
          </Card>

          {/* Statistics Card */}
          {(stats || organization.stats) && (
            <Card title="Statistics" bordered={false}>
              <OrganizationStats
                stats={stats || organization.stats!}
              />
            </Card>
          )}
        </Space>
      ),
    },
    {
      key: "stats",
      label: (
        <span>
          <BarChartOutlined /> Statistics
        </span>
      ),
      children: (
        <Card bordered={false}>
          {(stats || organization.stats) ? (
            <OrganizationStats
              stats={stats || organization.stats!}
            />
          ) : (
            <Alert
              message="No statistics available"
              type="info"
              showIcon
            />
          )}
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/organizations">Organizations</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{organization.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BankOutlined style={{ fontSize: 32, color: "#1890ff" }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {organization.name}
              </Title>
              <Text type="secondary">{organization.slug}</Text>
            </div>
          </div>

          {canUpdate && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Edit Organization
            </Button>
          )}
        </div>
      </Space>

      {/* Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>

      {/* Edit Form Modal */}
      {canUpdate && (
        <OrganizationForm
          visible={formVisible}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          organization={organization}
          mode="edit"
        />
      )}
    </div>
  );
};

export default OrganizationDetailPage;
