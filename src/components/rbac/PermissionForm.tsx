"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, AutoComplete } from "antd";
import {
  permissionsApi,
  Permission,
  CreatePermissionInput,
  UpdatePermissionInput,
} from "@/lib/api/permissions";

const { TextArea } = Input;
const { Option } = Select;

interface PermissionFormProps {
  visible: boolean;
  permission?: Permission | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PermissionForm: React.FC<PermissionFormProps> = ({
  visible,
  permission,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);

  const isEditMode = !!permission;

  useEffect(() => {
    if (visible) {
      fetchFilterOptions();
      if (permission) {
        form.setFieldsValue({
          name: permission.name,
          slug: permission.slug,
          resource: permission.resource,
          action: permission.action,
          description: permission.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, permission, form]);

  const fetchFilterOptions = async () => {
    try {
      const [resourcesRes, actionsRes] = await Promise.all([
        permissionsApi.getResources(),
        permissionsApi.getActions(),
      ]);
      setResources(resourcesRes.data);
      setActions(actionsRes.data);
    } catch (error) {
      console.error("Failed to fetch filter options", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode && permission) {
        // Update permission (only name and description can be updated)
        const updateData: UpdatePermissionInput = {
          name: values.name,
          description: values.description,
        };
        await permissionsApi.update(permission.id, updateData);
        message.success("Permission updated successfully");
      } else {
        // Create permission
        const createData: CreatePermissionInput = {
          name: values.name,
          slug: values.slug,
          resource: values.resource,
          action: values.action,
          description: values.description,
          isSystemPermission: false,
        };
        await permissionsApi.create(createData);
        message.success("Permission created successfully");
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      if (error.errorFields) {
        message.error("Please fill in all required fields");
      } else {
        message.error(
          error.response?.data?.error || "Failed to save permission"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSlugGeneration = (resource: string, action: string) => {
    if (resource && action) {
      const slug = `${resource}:${action}`;
      form.setFieldValue("slug", slug);
    }
  };

  const handleResourceChange = (value: string) => {
    const action = form.getFieldValue("action");
    if (action) {
      handleSlugGeneration(value, action);
    }
  };

  const handleActionChange = (value: string) => {
    const resource = form.getFieldValue("resource");
    if (resource) {
      handleSlugGeneration(resource, value);
    }
  };

  // Common resources and actions for suggestions
  const commonActions = [
    "create",
    "read",
    "update",
    "delete",
    "list",
    "assign",
    "approve",
    "reject",
    "export",
    "import",
  ];

  return (
    <Modal
      title={isEditMode ? "Edit Permission" : "Create New Permission"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      width={600}
      confirmLoading={loading}
      okText={isEditMode ? "Update" : "Create"}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Permission Name"
          rules={[
            { required: true, message: "Please enter a permission name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="e.g., Create User" />
        </Form.Item>

        <Form.Item
          name="resource"
          label="Resource"
          rules={[
            { required: true, message: "Please enter a resource" },
            { min: 2, message: "Resource must be at least 2 characters" },
          ]}
        >
          <AutoComplete
            placeholder="e.g., users"
            options={resources.map((r) => ({ value: r }))}
            onChange={handleResourceChange}
            disabled={isEditMode}
          />
        </Form.Item>

        <Form.Item
          name="action"
          label="Action"
          rules={[
            { required: true, message: "Please enter an action" },
            { min: 2, message: "Action must be at least 2 characters" },
          ]}
        >
          <AutoComplete
            placeholder="e.g., create"
            options={[
              ...actions.map((a) => ({ value: a })),
              ...commonActions
                .filter((a) => !actions.includes(a))
                .map((a) => ({ value: a })),
            ]}
            onChange={handleActionChange}
            disabled={isEditMode}
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, message: "Please enter a slug" },
            {
              pattern: /^[a-z0-9:-_]+$/,
              message:
                "Slug must be lowercase letters, numbers, colons, hyphens, and underscores",
            },
          ]}
          extra="Format: resource:action (e.g., users:create)"
        >
          <Input placeholder="e.g., users:create" disabled={isEditMode} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea
            rows={3}
            placeholder="Describe what this permission allows..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
