import React from "react";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import { AppShell } from "../components/AppShell";

export const metadata = {
  title: "FinTech Global | Payroll & Treasury",
  description: "Enterprise Financial Disbursals & Compliance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
