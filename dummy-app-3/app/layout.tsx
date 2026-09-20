import React from "react";

export const metadata = {
  title: "DevOps Incident Portal (Dummy App 3)",
  description: "SSO Client Application 3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", backgroundColor: "#ecfdf5", color: "#111827" }}>
        {children}
      </body>
    </html>
  );
}
