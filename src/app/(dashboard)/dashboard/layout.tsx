import React from "react";
import Link from "next/link";
import { Layout, Menu } from "antd";

export const metadata = {
  title: "Dashboard | VMS",
};

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={64}
        width={220}
        style={{
          background: "var(--page-bg-accent)",
          borderRight: "1px solid var(--page-border)",
        }}
      >
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            fontWeight: 600,
          }}
        >
          VMS
        </div>
        <Menu
          mode="inline"
          style={{ borderInline: "none", background: "transparent" }}
          items={[
            { key: "overview", label: <Link href="/dashboard">Overview</Link> },
            {
              key: "settings",
              label: <Link href="/dashboard/settings">Settings</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "var(--page-bg-accent)",
            borderBottom: "1px solid var(--page-border)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <nav style={{ display: "flex", gap: 16 }}>
            <Link href="/">Home</Link>
            <Link href="/auth/login">Login</Link>
          </nav>
        </Header>
        <Content
          style={{ padding: 24, background: "var(--page-bg)", minHeight: 0 }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
