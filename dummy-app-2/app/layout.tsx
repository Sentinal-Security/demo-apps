import React from "react";

export const metadata = {
  title: "FinTech Payroll Portal (Dummy App 2)",
  description: "SSO Client Application 2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", backgroundColor: "#fdf2f8", color: "#111827" }}>
        {children}
      </body>
    </html>
  );
}
