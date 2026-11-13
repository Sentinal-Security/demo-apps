"use client";

import React from "react";
import { APP_CONFIG } from "../lib/appConfig";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>{APP_CONFIG.brandName} | {APP_CONFIG.brandPortal}</strong> — Secured by Sentinel Zero-Trust Identity Federation
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Enterprise SSO Protected Client Portal
        </div>
      </div>
    </footer>
  );
}
