"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { SsoVerifyingScreen } from "../components/SsoVerifyingScreen";

export default function HomePage() {
  const router = useRouter();
  const { authStatus, buildSsoLoginUrl, startSsoRedirect, setNotice } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [authStatus, router]);

  if (authStatus === "authenticated") {
    return (
      <SsoVerifyingScreen
        title="Opening HR Dashboard..."
        subtitle="Redirecting to your Acme Corp workspace..."
      />
    );
  }

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice({
      type: "info",
      text: "Forwarding to Sentinel Security Identity Gateway for credential authorization...",
    });
    setTimeout(() => {
      startSsoRedirect(email);
    }, 300);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* Hero + Sign-In Split */}
      <section className="hero-grid" id="top">
        <div style={{ paddingTop: "8px" }}>
          <span className="badge badge-accent" style={{ marginBottom: "14px" }}>
            Sentinel Federated HR Workspace
          </span>
          <h1
            style={{
              fontSize: "34px",
              lineHeight: 1.15,
              margin: "0 0 14px",
              color: "#0f172a",
              fontWeight: 800,
            }}
          >
            Workforce Operations &amp; Employee Governance
          </h1>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.65,
              color: "var(--text-secondary)",
              margin: "0 0 24px",
              maxWidth: "540px",
            }}
          >
            Acme Corp Global HR Portal centralizes employee directory records, attendance
            check-ins, and role-gated promotion approvals behind Sentinel Zero-Trust Single Sign-On.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
            <a href={buildSsoLoginUrl()} className="btn btn-primary" style={{ padding: "11px 18px" }}>
              Sign in with Sentinel SSO
            </a>
            <a href="#capabilities" className="btn btn-outline" style={{ padding: "11px 18px" }}>
              Explore Capabilities
            </a>
          </div>

          <div className="two-col-grid" style={{ gap: "12px" }}>
            <div className="stat-card">
              <div className="stat-label">Identity Protocol</div>
              <div className="stat-value" style={{ fontSize: "16px" }}>
                Sentinel Zero-Trust SSO
              </div>
              <div className="stat-sub">Multi-factor &amp; push verified</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Access Control</div>
              <div className="stat-value" style={{ fontSize: "16px" }}>
                Role-Based RBAC
              </div>
              <div className="stat-sub">HR / ADMIN vs Standard Self-Service</div>
            </div>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="card" id="signin">
          <div className="card-accent" style={{ padding: "16px", borderRadius: "10px", textAlign: "center", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--accent-dark)", margin: "0 0 6px" }}>
              Enterprise Single Sign-On (SSO)
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
              Sign in with your organization email via Sentinel Security with multi-factor verification.
            </p>
            <a href={buildSsoLoginUrl()} className="btn-sso">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Sign in with Sentinel Security</span>
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
            <span style={{ margin: "0 10px", fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>
              OR DIRECT CREDENTIALS
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
          </div>

          <form onSubmit={handleDirectLogin}>
            <h3 style={{ fontSize: "15px", margin: "0 0 12px", color: "#334155" }}>Direct API Sign In</h3>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label" htmlFor="acme-email">
                Corporate Email:
              </label>
              <input
                id="acme-email"
                type="email"
                className="form-input"
                placeholder="name@acmecorp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label" htmlFor="acme-password">
                Password:
              </label>
              <input
                id="acme-password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: "100%", padding: "11px" }}
            >
              {submitting ? "Forwarding to Sentinel..." : "Login to Acme HR Portal"}
            </button>
          </form>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities">
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 6px" }}>
            Portal Capabilities
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
            Available modules after authenticating with your Sentinel organization account.
          </p>
        </div>

        <div className="three-col-grid">
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Dashboard
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>Workforce Overview</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              View live employee headcount metrics, your verified MFA status, and role clearance at a glance.
            </p>
          </div>
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Workforce &amp; Leave
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>Governance &amp; Attendance</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              HR and Admin users moderate promotions and leave requests; employees clock shifts and browse the directory.
            </p>
          </div>
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Cross-App SSO
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>Seamless Portal Switching</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              Jump straight to FinTech Payroll or Nexus Ops from the top navigation bar without re-entering credentials.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
