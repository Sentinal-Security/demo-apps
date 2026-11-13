export const API_BASE_URL = "https://backend-pi68.onrender.com";

export function getSentinelPortalUrl(): string {
  if (process.env.NEXT_PUBLIC_SENTINEL_PORTAL_URL) {
    return process.env.NEXT_PUBLIC_SENTINEL_PORTAL_URL;
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:3000";
  }
  return "https://web-beta-orcin-33.vercel.app";
}

export interface DemoAppLink {
  id: "acme_hr" | "fintech_payroll" | "devops_incident";
  name: string;
  shortName: string;
  subtitle: string;
  localUrl: string;
  prodUrl: string;
  color: string;
}

export const DEMO_APPS: DemoAppLink[] = [
  {
    id: "acme_hr",
    name: "Acme HR Portal",
    shortName: "Acme HR",
    subtitle: "Workforce & Governance",
    localUrl: "http://localhost:3001",
    prodUrl: "https://demo-apps-blue.vercel.app",
    color: "#2563eb",
  },
  {
    id: "fintech_payroll",
    name: "FinTech Payroll",
    shortName: "FinTech Payroll",
    subtitle: "Payroll & Treasury",
    localUrl: "http://localhost:3002",
    prodUrl: "https://demo-apps-sfjl.vercel.app",
    color: "#db2777",
  },
  {
    id: "devops_incident",
    name: "Nexus Ops",
    shortName: "Nexus Ops",
    subtitle: "Incident Command",
    localUrl: "http://localhost:3003",
    prodUrl: "https://demo-apps-fjk5.vercel.app",
    color: "#059669",
  },
];

export function getDemoAppBaseUrl(app: DemoAppLink): string {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return app.localUrl;
  }
  return app.prodUrl;
}

export function getAppSwitchHref(
  app: DemoAppLink,
  userId?: number,
  email?: string,
  ssoToken?: string | null
): string {
  const base = getDemoAppBaseUrl(app);
  if (userId && ssoToken) {
    const params = new URLSearchParams({
      ssoUserId: String(userId),
      ssoToken,
    });
    if (email) {
      params.set("ssoUserEmail", email);
    }
    return `${base}/?${params.toString()}`;
  }
  return base;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  userId?: number;
  email?: string;
  fullName?: string;
  role?: string;
  company?: string;
  subscriptionTier?: string;
  ssoToken?: string;
  mfaEnabled?: boolean;
  mfaRequired?: boolean;
}

export async function loginToCentralApi(data: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    return await res.json();
  } catch {
    return { success: false, message: "Unable to parse login response." };
  }
}

export async function validateSsoSession(userId: number, ssoToken?: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ssoToken }),
  });
  try {
    return await res.json();
  } catch {
    return { success: false, message: "Unable to validate SSO session." };
  }
}
