"use client";
import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  Button,
  Tag,
  Divider,
} from "antd";
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
  BankOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { ProtectedRoute } from "@/components/wrappers/ProtectedRoute";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { roles } = usePermissions();
  const pathname = usePathname();
  const router = useRouter();
  const primaryRole = roles?.[0];

  const displayName = useMemo(() => {
    if (!user) return "Unknown User";
    if ((user as any).firstName) {
      const first = (user as any).firstName;
      const last = (user as any).lastName || "";
      return `${first} ${last}`.trim();
    }
    return (user as any).name || (user as any).email?.split("@")[0] || "User";
  }, [user]);

  const handleLogout = useCallback(() => {
    // TODO: integrate with NextAuth signOut + redux clear
    router.push("/login");
  }, [router]);

  const gotoSettings = useCallback(() => {
    router.push("/dashboard/settings/profile");
  }, [router]);

  const selectedKeys = useMemo(() => {
    if (!pathname) return [];
    const segment = pathname.replace(/\/$/, "").split("/").pop() || "overview";
    const map: Record<string, string> = {
      settings: "settings-root",
      profile: "settings-profile",
      security: "settings-security",
      preferences: "settings-preferences",
      users: "users",
      teams: "teams",
      organizations: "organizations",
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

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const onOpenChange = useCallback((keys: string[]) => setOpenKeys(keys), []);

  const menuItems = [
    {
      key: "overview",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Overview</Link>,
    },
    {
      key: "organizations",
      icon: <BankOutlined />,
      label: <Link href="/dashboard/organizations">Organizations</Link>,
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
        { key: "logout", label: <span>Logout</span>, icon: <LogoutOutlined /> },
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
                size={36}
                style={{ background: "#52c41a" }}
              >
                WF
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
              padding: 14,
              borderTop: "1px solid var(--page-border)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "var(--page-bg)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar size={36} style={{ background: "#1677ff" }}>
                {displayName.slice(0, 1).toUpperCase()}
              </Avatar>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.25,
                }}
              >
                <span style={{ fontWeight: 600 }}>{displayName}</span>
                {primaryRole && (
                  <Tag
                    color="blue"
                    style={{
                      width: "fit-content",
                      paddingInline: 6,
                      fontSize: 11,
                    }}
                  >
                    {String(primaryRole)}
                  </Tag>
                )}
              </div>
            </div>
            <Divider style={{ margin: "4px 0" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                size="small"
                icon={<SettingOutlined />}
                onClick={gotoSettings}
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  display: "flex",
                }}
              >
                Settings
              </Button>
              <Button
                size="small"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  display: "flex",
                }}
              >
                Logout
              </Button>
            </div>
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
                  {displayName.slice(0, 1).toUpperCase()}
                </Avatar>
              </Dropdown>
            </div>
          </Header>
          <Content
            style={{ padding: 24, background: "var(--page-bg)", minHeight: 0 }}
          >
            <div style={{ maxWidth: 1536, margin: "0 0" }}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}
