"use client";
import React from "react";
import { Typography, Form, Input, Button, Space } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

export default function LoginPage() {
  const onFinish = (values: any) => {
    // Placeholder login handler
    console.log("login submit", values);
  };
  return (
    <>
      <Title level={3} style={{ marginBottom: 8 }}>
        Welcome back
      </Title>
      <Text
        type="secondary"
        className="muted-text"
        style={{ display: "block", marginBottom: 24 }}
      >
        Sign in to access your dashboard.
      </Text>
      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
      <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
        <Text className="muted-text">
          No account? <Link href="/auth/register">Create one</Link>
        </Text>
        <Text className="muted-text">Forgot password? (todo)</Text>
      </Space>
    </>
  );
}
