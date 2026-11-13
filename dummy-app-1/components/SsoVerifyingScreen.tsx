"use client";

import React from "react";
import { APP_CONFIG } from "../lib/appConfig";

interface SsoVerifyingScreenProps {
  title?: string;
  subtitle?: string;
}

export function SsoVerifyingScreen({ title, subtitle }: SsoVerifyingScreenProps) {
  return (
    <div className="verify-wrap">
      <div className="card verify-card">
        <div className="spinner" aria-hidden="true" />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "10px",
          }}
          className="badge badge-accent"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Sentinel Zero-Trust SSO</span>
        </div>
        <h2 style={{ margin: "6px 0 8px", fontSize: "19px", fontWeight: 700 }}>
          {title || `Signing into ${APP_CONFIG.brandName}`}
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>
          {subtitle || "Verifying your encrypted SSO session with Sentinel Identity Gateway..."}
        </p>
      </div>
    </div>
  );
}
