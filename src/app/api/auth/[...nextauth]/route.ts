// pages/api/auth/[...nextauth].js

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "@/lib/api/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call your API
          const response = await authApi.login(
            credentials.email,
            credentials.password
          );

          if (response.success && response.data) {
            const { user, tokens } = response.data;

            // Return user data to be stored in JWT
            // Permissions now come directly from the backend
            return {
              id: user.id,
              email: user.email,
              employeeId: user.employeeId,
              organizationId: user.organizationId,
              name: `${user.employee?.firstName || ""} ${
                user.employee?.lastName || ""
              }`.trim(),
              firstName: user.employee?.firstName || "",
              lastName: user.employee?.lastName || "",
              department: user.employee?.department || "",
              jobTitle: user.employee?.jobTitle || "",
              roles: user.roles,
              permissions: user.permissions || [],
              isActive: user.isActive,
              mfaEnabled: user.mfaEnabled,
              mustChangePassword: user.mustChangePassword,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              expiresIn: tokens.expiresIn,
            };
          }

          return null;
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(
            error.response?.data?.message || "Authentication failed"
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.employeeId = user.employeeId;
        token.organizationId = user.organizationId;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.department = user.department;
        token.jobTitle = user.jobTitle;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.isActive = user.isActive;
        token.mfaEnabled = user.mfaEnabled;
        token.mustChangePassword = user.mustChangePassword;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      // Pass everything to the session
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          employeeId: token.employeeId,
          organizationId: token.organizationId,
          name: token.name,
          firstName: token.firstName,
          lastName: token.lastName,
          department: token.department,
          jobTitle: token.jobTitle,
          roles: token.roles,
          permissions: token.permissions,
          isActive: token.isActive,
          mfaEnabled: token.mfaEnabled,
          mustChangePassword: token.mustChangePassword,
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (matches your token expiry)
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
