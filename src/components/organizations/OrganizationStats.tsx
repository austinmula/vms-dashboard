"use client";

import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import {
  BankOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

interface OrganizationStatsProps {
  stats: {
    totalLocations: number;
    totalUsers: number;
    totalEmployees: number;
    activeEmployees?: number;
    currentMonthVisitors?: number;
  };
  maxLocations?: number;
  maxUsers?: number;
  maxVisitorsPerMonth?: number;
}

const OrganizationStats: React.FC<OrganizationStatsProps> = ({
  stats,
  maxLocations,
  maxUsers,
  maxVisitorsPerMonth,
}) => {
  const calculateProgress = (current: number, max?: number) => {
    if (!max || max === 0) return 0;
    const percentage = (current / max) * 100;
    return Math.min(percentage, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "#ff4d4f"; // red
    if (percentage >= 75) return "#faad14"; // yellow
    return "#52c41a"; // green
  };

  return (
    <Row gutter={[16, 16]}>
      {/* Locations */}
      <Col xs={24} sm={12} md={8}>
        <Card bordered>
          <Statistic
            title="Total Locations"
            value={stats.totalLocations}
            prefix={<BankOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
          {maxLocations !== undefined && maxLocations > 0 && (
            <div style={{ marginTop: 8 }}>
              <Progress
                percent={calculateProgress(stats.totalLocations, maxLocations)}
                strokeColor={getProgressColor(
                  calculateProgress(stats.totalLocations, maxLocations)
                )}
                format={(percent) => `${stats.totalLocations} / ${maxLocations}`}
              />
            </div>
          )}
        </Card>
      </Col>

      {/* Users */}
      <Col xs={24} sm={12} md={8}>
        <Card bordered>
          <Statistic
            title="System Users"
            value={stats.totalUsers}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
          {maxUsers !== undefined && maxUsers > 0 && (
            <div style={{ marginTop: 8 }}>
              <Progress
                percent={calculateProgress(stats.totalUsers, maxUsers)}
                strokeColor={getProgressColor(
                  calculateProgress(stats.totalUsers, maxUsers)
                )}
                format={(percent) => `${stats.totalUsers} / ${maxUsers}`}
              />
            </div>
          )}
        </Card>
      </Col>

      {/* Employees */}
      <Col xs={24} sm={12} md={8}>
        <Card bordered>
          <Statistic
            title="Total Employees"
            value={stats.totalEmployees}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
          {stats.activeEmployees !== undefined && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#8c8c8c" }}>
              Active: {stats.activeEmployees}
            </div>
          )}
        </Card>
      </Col>

      {/* Monthly Visitors */}
      {stats.currentMonthVisitors !== undefined && (
        <Col xs={24} sm={12} md={8}>
          <Card bordered>
            <Statistic
              title="This Month Visitors"
              value={stats.currentMonthVisitors}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
            {maxVisitorsPerMonth !== undefined && maxVisitorsPerMonth > 0 && (
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={calculateProgress(
                    stats.currentMonthVisitors,
                    maxVisitorsPerMonth
                  )}
                  strokeColor={getProgressColor(
                    calculateProgress(
                      stats.currentMonthVisitors,
                      maxVisitorsPerMonth
                    )
                  )}
                  format={(percent) =>
                    `${stats.currentMonthVisitors} / ${maxVisitorsPerMonth}`
                  }
                />
              </div>
            )}
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default OrganizationStats;
