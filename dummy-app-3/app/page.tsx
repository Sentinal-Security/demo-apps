"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { SsoVerifyingScreen } from "../components/SsoVerifyingScreen";

export default function HomePage() {
  const router = useRouter();
  const { authStatus, buildSsoLoginUrl, loginDirect, setNotice } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const verifiedParam = params.get("verified");
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
    if (verifiedParam === "1") {
      setNotice({
        type: "success",
        text: "Your email is verified. Sign in below with your credentials to access Nexus Ops.",
      });
    }
  }, [setNotice]);

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [authStatus, router]);

  if (authStatus === "authenticated") {
    return (
      <SsoVerifyingScreen
        title="Opening Incident Command..."
        subtitle="Redirecting to your Nexus Ops dashboard..."
      />
    );
  }

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setLoginError(null);
    setNeedsVerification(false);
    const res = await loginDirect(email, password);
    setSubmitting(false);
    if (!res.success) {
      setLoginError(res.message || "Invalid email or password.");
      setNeedsVerification(Boolean(res.requiresVerification));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* Hero + Sign-In Split */}
      <section className="hero-grid" id="top">
        <div style={{ paddingTop: "8px" }}>
          <span className="badge badge-accent" style={{ marginBottom: "14px" }}>
            Sentinel Federated SRE Command
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
            Site Reliability &amp; Infrastructure Monitoring
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
            Nexus Ops Incident Command Center coordinates cluster failover commands, Kubernetes
            HPA scaling, and live gateway telemetry behind Sentinel Zero-Trust SSO.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: "11px 18px" }}>
              Create an Account
            </Link>
            <a href={buildSsoLoginUrl()} className="btn btn-outline" style={{ padding: "11px 18px" }}>
              Sign in with Sentinel SSO
            </a>
            <a href="#capabilities" className="btn btn-outline" style={{ padding: "11px 18px" }}>
              Explore Capabilities
            </a>
          </div>

          <div className="two-col-grid" style={{ gap: "12px" }}>
            <div className="stat-card">
              <div className="stat-label">Gateway Telemetry</div>
              <div className="stat-value" style={{ fontSize: "16px", color: "#059669" }}>
                38ms (Healthy)
              </div>
              <div className="stat-sub">ap-southeast-2 cluster online</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Access Control</div>
              <div className="stat-value" style={{ fontSize: "16px" }}>
                Role-Based RBAC
              </div>
              <div className="stat-sub">DEVOPS / ADMIN vs Observer Telemetry</div>
            </div>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="card" id="signin">
          <div
            className="card-accent"
            style={{ padding: "16px", borderRadius: "10px", textAlign: "center", marginBottom: "18px" }}
          >
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--accent-dark)", margin: "0 0 6px" }}>
              Enterprise Single Sign-On (SSO)
            </h2>
            <p style={{ fontSize: "13px", color: "#047857", margin: "0 0 14px" }}>
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
              OR SIGN IN DIRECTLY
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
          </div>

          <form onSubmit={handleDirectLogin}>
            <h3 style={{ fontSize: "15px", margin: "0 0 4px", color: "#334155" }}>
              Nexus Ops Account Sign In
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 12px" }}>
              Use an account created directly on Nexus Ops (no Sentinel Security account required).
            </p>

            {loginError && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                <div>{loginError}</div>
                {needsVerification && (
                  <div style={{ marginTop: "6px" }}>
                    <Link
                      href={`/register?verify=1${email ? `&email=${encodeURIComponent(email)}` : ""}`}
                      style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "underline" }}
                    >
                      Verify your email &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: "12px" }}>
              <label className="form-label" htmlFor="devops-email">
                Email Address:
              </label>
              <input
                id="devops-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label" htmlFor="devops-password">
                Password:
              </label>
              <input
                id="devops-password"
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
              {submitting ? "Signing in..." : "Sign In to Nexus Ops"}
            </button>
          </form>

          <div
            style={{
              marginTop: "14px",
              paddingTop: "14px",
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}
          >
            New to Nexus Ops?{" "}
            <Link href="/register" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities">
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 6px" }}>
            Portal Capabilities
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
            Available site reliability and incident remediation modules after authenticating via Sentinel SSO.
          </p>
        </div>

        <div className="three-col-grid">
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Dashboard
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>Operations Overview</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              Inspect cluster latency, active incident counts, and your engineer clearance level at a glance.
            </p>
          </div>
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Incidents &amp; Telemetry
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>Failover &amp; Uptime Board</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              DEVOPS/ADMIN engineers drain pools and scale HPA pods; observers monitor real-time service telemetry.
            </p>
          </div>
          <div className="card">
            <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
              Profile &amp; Session
            </span>
            <h3 style={{ fontSize: "16px", margin: "0 0 8px" }}>Verified Identity Claims</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
              Inspect your federated engineer ID, SRE clearance role, MFA verification status, and active session controls.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
