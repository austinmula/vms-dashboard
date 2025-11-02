"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createOrganization,
  updateOrganization,
  selectOrganizationsLoading,
} from "../../store/slices/organizationsSlice";
import {
  Organization,
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "../../types/organization";

const { TextArea } = Input;

interface OrganizationFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organization?: Organization | null;
  mode?: "create" | "edit";
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  visible,
  onClose,
  onSuccess,
  organization,
  mode = "create",
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectOrganizationsLoading);

  useEffect(() => {
    if (visible && mode === "edit" && organization) {
      form.setFieldsValue({
        name: organization.name,
        slug: organization.slug,
        domain: organization.domain || "",
        address: organization.address || "",
        phone: organization.phone || "",
        website: organization.website || "",
        subscriptionTier: organization.subscriptionTier,
        timezone: organization.timezone,
      });
    } else if (visible && mode === "create") {
      form.resetFields();
      form.setFieldsValue({
        subscriptionTier: "basic",
        timezone: "UTC",
      });
    }
  }, [visible, mode, organization, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (mode === "create") {
        const createData: CreateOrganizationInput = {
          name: values.name,
          slug: values.slug,
          domain: values.domain || undefined,
          address: values.address || undefined,
          phone: values.phone || undefined,
          website: values.website || undefined,
          subscriptionTier: values.subscriptionTier,
          timezone: values.timezone,
        };

        await dispatch(createOrganization(createData)).unwrap();
        message.success("Organization created successfully");
      } else if (mode === "edit" && organization) {
        const updateData: UpdateOrganizationInput = {
          name: values.name,
          slug: values.slug,
          domain: values.domain || undefined,
          address: values.address || undefined,
          phone: values.phone || undefined,
          website: values.website || undefined,
          subscriptionTier: values.subscriptionTier,
          timezone: values.timezone,
        };

        await dispatch(
          updateOrganization({ id: organization.id, data: updateData })
        ).unwrap();
        message.success("Organization updated successfully");
      }

      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      if (error.errors) {
        message.error(error.errors[0] || "Validation failed");
      } else {
        message.error(
          error || `Failed to ${mode === "create" ? "create" : "update"} organization`
        );
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const generateSlug = () => {
    const name = form.getFieldValue("name");
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setFieldsValue({ slug });
    }
  };

  return (
    <Modal
      title={mode === "create" ? "Create Organization" : "Edit Organization"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          label="Organization Name"
          name="name"
          rules={[
            { required: true, message: "Please enter organization name" },
            {
              min: 2,
              max: 255,
              message: "Name must be between 2 and 255 characters",
            },
          ]}
        >
          <Input
            placeholder="Enter organization name"
            onBlur={mode === "create" ? generateSlug : undefined}
          />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            { required: true, message: "Please enter organization slug" },
            {
              pattern: /^[a-z0-9-]+$/,
              message: "Slug must contain only lowercase letters, numbers, and hyphens",
            },
            {
              min: 2,
              max: 100,
              message: "Slug must be between 2 and 100 characters",
            },
          ]}
          tooltip="URL-friendly identifier (auto-generated from name)"
        >
          <Input placeholder="organization-slug" />
        </Form.Item>

        <Form.Item
          label="Domain"
          name="domain"
          rules={[
            {
              type: "email",
              message: "Please enter a valid domain",
            },
          ]}
          tooltip="Email domain for SSO (optional)"
        >
          <Input placeholder="example.com" />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <TextArea
            placeholder="Enter organization address"
            rows={2}
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              max: 50,
              message: "Phone must be at most 50 characters",
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          label="Website"
          name="website"
          rules={[
            {
              type: "url",
              message: "Please enter a valid URL",
            },
          ]}
        >
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item
          label="Subscription Tier"
          name="subscriptionTier"
          rules={[
            { required: true, message: "Please select subscription tier" },
          ]}
        >
          <Select
            placeholder="Select subscription tier"
            options={[
              { label: "Free", value: "free" },
              { label: "Basic", value: "basic" },
              { label: "Premium", value: "premium" },
              { label: "Enterprise", value: "enterprise" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Timezone"
          name="timezone"
          rules={[{ required: true, message: "Please enter timezone" }]}
        >
          <Select
            placeholder="Select timezone"
            showSearch
            options={[
              { label: "UTC", value: "UTC" },
              { label: "America/New_York", value: "America/New_York" },
              { label: "America/Chicago", value: "America/Chicago" },
              { label: "America/Denver", value: "America/Denver" },
              { label: "America/Los_Angeles", value: "America/Los_Angeles" },
              { label: "Europe/London", value: "Europe/London" },
              { label: "Europe/Paris", value: "Europe/Paris" },
              { label: "Asia/Tokyo", value: "Asia/Tokyo" },
              { label: "Asia/Shanghai", value: "Asia/Shanghai" },
              { label: "Australia/Sydney", value: "Australia/Sydney" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrganizationForm;
