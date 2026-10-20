import React from "react";

export const metadata = {
  title: "Acme Corp | Global HR Portal",
  description: "Workforce Operations & Employee Governance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", backgroundColor: "#f4f6f9", color: "#111827" }}>
        {children}
      </body>
    </html>
  );
}
