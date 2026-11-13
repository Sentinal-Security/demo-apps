export interface NavItem {
  href: string;
  label: string;
}

export const APP_CONFIG = {
  appId: "acme_hr" as const,
  clientId: "acme_hr",
  appNameParam: "Acme Corp HR",
  brandName: "Acme Corp",
  brandPortal: "Global HR Portal",
  tagline: "Workforce Operations & Employee Governance",
  defaultOrigin: "http://localhost:3001",
  theme: {
    accent: "#2563eb",
    accentDark: "#1e40af",
    accentSoft: "#eff6ff",
    accentBorder: "#bfdbfe",
    pageBg: "#f8fafc",
  },
  navItems: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/workforce", label: "Workforce & Leave" },
    { href: "/profile", label: "Profile & Session" },
  ] as NavItem[],
};
