"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SsoVerifyingScreen } from "./SsoVerifyingScreen";

const PROTECTED_ROUTES = ["/dashboard", "/workforce", "/profile"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authStatus, isSsoHandoff, notice, clearNotice } = useAuth();

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (authStatus === "unauthenticated" && isProtected) {
      router.replace("/");
    }
  }, [authStatus, isProtected, router]);

  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-main">
        {notice && authStatus !== "checking" && (
          <div className={`alert alert-${notice.type}`} role="status">
            <span>{notice.text}</span>
            <button
              type="button"
              onClick={clearNotice}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "inherit",
                fontWeight: 700,
                fontSize: "14px",
              }}
              aria-label="Dismiss notice"
            >
              ×
            </button>
          </div>
        )}

        {authStatus === "checking" ? (
          <SsoVerifyingScreen
            title={isSsoHandoff ? "Completing Sentinel SSO Sign-In..." : "Verifying Active Session..."}
            subtitle={
              isSsoHandoff
                ? "Authorizing your Sentinel Security token and routing you to your dashboard."
                : "Checking your organization session with Sentinel Identity Gateway."
            }
          />
        ) : authStatus === "unauthenticated" && isProtected ? (
          <SsoVerifyingScreen
            title="Session Required"
            subtitle="Redirecting you to the portal sign-in page..."
          />
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
}
