"use client";

import { useState, useEffect } from "react";
import { loginToCentralApi, validateSsoSession, AuthResponse } from "../lib/api";

export default function DummyApp2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check URL query parameters for SSO handoff first
    const urlParams = new URLSearchParams(window.location.search);
    const queryUserId = urlParams.get("ssoUserId") || urlParams.get("userId");

    const targetUserId = queryUserId || localStorage.getItem("sentinel_sso_userId");

    if (targetUserId) {
      setLoading(true);
      validateSsoSession(Number(targetUserId))
        .then((res) => {
          setLoading(false);
          if (res.success) {
            setUser(res);
            localStorage.setItem("sentinel_sso_userId", String(targetUserId));
            setMessage("Single Sign-On (SSO) Session Active.");
            if (queryUserId) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else {
            localStorage.removeItem("sentinel_sso_userId");
          }
        })
        .catch(() => {
          setLoading(false);
          localStorage.removeItem("sentinel_sso_userId");
        });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await loginToCentralApi({ email, password });
      if (res.success && res.mfaRequired) {
        setMessage("Multi-Factor Authentication required. Redirecting to Sentinel Security Gateway...");
        setTimeout(() => {
          window.location.href = `http://localhost:3000/login?client_id=fintech_payroll&redirect_uri=${encodeURIComponent(window.location.origin)}&app_name=FinTech%20Payroll%20Portal`;
        }, 1200);
        return;
      }
      if (res.success && res.userId) {
        setUser(res);
        localStorage.setItem("sentinel_sso_userId", String(res.userId));
        setMessage("Login successful. SSO session initialized across all dummy apps.");
      } else {
        setMessage(res.message || "Login failed.");
      }
    } catch (err: any) {
      setMessage("Error connecting to Central IAM API.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sentinel_sso_userId");
    setUser(null);
    setMessage("Logged out from Dummy App 2.");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "24px", background: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <header style={{ borderBottom: "2px solid #db2777", paddingBottom: "14px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, color: "#db2777", fontSize: "24px", fontWeight: "700" }}>FinTech Payroll Portal (Demo App 2)</h1>
            <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>Running on Port 3002 | Central IAM Gateway SSO Client</p>
          </div>
          <a
            href="http://localhost:3000/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "#db2777",
              textDecoration: "none",
              backgroundColor: "#fdf2f8",
              border: "1px solid #fbcfe8",
              padding: "6px 12px",
              borderRadius: "6px"
            }}
          >
            Return to Sentinel Portal
          </a>
        </div>
      </header>

      {message && (
        <div style={{ padding: "12px", marginBottom: "16px", borderRadius: "6px", backgroundColor: "#fce7f3", color: "#9d174d", fontSize: "14px" }}>
          {message}
        </div>
      )}

      {user ? (
        <div>
          <h2 style={{ color: "#16a34a", fontSize: "18px" }}>Authenticated User Profile</h2>
          <p><strong>User ID:</strong> {user.userId}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.fullName || "N/A"}</p>
          <p><strong>Role:</strong> {user.role || "USER"}</p>
          {user.company && <p><strong>Organization:</strong> {user.company}</p>}
          <p><strong>MFA Enabled:</strong> {user.mfaEnabled ? "Yes" : "No"}</p>
          <button onClick={handleLogout} style={{ padding: "10px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            Logout (End SSO Session)
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "8px", backgroundColor: "#fdf2f8", border: "1px solid #fbcfe8", textAlign: "center" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#831843", margin: "0 0 6px 0" }}>Enterprise Single Sign-On</h2>
            <p style={{ fontSize: "13px", color: "#9d174d", margin: "0 0 16px 0" }}>
              Authenticate centrally via Sentinel Security with multi-factor authenticator verification.
            </p>
            <a
              href={`http://localhost:3000/login?client_id=fintech_payroll&redirect_uri=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "http://localhost:3002")}&app_name=FinTech%20Payroll%20Portal`}
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                backgroundColor: "#030712",
                color: "#54f4fc",
                border: "1px solid #54f4fc",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "13px",
                letterSpacing: "0.5px",
                boxSizing: "border-box"
              }}
            >
              Sign In with Sentinel Security
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "18px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
            <span style={{ margin: "0 10px", fontSize: "11px", fontWeight: "600", color: "#94a3b8" }}>OR DIRECT CREDENTIALS</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
          </div>

          <form onSubmit={handleLogin}>
            <h2 style={{ fontSize: "16px", marginBottom: "12px", color: "#334155" }}>Direct API Sign In</h2>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "10px", backgroundColor: "#db2777", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              {loading ? "Authenticating..." : "Login to FinTech Payroll Portal"}
            </button>
          </form>
        </div>
      )}

      <footer style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #e5e7eb", fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
        Sentinel Security IAM System | Coursework Demonstration
      </footer>
    </div>
  );
}
