"use client";

import { useState, useEffect } from "react";
import { loginToCentralApi, validateSsoSession, getSentinelPortalUrl, AuthResponse } from "../lib/api";

export default function DummyApp3() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [portalUrl, setPortalUrl] = useState("https://web-kuvn.onrender.com");

  useEffect(() => {
    setPortalUrl(getSentinelPortalUrl());

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
        setMessage("Multi-Factor Authentication required. Redirecting to Sentinel Identity Gateway...");
        setTimeout(() => {
          window.location.href = `${portalUrl}/login?client_id=devops_incident&redirect_uri=${encodeURIComponent(window.location.origin)}&app_name=DevOps%20Incident%20Center`;
        }, 1200);
        return;
      }
      if (res.success && res.userId) {
        setUser(res);
        localStorage.setItem("sentinel_sso_userId", String(res.userId));
        setMessage("Login successful. SSO session established across enterprise applications.");
      } else {
        setMessage(res.message || "Login failed.");
      }
    } catch {
      setMessage("Error connecting to Central IAM API.");
    } finally {
      setLoading(false);
    }
  };

  // DevOps Incident role-based state
  const [incidentMitigated, setIncidentMitigated] = useState(false);
  const [maintenanceTriggered, setMaintenanceTriggered] = useState(false);
  const [incidentResolved, setIncidentResolved] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("sentinel_sso_userId");
    setUser(null);
    setMessage("Logged out from DevOps Incident Center.");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "24px", background: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "2px solid #059669", paddingBottom: "14px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, color: "#065f46", fontSize: "22px", fontWeight: "700" }}>Nexus Ops | Incident Command Center</h1>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>Site Reliability &amp; Infrastructure Monitoring</p>
          </div>
          <a
            href={`${portalUrl}/dashboard`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "#065f46",
              textDecoration: "none",
              backgroundColor: "#ecfdf5",
              border: "1px solid #a7f3d0",
              padding: "6px 12px",
              borderRadius: "6px"
            }}
          >
            Sentinel Identity Console
          </a>
        </div>
      </header>

      {message && (
        <div style={{ padding: "12px", marginBottom: "16px", borderRadius: "6px", backgroundColor: "#d1fae5", color: "#065f46", fontSize: "14px" }}>
          {message}
        </div>
      )}

      {user ? (
        <div>
          <h2 style={{ color: "#16a34a", fontSize: "18px", marginTop: 0 }}>Authenticated Engineer Profile</h2>
          <p><strong>Engineer ID:</strong> {user.userId}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.fullName || "N/A"}</p>
          <p><strong>Role:</strong> {user.role || "USER"}</p>
          {user.company && <p><strong>Cluster / Entity:</strong> {user.company}</p>}
          <p><strong>MFA Verified:</strong> {user.mfaEnabled ? "Yes" : "No"}</p>

          {/* Role-Specific Feature Module */}
          <div style={{ marginTop: "16px", marginBottom: "16px", padding: "14px", borderRadius: "8px", border: "1px solid #a7f3d0", backgroundColor: "#f0fdf4" }}>
            {user.role === "DEVOPS" || user.role === "ADMIN" ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#065f46", fontWeight: "700" }}>Production Escalation &amp; Failover Console</h3>
                  <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#d1fae5", color: "#065f46" }}>
                    ROLE: {user.role} (SRE CLEARANCE)
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px 0" }}>
                  Authorized incident remediation console. SRE engineers can execute failover drain commands and resolve outages.
                </p>

                {incidentResolved && (
                  <div style={{ padding: "8px 12px", marginBottom: "12px", borderRadius: "4px", backgroundColor: "#dcfce7", color: "#166534", fontSize: "12px", fontWeight: "600" }}>
                    [RESOLVED] {incidentResolved}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "13px", color: "#dc2626" }}>INC-8891: Database Connection Pool Exhaustion</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Cluster: ap-southeast-2 (PostgreSQL Session Gateway)</div>
                    </div>
                    <button
                      onClick={() => {
                        setIncidentMitigated(true);
                        setIncidentResolved(`INC-8891 mitigated: Pool connections recycled by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()}`);
                      }}
                      disabled={incidentMitigated}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: incidentMitigated ? "#94a3b8" : "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: incidentMitigated ? "default" : "pointer"
                      }}
                    >
                      {incidentMitigated ? "Mitigated" : "Drain & Recycle Pool"}
                    </button>
                  </div>

                  <div style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "13px", color: "#0f172a" }}>Kubernetes Ingress Pod Autoscaling (HPA)</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Current: 14 Replicas (Load 82%)</div>
                    </div>
                    <button
                      onClick={() => {
                        setMaintenanceTriggered(true);
                        setIncidentResolved(`HPA scaled up to 24 pods by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()}`);
                      }}
                      disabled={maintenanceTriggered}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: maintenanceTriggered ? "#94a3b8" : "#059669",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: maintenanceTriggered ? "default" : "pointer"
                      }}
                    >
                      {maintenanceTriggered ? "Scaled Up" : "Scale HPA (24 Pods)"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>System Health &amp; Incident Status Board</h3>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#e2e8f0", color: "#475569" }}>
                    ROLE: {user.role || "USER"} (OBSERVER)
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 10px 0" }}>
                  Read-only infrastructure uptime telemetry. Production mitigation actions require DEVOPS or ADMIN role clearance.
                </p>
                <div style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Central API Gateway Latency</div>
                  <span style={{ fontSize: "12px", color: "#059669", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#d1fae5" }}>38ms (Healthy)</span>
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
          <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "8px", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", textAlign: "center" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#065f46", margin: "0 0 6px 0" }}>Enterprise Single Sign-On</h2>
            <p style={{ fontSize: "13px", color: "#047857", margin: "0 0 16px 0" }}>
              Authenticate centrally via Sentinel Security with multi-factor verification.
            </p>
            <a
              href={`${portalUrl}/login?client_id=devops_incident&redirect_uri=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}&app_name=DevOps%20Incident%20Center`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#090d16",
                color: "#ffffff",
                border: "1px solid #0891b2",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "13px",
                letterSpacing: "0.2px",
                boxSizing: "border-box"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Sign in with Sentinel Enterprise SSO</span>
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "18px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
            <span style={{ margin: "0 10px", fontSize: "11px", fontWeight: "600", color: "#94a3b8" }}>OR DIRECT CREDENTIALS</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
          </div>

          <form onSubmit={handleLogin}>
            <h2 style={{ fontSize: "15px", marginBottom: "12px", color: "#334155" }}>Direct API Sign In</h2>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", fontWeight: "500", color: "#374151" }}>Corporate Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #d1d5db", boxSizing: "border-box", fontSize: "14px" }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", fontWeight: "500", color: "#374151" }}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #d1d5db", boxSizing: "border-box", fontSize: "14px" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "11px", backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
            >
              {loading ? "Authenticating..." : "Login to DevOps Incident Command"}
            </button>
          </form>
        </div>
      )}

      <footer style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #e5e7eb", fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
        Secured by Sentinel Zero-Trust Identity Federation
      </footer>
    </div>
  );
}
