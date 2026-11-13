"use client";

import React from "react";
import { DEMO_APPS, getAppSwitchHref } from "../lib/api";
import { APP_CONFIG } from "../lib/appConfig";
import { useAuth } from "./AuthProvider";

export function Footer() {
  const { authStatus, user, ssoToken, portalUrl } = useAuth();
  const isAuthenticated = authStatus === "authenticated" && Boolean(user);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>{APP_CONFIG.brandName} | {APP_CONFIG.brandPortal}</strong> — Secured by Sentinel Zero-Trust Identity Federation
        </div>
        <div className="footer-links">
          {DEMO_APPS.map((app) => {
            const isCurrent = app.id === APP_CONFIG.appId;
            const href = isCurrent
              ? isAuthenticated
                ? "/dashboard"
                : "/"
              : getAppSwitchHref(app, user?.userId, user?.email, ssoToken);
            return (
              <a
                key={app.id}
                href={href}
                style={isCurrent ? { color: "var(--accent-dark)", fontWeight: 700 } : undefined}
              >
                {app.shortName}
              </a>
            );
          })}
          <a
            href={isAuthenticated ? `${portalUrl}/dashboard` : portalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Sentinel IAM
          </a>
        </div>
      </div>
    </footer>
  );
}
