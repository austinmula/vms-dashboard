import React from "react";

export const metadata = {
  title: "Auth | VMS Dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--page-bg-accent)",
          border: "1px solid var(--page-border)",
          boxShadow: "var(--page-shadow)",
          borderRadius: 16,
          padding: 32,
        }}
      >
        {children}
      </div>
    </div>
  );
}
