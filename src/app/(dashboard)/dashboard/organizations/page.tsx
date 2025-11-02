"use client";

import React, { useState } from "react";
import { Card, Typography, Space } from "antd";
import { BankOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../../../hooks/redux";
import { selectPermissions } from "../../../../store/slices/authSlice";
import OrganizationList from "../../../../components/organizations/OrganizationList";
import OrganizationForm from "../../../../components/organizations/OrganizationForm";
import OrganizationDetail from "../../../../components/organizations/OrganizationDetail";
import { Organization, OrganizationWithStats } from "../../../../types/organization";

const { Title } = Typography;

const OrganizationsPage: React.FC = () => {
  const router = useRouter();
  const permissions = useAppSelector(selectPermissions);

  console.log("User permissions:", permissions);

  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  // Check permissions
  const canRead = permissions.includes("organizations_read");
  const canCreate = permissions.includes("organizations_create");
  const canUpdate = permissions.includes("organizations_update");
  const canDelete = permissions.includes("organizations_delete");

  // If user doesn't have read permission, show message or redirect
  if (!canRead) {
    return (
      <Card>
        <Typography.Text type="danger">
          You don't have permission to view organizations.
        </Typography.Text>
      </Card>
    );
  }

  const handleView = (organization: Organization) => {
    setSelectedOrganization(organization as OrganizationWithStats);
    setDetailVisible(true);
  };

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setEditMode(true);
    setFormVisible(true);
  };

  const handleCreate = () => {
    setSelectedOrganization(null);
    setEditMode(false);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedOrganization(null);
    setEditMode(false);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
    setSelectedOrganization(null);
  };

  const handleFormSuccess = () => {
    // List will automatically refresh via Redux
  };

  const handleDetailEdit = () => {
    setDetailVisible(false);
    setEditMode(true);
    setFormVisible(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", marginBottom: 24 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BankOutlined style={{ fontSize: 32, color: "#1890ff" }} />
          <div>
            <Title level={2} style={{ margin: 0 }}>
              Organizations
            </Title>
            <Typography.Text type="secondary">
              Manage organizations and their settings
            </Typography.Text>
          </div>
        </div>
      </Space>

      <Card>
        <OrganizationList
          onView={handleView}
          onEdit={canUpdate ? handleEdit : undefined}
          onCreate={canCreate ? handleCreate : undefined}
          canCreate={canCreate}
          canEdit={canUpdate}
          canDelete={canDelete}
        />
      </Card>

      {/* Create/Edit Form Modal */}
      <OrganizationForm
        visible={formVisible}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        organization={editMode ? selectedOrganization : null}
        mode={editMode ? "edit" : "create"}
      />

      {/* Detail Drawer */}
      <OrganizationDetail
        visible={detailVisible}
        onClose={handleDetailClose}
        organization={selectedOrganization as OrganizationWithStats}
        onEdit={canUpdate ? handleDetailEdit : undefined}
        canEdit={canUpdate}
      />
    </div>
  );
};

export default OrganizationsPage;
