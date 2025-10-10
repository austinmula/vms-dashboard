"use client";
import React from "react";
import { Typography, Form, Input, Button, Space, message, Spin } from "antd";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    // Placeholder login handler
    console.log("login submit", values);
    try {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        message.error("Invalid email or password");
        return;
      }

      if (result?.ok) {
        message.success("Login successful! Redirecting...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      message.error("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      <Form
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        disabled={loading}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
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
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={loading ? <LoadingOutlined /> : null}
            block
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      {loading && (
        <div className="text-center mt-4">
          <Spin indicator={<LoadingOutlined spin />} />
        </div>
      )}

      <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
        <Text className="muted-text">
          No account? <Link href="/auth/register">Create one</Link>
        </Text>
        <Text className="muted-text">Forgot password?</Text>
      </Space>
    </>
  );
}
