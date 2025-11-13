// NextAuth type definitions
import NextAuth from "next-auth";
import { Role } from "./index";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    employeeId: string;
    organizationId: string;
    name: string;
    firstName: string;
    lastName: string;
    department: string;
    jobTitle: string;
    roles: Role[];
    permissions: string[];
    isActive: boolean;
    mfaEnabled: boolean;
    mustChangePassword: boolean;
    accessToken: string;
    refreshToken: string;
    expiresIn?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      employeeId: string;
      organizationId: string;
      name: string;
      firstName: string;
      lastName: string;
      department: string;
      jobTitle: string;
      roles: Role[];
      permissions: string[];
      isActive: boolean;
      mfaEnabled: boolean;
      mustChangePassword: boolean;
    };
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    employeeId: string;
    organizationId: string;
    name: string;
    firstName: string;
    lastName: string;
    department: string;
    jobTitle: string;
    roles: Role[];
    permissions: string[];
    isActive: boolean;
    mfaEnabled: boolean;
    mustChangePassword: boolean;
    accessToken: string;
    refreshToken: string;
  }
}
