"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const isFinance = user.role === "FINANCE" || user.role === "ADMIN";

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
            FinTech Global Payroll &amp; Treasury —{" "}
            {user.company || (user.authMode === "local" ? "Independent Account" : "Corporate Entity")}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/payroll" className="btn btn-primary">
            Open Payroll &amp; Treasury
          </Link>
          <Link href="/profile" className="btn btn-outline">
            View Profile &amp; Session
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Account ID</div>
          <div className="stat-value">#{user.userId}</div>
          <div className="stat-sub">Federated treasury identity</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Treasury Clearance</div>
          <div className="stat-value">{user.role || "USER"}</div>
          <div className="stat-sub">{isFinance ? "Disbursement Signatory" : "Personal Earnings View"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">MFA Verification</div>
          <div className="stat-value" style={{ color: user.mfaEnabled ? "#16a34a" : "#d97706" }}>
            {user.mfaEnabled ? "Verified" : "Not Enabled"}
          </div>
          <div className="stat-sub">Protected by Sentinel IAM</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{isFinance ? "Q4 Mid-Cycle Batch" : "Latest Deposit"}</div>
          <div className="stat-value">{isFinance ? "$486,250" : "$3,842.10"}</div>
          <div className="stat-sub">{isFinance ? "142 Employees queued" : "Direct Deposit verified"}</div>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div className="two-col-grid">
        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 8px" }}>
            {isFinance ? "Treasury Ledger & Disbursement" : "Earnings & Tax Documents"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.55 }}>
            {isFinance
              ? "Review the Q4 Mid-Cycle ACH batch from Silicon Valley National Bank Escrow and inspect historical disbursements."
              : "Review your verified direct deposit statements, download CSV paystubs, and inspect ledger history."}
          </p>
          <Link href="/payroll" className="btn btn-secondary">
            Go to Payroll &amp; Treasury →
          </Link>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 8px" }}>Identity &amp; Session Governance</h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.55 }}>
            Inspect your Sentinel SSO account profile, active session verification token, or end your active session.
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
