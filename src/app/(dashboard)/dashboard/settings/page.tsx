import React from "react";
import { Typography, Form, Input, Button, Card } from "antd";

const { Title, Text } = Typography;

export default function DashboardSettingsPage() {
  return (
    <Card
      style={{ maxWidth: 640 }}
      title={
        <Title level={4} style={{ margin: 0 }}>
          Settings
        </Title>
      }
    >
      <Text
        className="muted-text"
        style={{ display: "block", marginBottom: 24 }}
      >
        Configure organization & environment preferences here later.
      </Text>
      <Form
        layout="vertical"
        onFinish={(v) => console.log("settings submit", v)}
        requiredMark={false}
      >
        <Form.Item label="Organization Name" name="orgName">
          <Input placeholder="Acme Corp" />
        </Form.Item>
        <Form.Item label="Support Email" name="supportEmail">
          <Input type="email" placeholder="support@example.com" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
