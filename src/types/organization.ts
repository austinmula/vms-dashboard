// Organization Types

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  logo?: string | null;
  timezone: string;
  settings?: Record<string, any>;
  subscriptionTier: "free" | "basic" | "premium" | "enterprise";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationStats {
  totalLocations: number;
  totalEmployees: number;
  activeEmployees: number;
  totalUsers: number;
  currentMonthVisitors: number;
}

export interface OrganizationWithStats extends Organization {
  stats?: {
    totalLocations: number;
    totalUsers: number;
    totalEmployees: number;
  };
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  domain?: string;
  address?: string;
  phone?: string;
  website?: string;
  subscriptionTier?: "free" | "basic" | "premium" | "enterprise";
  timezone?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
  domain?: string;
  address?: string;
  phone?: string;
  website?: string;
  subscriptionTier?: "free" | "basic" | "premium" | "enterprise";
  timezone?: string;
}

export interface OrganizationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subscriptionTier?: "free" | "basic" | "premium" | "enterprise";
  isActive?: boolean;
}

export interface OrganizationListResponse {
  data: Organization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
