import React from "react";

export const metadata = {
  title: "Nexus Ops | Incident Command Center",
  description: "Infrastructure Reliability & Incident Response",
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
