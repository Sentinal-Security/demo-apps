"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const isDevOps = user.role === "DEVOPS" || user.role === "ADMIN";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Welcome Header */}
      <div
        className="card card-accent"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span className="badge badge-success">SSO Session Active</span>
            <span className="badge badge-accent">ROLE: {user.role || "USER"}</span>
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: 800 }}>
            Welcome back, {user.fullName || user.email}
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>
            Nexus Ops Incident Command Center — {user.company || "Production SRE Cluster"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/incidents" className="btn btn-primary">
            Open Incidents &amp; Telemetry
          </Link>
          <Link href="/profile" className="btn btn-outline">
            View Profile &amp; Session
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Engineer ID</div>
          <div className="stat-value">#{user.userId}</div>
          <div className="stat-sub">Verified SRE directory ID</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ops Clearance</div>
          <div className="stat-value">{user.role || "USER"}</div>
          <div className="stat-sub">{isDevOps ? "Failover & HPA Enabled" : "Read-Only Telemetry"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">MFA Verification</div>
          <div className="stat-value" style={{ color: user.mfaEnabled ? "#16a34a" : "#d97706" }}>
            {user.mfaEnabled ? "Verified" : "Not Enabled"}
          </div>
          <div className="stat-sub">Enforced via Sentinel IAM</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">API Gateway Latency</div>
          <div className="stat-value" style={{ color: "#059669" }}>
            38ms
          </div>
          <div className="stat-sub">Healthy (99.98% uptime)</div>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div className="two-col-grid">
        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 8px" }}>
            {isDevOps ? "Escalation & Failover Console" : "System Health & Status Board"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.55 }}>
            {isDevOps
              ? "Mitigate active database pool alerts (INC-8891), scale Kubernetes ingress pods, and review service telemetry."
              : "Monitor live infrastructure latency, uptime status across production regions, and cluster health metrics."}
          </p>
          <Link href="/incidents" className="btn btn-secondary">
            Go to Incidents &amp; Telemetry →
          </Link>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 8px" }}>Identity &amp; Session Governance</h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.55 }}>
            Review your authenticated engineer profile, active Sentinel SSO session token, or end your session.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/profile" className="btn btn-outline">
              Session Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
