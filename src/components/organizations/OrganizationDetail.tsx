"use client";

import React from "react";
import { Drawer, Descriptions, Tag, Button, Space, Divider } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { OrganizationWithStats } from "../../types/organization";
import OrganizationStats from "./OrganizationStats";

interface OrganizationDetailProps {
  visible: boolean;
  onClose: () => void;
  organization: OrganizationWithStats | null;
  onEdit?: () => void;
  canEdit?: boolean;
}

const OrganizationDetail: React.FC<OrganizationDetailProps> = ({
  visible,
  onClose,
  organization,
  onEdit,
  canEdit = false,
}) => {
  if (!organization) return null;

  const subscriptionTierColors = {
    free: "default",
    basic: "blue",
    premium: "purple",
    enterprise: "gold",
  };

  return (
    <Drawer
      title={organization.name}
      placement="right"
      onClose={onClose}
      open={visible}
      width={600}
      extra={
        canEdit && onEdit && (
          <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
            Edit
          </Button>
        )
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Basic Information */}
        <div>
          <h3>Basic Information</h3>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">{organization.name}</Descriptions.Item>
            <Descriptions.Item label="Slug">{organization.slug}</Descriptions.Item>
            <Descriptions.Item label="Domain">
              {organization.domain || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {organization.phone || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Website">
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
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Address */}
        {organization.address && (
          <div>
            <h3>Address</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Address">
                {organization.address}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {/* Subscription & Status */}
        <div>
          <h3>Subscription & Status</h3>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Subscription Tier">
              <Tag
                color={
                  subscriptionTierColors[
                    organization.subscriptionTier as keyof typeof subscriptionTierColors
                  ] || "default"
                }
              >
                {organization.subscriptionTier.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={organization.isActive ? "green" : "red"}>
                {organization.isActive ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Verified">
              <Tag color={organization.isVerified ? "green" : "orange"}>
                {organization.isVerified ? "Verified" : "Not Verified"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Timezone">
              {organization.timezone}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Statistics */}
        {organization.stats && (
          <div>
            <h3>Statistics</h3>
            <OrganizationStats stats={organization.stats} />
          </div>
        )}

        {/* Metadata */}
        <div>
          <h3>Metadata</h3>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Created At">
              {new Date(organization.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {new Date(organization.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Space>
    </Drawer>
  );
};

export default OrganizationDetail;
