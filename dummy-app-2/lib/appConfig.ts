export interface NavItem {
  href: string;
  label: string;
}

export const APP_CONFIG = {
  appId: "fintech_payroll" as const,
  clientId: "fintech_payroll",
  appNameParam: "FinTech Payroll",
  brandInitials: "FT",
  brandName: "FinTech Global",
  brandPortal: "Payroll & Treasury",
  tagline: "Corporate Compensation & Disbursement Terminal",
  defaultOrigin: "http://localhost:3002",
  theme: {
    accent: "#db2777",
    accentDark: "#9d174d",
    accentSoft: "#fdf2f8",
    accentBorder: "#fbcfe8",
    pageBg: "#fdf2f8",
  },
  navItems: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/payroll", label: "Payroll & Treasury" },
    { href: "/profile", label: "Profile & Session" },
  ] as NavItem[],
};
