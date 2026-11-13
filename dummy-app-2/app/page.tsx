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
        title="Opening Treasury Dashboard..."
        subtitle="Redirecting to your FinTech Global workspace..."
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
            Sentinel Federated Financial Portal
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
            Corporate Compensation &amp; Disbursement Terminal
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
            FinTech Global Payroll &amp; Treasury unifies bi-weekly ACH batch disbursements,
            verified employee pay statements, and compliance audits under Sentinel Zero-Trust SSO.
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
              <div className="stat-label">Escrow Compliance</div>
              <div className="stat-value" style={{ fontSize: "16px" }}>
                MFA-Gated ACH
              </div>
              <div className="stat-sub">Hardware &amp; push authorized</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Access Control</div>
              <div className="stat-value" style={{ fontSize: "16px" }}>
                Role-Based RBAC
              </div>
              <div className="stat-sub">FINANCE / ADMIN vs Employee Paystubs</div>
            </div>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="card" id="signin">
          <div
            className="card-accent"
            style={{ padding: "16px", borderRadius: "10px", textAlign: "center", marginBottom: "18px" }}
          >
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#831843", margin: "0 0 6px" }}>
              Enterprise Single Sign-On (SSO)
            </h2>
            <p style={{ fontSize: "13px", color: "var(--accent-dark)", margin: "0 0 14px" }}>
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
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
            <span style={{ margin: "0 10px", fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>
              OR DIRECT CREDENTIALS
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
          </div>

          <form onSubmit={handleDirectLogin}>
            <h3 style={{ fontSize: "15px", margin: "0 0 12px", color: "#334155" }}>Direct API Sign In</h3>
            <div style={{ marginBottom: "12px" }}>
              <label className="form-label" htmlFor="fintech-email">
                Corporate Email:
              </label>
              <input
                id="fintech-email"
                type="email"
                className="form-input"
                placeholder="name@fintechglobal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label" htmlFor="fintech-password">
                Password:
              </label>
              <input
                id="fintech-password"
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
              {submitting ? "Forwarding to Sentinel..." : "Login to FinTech Payroll Portal"}
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
            Available treasury and compensation modules after authenticating via Sentinel SSO.
          </p>
        </div>

        <div className="three-col-grid">
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Dashboard
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>Compensation Overview</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              View your payroll standing, MFA verification clearance, and upcoming cycle timelines.
            </p>
          </div>
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Payroll &amp; Treasury
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>ACH Disbursements &amp; Paystubs</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              Finance signatories authorize $486,250.00 ACH batches; employees access verified earnings &amp; CSV stubs.
            </p>
          </div>
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Profile &amp; Session
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>Verified Identity Claims</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              Inspect your federated account ID, treasury role clearance, MFA status, and active session controls.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
