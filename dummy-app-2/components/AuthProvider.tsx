"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthResponse, getSentinelPortalUrl, validateSsoSession } from "../lib/api";
import { APP_CONFIG } from "../lib/appConfig";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export interface AuthNotice {
  type: "info" | "success" | "error";
  text: string;
}

interface AuthContextValue {
  authStatus: AuthStatus;
  isSsoHandoff: boolean;
  user: AuthResponse | null;
  ssoToken: string | null;
  origin: string;
  notice: AuthNotice | null;
  clearNotice: () => void;
  setNotice: (notice: AuthNotice | null) => void;
  buildSsoLoginUrl: (email?: string) => string;
  startSsoRedirect: (email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [isSsoHandoff, setIsSsoHandoff] = useState(false);
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [ssoToken, setSsoToken] = useState<string | null>(null);
  const [portalUrl, setPortalUrl] = useState("https://web-beta-orcin-33.vercel.app");
  const [origin, setOrigin] = useState(APP_CONFIG.defaultOrigin);
  const [notice, setNotice] = useState<AuthNotice | null>(null);

  // Preserve extracted query params across React Strict Mode double-effects
  const initialQueryRef = useRef<{
    userId: string | null;
    token: string | null;
    mode: string | null;
    parsed: boolean;
  }>({ userId: null, token: null, mode: null, parsed: false });

  useEffect(() => {
    setPortalUrl(getSentinelPortalUrl());
    if (typeof window !== "undefined" && window.location.origin) {
      setOrigin(window.location.origin);
    }

    if (!initialQueryRef.current.parsed) {
      const urlParams = new URLSearchParams(window.location.search);
      initialQueryRef.current = {
        userId: urlParams.get("ssoUserId") || urlParams.get("userId"),
        token: urlParams.get("ssoToken"),
        mode: urlParams.get("mode"),
        parsed: true,
      };
      if (initialQueryRef.current.userId || initialQueryRef.current.token) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const { userId: queryUserId, token: queryToken, mode } = initialQueryRef.current;
    const hasQuerySso = Boolean(queryUserId || queryToken);

    if (hasQuerySso) {
      setIsSsoHandoff(true);
    }

    if (mode === "login" && !hasQuerySso) {
      localStorage.removeItem("sentinel_sso_userId");
      localStorage.removeItem("sentinel_sso_token");
      setUser(null);
      setSsoToken(null);
      setAuthStatus("unauthenticated");
      return;
    }

    const targetUserId = queryUserId || localStorage.getItem("sentinel_sso_userId");
    const targetToken = queryToken || localStorage.getItem("sentinel_sso_token") || undefined;

    if (!targetUserId && !targetToken) {
      setAuthStatus("unauthenticated");
      return;
    }

    let cancelled = false;
    const currentOrigin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : APP_CONFIG.defaultOrigin;

    validateSsoSession(
      targetUserId ? Number(targetUserId) : undefined,
      targetToken,
      APP_CONFIG.clientId,
      currentOrigin,
      APP_CONFIG.appNameParam
    )
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setUser(res);
          const resolvedUserId = res.userId ?? (targetUserId ? Number(targetUserId) : undefined);
          const resolvedToken = targetToken || res.ssoToken || null;
          setSsoToken(resolvedToken);
          if (resolvedUserId) {
            localStorage.setItem("sentinel_sso_userId", String(resolvedUserId));
          }
          if (resolvedToken) {
            localStorage.setItem("sentinel_sso_token", resolvedToken);
          }
          setAuthStatus("authenticated");
          if (hasQuerySso) {
            setNotice({ type: "success", text: "Single Sign-On (SSO) Session Active." });
            if (window.location.pathname === "/") {
              router.replace("/dashboard");
            }
          }
        } else {
          localStorage.removeItem("sentinel_sso_userId");
          localStorage.removeItem("sentinel_sso_token");
          setUser(null);
          setSsoToken(null);
          setAuthStatus("unauthenticated");
          setIsSsoHandoff(false);
          if (
            hasQuerySso ||
            res.accessDenied ||
            (res.message &&
              (res.message.toLowerCase().includes("permission") ||
                res.message.toLowerCase().includes("access denied")))
          ) {
            setNotice({
              type: "error",
              text: res.message || "Your sign-in session couldn't be verified. Please sign in again.",
            });
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem("sentinel_sso_userId");
        localStorage.removeItem("sentinel_sso_token");
        setUser(null);
        setSsoToken(null);
        setAuthStatus("unauthenticated");
        setIsSsoHandoff(false);
        if (hasQuerySso) {
          setNotice({
            type: "error",
            text: "We couldn't connect to the sign-in service right now. Please try again in a moment.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const buildSsoLoginUrl = useCallback(
    (email?: string) => {
      const redirectTarget =
        origin ||
        (typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : APP_CONFIG.defaultOrigin);
      const emailParam = email ? `&email=${encodeURIComponent(email)}` : "";
      return `${portalUrl}/login?client_id=${APP_CONFIG.clientId}&redirect_uri=${encodeURIComponent(
        redirectTarget
      )}&app_name=${encodeURIComponent(APP_CONFIG.appNameParam)}${emailParam}`;
    },
    [origin, portalUrl]
  );

  const startSsoRedirect = useCallback(
    (email?: string) => {
      const targetUrl = buildSsoLoginUrl(email);
      window.location.href = targetUrl;
    },
    [buildSsoLoginUrl]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("sentinel_sso_userId");
    localStorage.removeItem("sentinel_sso_token");
    setUser(null);
    setSsoToken(null);
    setAuthStatus("unauthenticated");
    setNotice({ type: "info", text: `Logged out from ${APP_CONFIG.brandPortal}.` });
    router.replace("/");
  }, [router]);

  const clearNotice = useCallback(() => setNotice(null), []);

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        isSsoHandoff,
        user,
        ssoToken,
        origin,
        notice,
        clearNotice,
        setNotice,
        buildSsoLoginUrl,
        startSsoRedirect,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
