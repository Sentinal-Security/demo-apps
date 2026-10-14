"use client";

import { useState, useEffect } from "react";
import { loginToCentralApi, validateSsoSession, AuthResponse } from "../lib/api";

export default function DummyApp1() {
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
          window.location.href = `http://localhost:3000/login?client_id=acme_hr&redirect_uri=${encodeURIComponent(window.location.origin)}&app_name=Acme%20HR%20Portal`;
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

  // Acme HR role-based state
  const [clockedIn, setClockedIn] = useState(false);
  const [lastClockTime, setLastClockTime] = useState<string | null>(null);
  const [hrLeaveApproved, setHrLeaveApproved] = useState(false);
  const [hrPromotionApproved, setHrPromotionApproved] = useState(false);
  const [hrAuditLog, setHrAuditLog] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("sentinel_sso_userId");
    setUser(null);
    setMessage("Logged out from Dummy App 1.");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "24px", background: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <header style={{ borderBottom: "2px solid #2563eb", paddingBottom: "14px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, color: "#2563eb", fontSize: "24px", fontWeight: "700" }}>Acme HR Portal (Demo App 1)</h1>
            <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>Running on Port 3001 | Central IAM Gateway SSO Client</p>
          </div>
          <a
            href="http://localhost:3000/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "#2563eb",
              textDecoration: "none",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "6px 12px",
              borderRadius: "6px"
            }}
          >
            Return to Sentinel Portal
          </a>
        </div>
      </header>

      {message && (
        <div style={{ padding: "12px", marginBottom: "16px", borderRadius: "6px", backgroundColor: "#e0f2fe", color: "#0369a1", fontSize: "14px" }}>
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

          {/* Role-Specific Feature Module */}
          <div style={{ marginTop: "16px", marginBottom: "16px", padding: "14px", borderRadius: "8px", border: "1px solid #bfdbfe", backgroundColor: "#f8fafc" }}>
            {user.role === "HR" || user.role === "ADMIN" ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#1e40af", fontWeight: "700" }}>HR Governance & Staff Moderation Terminal</h3>
                  <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#dbeafe", color: "#1e40af" }}>
                    ROLE: {user.role} (PRIVILEGED)
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px 0" }}>
                  As an authorized HR Officer / Moderator, you hold discretionary authority over employee onboarding, department leave, and rank adjustments.
                </p>

                {hrAuditLog && (
                  <div style={{ padding: "8px 12px", marginBottom: "12px", borderRadius: "4px", backgroundColor: "#dcfce7", color: "#166534", fontSize: "12px", fontWeight: "600" }}>
                    ✓ {hrAuditLog}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "13px", color: "#0f172a" }}>Alex Turner (Staff Engineer)</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Application: Promotion to Senior Staff Lead</div>
                    </div>
                    <button
                      onClick={() => {
                        setHrPromotionApproved(true);
                        setHrAuditLog(`Promotion for Alex Turner approved by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()}`);
                      }}
                      disabled={hrPromotionApproved}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: hrPromotionApproved ? "#94a3b8" : "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: hrPromotionApproved ? "default" : "pointer"
                      }}
                    >
                      {hrPromotionApproved ? "Approved ✓" : "Approve Promotion"}
                    </button>
                  </div>

                  <div style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "13px", color: "#0f172a" }}>Elena Rostova (UX Researcher)</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Application: 3-Day Annual Leave Request (Oct 16 - 19)</div>
                    </div>
                    <button
                      onClick={() => {
                        setHrLeaveApproved(true);
                        setHrAuditLog(`Leave request for Elena Rostova approved by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()}`);
                      }}
                      disabled={hrLeaveApproved}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: hrLeaveApproved ? "#94a3b8" : "#16a34a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: hrLeaveApproved ? "default" : "pointer"
                      }}
                    >
                      {hrLeaveApproved ? "Approved ✓" : "Approve Leave"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>Employee Attendance & Self-Service</h3>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#e2e8f0", color: "#475569" }}>
                    ROLE: {user.role || "USER"} (STANDARD)
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 10px 0" }}>
                  Record your attendance punch timestamp. Manager moderation actions require the HR or ADMIN role.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    onClick={() => {
                      const now = new Date().toLocaleTimeString();
                      setClockedIn(!clockedIn);
                      setLastClockTime(now);
                    }}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: clockedIn ? "#ea580c" : "#0284c7",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    {clockedIn ? "Clock Out (Take Break)" : "Clock In (Start Shift)"}
                  </button>
                  <span style={{ fontSize: "12px", color: "#334155" }}>
                    Status: <strong>{clockedIn ? "On Duty (Clocked In)" : "Off Duty"}</strong>
                    {lastClockTime && ` | Last punch: ${lastClockTime}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogout} style={{ padding: "10px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            Logout (End SSO Session)
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" }}>Enterprise Single Sign-On</h2>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
              Authenticate centrally via Sentinel Security with multi-factor authenticator verification.
            </p>
            <a
              href={`http://localhost:3000/login?client_id=acme_hr&redirect_uri=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "http://localhost:3001")}&app_name=Acme%20HR%20Portal`}
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
              style={{ width: "100%", padding: "10px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              {loading ? "Authenticating..." : "Login to Acme HR Portal"}
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
