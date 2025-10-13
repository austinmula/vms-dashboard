"use client";
import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Layout, Menu, Avatar, Badge, Dropdown, theme, Button } from "antd";
import {
  DashboardOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  FileTextOutlined,
  BellOutlined,
  LogoutOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { ProtectedRoute } from "@/components/wrappers/ProtectedRoute";

// export const metadata = {
//   title: "Dashboard | VMS",
// };

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { roles } = usePermissions();
  const pathname = usePathname();

  // Selected key from pathname (including nested routes)
  const selectedKeys = useMemo(() => {
    if (!pathname) return [];
    // Match deepest segment to a menu item key
    const segment = pathname.replace(/\/$/, "").split("/").pop() || "overview";
    // Map known segments to keys
    const map: Record<string, string> = {
      settings: "settings-root",
      profile: "settings-profile",
      security: "settings-security",
      preferences: "settings-preferences",
      users: "users",
      teams: "teams",
      resources: "resources-root",
      clusters: "resources-clusters",
      services: "resources-services",
      storage: "resources-storage",
      logs: "logs-root",
      audit: "logs-audit",
      system: "logs-system",
      reports: "reports-root",
      sales: "reports-sales",
      operations: "reports-operations",
      analytics: "analytics-root",
      dashboards: "analytics-dashboards",
      labs: "labs",
      experiments: "labs-experiments",
    };
    return [map[segment] || "overview"];
  }, [pathname]);

  // Track open submenus
  const [openKeys, setOpenKeys] = useState<string[]>([
    // Optionally auto-open based on selected key
  ]);
  const onOpenChange = useCallback((keys: string[]) => {
    setOpenKeys(keys);
  }, []);

  const menuItems = [
    {
      key: "overview",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Overview</Link>,
    },
    {
      key: "settings-root",
      icon: <SettingOutlined />,
      label: <span>Settings</span>,
      children: [
        {
          key: "settings-profile",
          label: <Link href="/dashboard/settings/profile">Profile</Link>,
        },
        {
          key: "settings-security",
          label: <Link href="/dashboard/settings/security">Security</Link>,
        },
        {
          key: "settings-preferences",
          label: (
            <Link href="/dashboard/settings/preferences">Preferences</Link>
          ),
        },
      ],
    },
    {
      key: "users",
      icon: <UsergroupAddOutlined />,
      label: <Link href="/dashboard/users">Users</Link>,
    },
    {
      key: "teams",
      icon: <TeamOutlined />,
      label: <Link href="/dashboard/teams">Teams</Link>,
    },
    {
      key: "resources-root",
      icon: <ClusterOutlined />,
      label: <span>Resources</span>,
      children: [
        {
          key: "resources-clusters",
          label: <Link href="/dashboard/resources/clusters">Clusters</Link>,
        },
        {
          key: "resources-services",
          label: <Link href="/dashboard/resources/services">Services</Link>,
        },
        {
          key: "resources-storage",
          label: <Link href="/dashboard/resources/storage">Storage</Link>,
        },
      ],
    },
    {
      key: "logs-root",
      icon: <DatabaseOutlined />,
      label: <span>Logs</span>,
      children: [
        {
          key: "logs-audit",
          label: <Link href="/dashboard/logs/audit">Audit</Link>,
        },
        {
          key: "logs-system",
          label: <Link href="/dashboard/logs/system">System</Link>,
        },
      ],
    },
    {
      key: "reports-root",
      icon: <FileTextOutlined />,
      label: <span>Reports</span>,
      children: [
        {
          key: "reports-sales",
          label: <Link href="/dashboard/reports/sales">Sales</Link>,
        },
        {
          key: "reports-operations",
          label: <Link href="/dashboard/reports/operations">Operations</Link>,
        },
      ],
    },
    {
      key: "analytics-root",
      icon: <BarChartOutlined />,
      label: <span>Analytics</span>,
      children: [
        {
          key: "analytics-dashboards",
          label: <Link href="/dashboard/analytics/dashboards">Dashboards</Link>,
        },
      ],
    },
    {
      key: "labs",
      icon: <ExperimentOutlined />,
      label: <Link href="/dashboard/labs">Labs</Link>,
      children: [
        {
          key: "labs-experiments",
          label: <Link href="/dashboard/labs/experiments">Experiments</Link>,
        },
      ],
    },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: <Link href="/dashboard/profile">Profile</Link>,
          icon: <UsergroupAddOutlined />,
        },
        {
          key: "settings",
          label: <Link href="/dashboard/settings">Settings</Link>,
          icon: <SettingOutlined />,
        },
        {
          key: "logout",
          label: <span>Logout</span>,
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );
  return (
    <ProtectedRoute>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          breakpoint="lg"
          collapsedWidth={60}
          width={240}
          style={{
            background: "var(--page-bg-accent)",
            borderRight: "1px solid var(--page-border)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 0.5,
              borderBottom: "1px solid var(--page-border)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar
                shape="square"
                size={32}
                style={{ background: "#52c41a" }}
              >
                VF
              </Avatar>
              Waggy<span style={{ color: "var(--accent-color)" }}>Flow</span>
            </span>
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{
              borderInline: "none",
              background: "transparent",
              flex: 1,
              paddingTop: 12,
            }}
            items={menuItems}
          />
          <div
            style={{
              padding: 16,
              borderTop: "1px solid var(--page-border)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Button
              type="text"
              style={{ textAlign: "left", padding: 0 }}
              icon={<SettingOutlined />}
            >
              Preferences
            </Button>
            <Button
              type="text"
              style={{ textAlign: "left", padding: 0 }}
              icon={<LogoutOutlined />}
            >
              Logout
            </Button>
          </div>
        </Sider>
        <Layout>
          <Header
            style={{
              background: "var(--page-bg-accent)",
              borderBottom: "1px solid var(--page-border)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingInline: 20,
              height: 56,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flex: 1,
              }}
            >
              <nav style={{ display: "flex", gap: 16 }}>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/">Home</Link>
              </nav>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Badge count={3} size="small" offset={[0, 2]}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  aria-label="Notifications"
                />
              </Badge>
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <Avatar style={{ background: "#1890ff" }}>
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </Avatar>
              </Dropdown>
            </div>
          </Header>
          <Content
            style={{ padding: 24, background: "var(--page-bg)", minHeight: 0 }}
          >
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}
