export interface NavItem {
  href: string;
  label: string;
}

export const APP_CONFIG = {
  appId: "devops_incident" as const,
  clientId: "devops_incident",
  appNameParam: "DevOps Incident Center",
  brandInitials: "NO",
  brandName: "Nexus Ops",
  brandPortal: "Incident Command Center",
  tagline: "Site Reliability & Infrastructure Monitoring",
  defaultOrigin: "http://localhost:3003",
  theme: {
    accent: "#059669",
    accentDark: "#065f46",
    accentSoft: "#ecfdf5",
    accentBorder: "#a7f3d0",
    pageBg: "#f0fdf4",
  },
  navItems: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/incidents", label: "Incidents & Telemetry" },
    { href: "/profile", label: "Profile & Session" },
  ] as NavItem[],
};
