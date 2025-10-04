"use client";
import React from "react";
import { Typography, Form, Input, Button, Space } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const onFinish = (values: any) => {
    console.log("register submit", values);
  };
  return (
    <>
      <Title level={3} style={{ marginBottom: 8 }}>
        Create your account
      </Title>
      <Text
        type="secondary"
        className="muted-text"
        style={{ display: "block", marginBottom: 24 }}
      >
        Start managing infrastructure with the dashboard.
      </Text>
      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input autoComplete="name" placeholder="Jane Doe" />
        </Form.Item>
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
            autoComplete="new-password"
            placeholder="Create a password"
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block>
            Create Account
          </Button>
        </Form.Item>
      </Form>
      <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
        <Text className="muted-text">
          Already have an account? <Link href="/auth/login">Sign in</Link>
        </Text>
      </Space>
    </>
  );
}
