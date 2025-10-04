"use client";
import React from "react";
import { Typography, Card, Space } from "antd";

const { Title, Text } = Typography;

export default function DashboardHomePage() {
  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Overview
        </Title>
        <Text className="muted-text">
          High-level summary and quick stats (to be implemented).
        </Text>
      </div>
      <Card title="Environment Status" size="small">
        <Text className="muted-text">
          Placeholder for charts / resource usage.
        </Text>
      </Card>
      <Card title="Recent Activity" size="small">
        <Text className="muted-text">Placeholder for activity feed.</Text>
      </Card>
    </Space>
  );
}
