"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const isPrivileged = user.role === "HR" || user.role === "ADMIN";

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
            <span className="badge badge-success">
              {user.authMode === "local" ? "Direct Account Active" : "SSO Session Active"}
            </span>
            <span className="badge badge-accent">ROLE: {user.role || "USER"}</span>
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: 800 }}>
            Welcome back, {user.fullName || user.email}
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>
            Acme Corp Global HR Portal —{" "}
            {user.company || (user.authMode === "local" ? "Independent Account" : "Enterprise Directory")}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/workforce" className="btn btn-primary">
            Open Workforce &amp; Leave
          </Link>
          <Link href="/profile" className="btn btn-outline">
            View Profile &amp; Session
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Employee ID</div>
          <div className="stat-value">#{user.userId}</div>
          <div className="stat-sub">Verified directory identity</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Access Clearance</div>
          <div className="stat-value">{user.role || "USER"}</div>
          <div className="stat-sub">{isPrivileged ? "HR Moderation Enabled" : "Standard Self-Service"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">MFA Verification</div>
          <div className="stat-value" style={{ color: user.mfaEnabled ? "#16a34a" : "#d97706" }}>
            {user.mfaEnabled ? "Verified" : "Not Enabled"}
          </div>
          <div className="stat-sub">Enforced via Sentinel IAM</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Workforce</div>
          <div className="stat-value">142 Staff</div>
          <div className="stat-sub">2 pending HR governance actions</div>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div className="two-col-grid">
        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 8px" }}>
            {isPrivileged ? "HR Governance & Approvals" : "Attendance & Directory"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.55 }}>
            {isPrivileged
              ? "Review pending staff promotion applications, approve annual leave requests, and browse the corporate directory."
              : "Clock in or out for your current shift, check your duty timestamp, and browse the corporate directory."}
          </p>
          <Link href="/workforce" className="btn btn-secondary">
            Go to Workforce &amp; Leave →
          </Link>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 8px" }}>Identity &amp; Session Governance</h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.55 }}>
            Inspect your federated Sentinel SSO profile claims, check multi-factor verification status, or end your session.
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
