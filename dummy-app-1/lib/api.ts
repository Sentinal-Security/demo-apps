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
  accessDenied?: boolean;
  authMode?: "sso" | "local";
  requiresVerification?: boolean;
  verified?: boolean;
}

async function postAppAuth(
  path: string,
  payload: Record<string, unknown>,
  fallbackMessage: string
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/app-auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return {
      ...json,
      accessDenied: res.status === 403,
    };
  } catch {
    return { success: false, message: fallbackMessage };
  }
}

export async function registerAppAccount(data: {
  appId: string;
  appName: string;
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return postAppAuth("register", data, "Unable to complete registration. Please try again.");
}

export async function verifyAppRegistration(data: {
  appId: string;
  email: string;
  code: string;
}): Promise<AuthResponse> {
  return postAppAuth("verify-registration", data, "Unable to verify code. Please try again.");
}

export async function resendAppVerificationCode(data: {
  appId: string;
  appName: string;
  email: string;
}): Promise<AuthResponse> {
  return postAppAuth("resend-code", data, "Unable to resend verification code. Please try again.");
}

export async function loginAppAccount(data: {
  appId: string;
  appName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return postAppAuth("login", data, "Unable to sign in right now. Please try again.");
}

export async function validateAppLocalSession(data: {
  appId: string;
  ssoToken: string;
}): Promise<AuthResponse> {
  return postAppAuth("validate", data, "Your sign-in session could not be verified. Please sign in again.");
}

export async function logoutAppLocalSession(data: {
  appId: string;
  ssoToken: string;
}): Promise<AuthResponse> {
  return postAppAuth("logout", data, "Signed out.");
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

export async function validateSsoSession(
  userId?: number,
  ssoToken?: string,
  clientId?: string,
  redirectUri?: string,
  appName?: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ssoToken, clientId, redirectUri, appName }),
  });
  try {
    const json = await res.json();
    return {
      ...json,
      accessDenied: res.status === 403,
    };
  } catch {
    return {
      success: false,
      accessDenied: res.status === 403,
      message: "Your sign-in session couldn't be verified. Please sign in again.",
    };
  }
}
