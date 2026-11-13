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

export async function validateSsoSession(userId?: number, ssoToken?: string): Promise<AuthResponse> {
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
