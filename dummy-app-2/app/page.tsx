"use client";

import { useState, useEffect } from "react";
import { loginToCentralApi, validateSsoSession, getSentinelPortalUrl, AuthResponse } from "../lib/api";

export default function DummyApp2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [portalUrl, setPortalUrl] = useState("https://web-beta-orcin-33.vercel.app");

  useEffect(() => {
    setPortalUrl(getSentinelPortalUrl());

    // Check URL query parameters for SSO handoff first
    const urlParams = new URLSearchParams(window.location.search);
    const queryUserId = urlParams.get("ssoUserId") || urlParams.get("userId");
    const queryToken = urlParams.get("ssoToken");

    const targetUserId = queryUserId || localStorage.getItem("sentinel_sso_userId");
    const targetToken = queryToken || localStorage.getItem("sentinel_sso_token") || undefined;

    if (targetUserId) {
      setLoading(true);
      validateSsoSession(Number(targetUserId), targetToken)
        .then((res) => {
          setLoading(false);
          if (res.success) {
            setUser(res);
            localStorage.setItem("sentinel_sso_userId", String(targetUserId));
            if (targetToken) {
              localStorage.setItem("sentinel_sso_token", targetToken);
            }
            setMessage("Single Sign-On (SSO) Session Active.");
            if (queryUserId || queryToken) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else {
            localStorage.removeItem("sentinel_sso_userId");
            localStorage.removeItem("sentinel_sso_token");
          }
        })
        .catch(() => {
          setLoading(false);
          localStorage.removeItem("sentinel_sso_userId");
          localStorage.removeItem("sentinel_sso_token");
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
          window.location.href = `${portalUrl}/login?client_id=fintech_payroll&redirect_uri=${encodeURIComponent(window.location.origin)}&app_name=FinTech%20Payroll`;
        }, 1200);
        return;
      }
      if (res.success && res.userId) {
        setUser(res);
        localStorage.setItem("sentinel_sso_userId", String(res.userId));
        if (res.ssoToken) {
          localStorage.setItem("sentinel_sso_token", res.ssoToken);
        }
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

  // FinTech Payroll role-based state
  const [payrollDisbursed, setPayrollDisbursed] = useState(false);
  const [disbursementTx, setDisbursementTx] = useState<string | null>(null);
  const [paystubDownloaded, setPaystubDownloaded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("sentinel_sso_userId");
    localStorage.removeItem("sentinel_sso_token");
    setUser(null);
    setMessage("Logged out from FinTech Payroll Portal.");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "24px", background: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "2px solid #db2777", paddingBottom: "14px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, color: "#be185d", fontSize: "22px", fontWeight: "700" }}>FinTech Global | Payroll &amp; Treasury</h1>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>Corporate Compensation &amp; Disbursement Terminal</p>
          </div>
          <a
            href={user ? `${portalUrl}/dashboard` : portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#be185d",
              textDecoration: "none",
              backgroundColor: "#fdf2f8",
              border: "1px solid #fbcfe8",
              padding: "6px 12px",
              borderRadius: "6px"
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>{user ? "Manage IAM Profile" : "Sentinel IAM Portal"}</span>
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
          <h2 style={{ color: "#16a34a", fontSize: "18px", marginTop: 0 }}>Authenticated User Profile</h2>
          <p><strong>Account ID:</strong> {user.userId}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.fullName || "N/A"}</p>
          <p><strong>Role:</strong> {user.role || "USER"}</p>
          {user.company && <p><strong>Entity:</strong> {user.company}</p>}
          <p><strong>MFA Verified:</strong> {user.mfaEnabled ? "Yes" : "No"}</p>

          {/* Role-Specific Feature Module */}
          <div style={{ marginTop: "16px", marginBottom: "16px", padding: "14px", borderRadius: "8px", border: "1px solid #fbcfe8", backgroundColor: "#fff5f8" }}>
            {user.role === "FINANCE" || user.role === "ADMIN" ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#9d174d", fontWeight: "700" }}>Treasury Ledger &amp; Disbursement Terminal</h3>
                  <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#fce7f3", color: "#9d174d" }}>
                    ROLE: {user.role} (FINANCE CLEARANCE)
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px 0" }}>
                  Authorized finance terminal. Signatories can initiate automated bi-weekly payroll ACH batches.
                </p>

                {disbursementTx && (
                  <div style={{ padding: "8px 12px", marginBottom: "12px", borderRadius: "4px", backgroundColor: "#dcfce7", color: "#166534", fontSize: "12px", fontWeight: "600" }}>
                    [EXECUTED] {disbursementTx}
                  </div>
                )}

                <div style={{ padding: "12px", borderRadius: "6px", backgroundColor: "#ffffff", border: "1px solid #f472b6", marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Q4 Mid-Cycle Batch (142 Employees)</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>$486,250.00 USD</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>Origin: Silicon Valley National Bank Escrow (Acct ending in 4102)</div>
                  <button
                    onClick={() => {
                      setPayrollDisbursed(true);
                      setDisbursementTx(`ACH Batch #TX-90412 executed by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()} (Confirmed)`);
                    }}
                    disabled={payrollDisbursed}
                    style={{
                      width: "100%",
                      padding: "8px 14px",
                      backgroundColor: payrollDisbursed ? "#94a3b8" : "#db2777",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: payrollDisbursed ? "default" : "pointer"
                    }}
                  >
                    {payrollDisbursed ? "Disbursement Completed" : "Authorize & Disburse $486,250.00 Batch"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>Personal Earnings &amp; Tax Documents</h3>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#e2e8f0", color: "#475569" }}>
                    ROLE: {user.role || "USER"} (STANDARD)
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 10px 0" }}>
                  Access confidential pay statements and tax withholdings. Treasury actions require the FINANCE or ADMIN role.
                </p>
                <div style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Latest Pay Period (Oct 01 - 15)</div>
                    <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600" }}>Deposited: Direct Deposit Checking (Verified)</div>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>$3,842.10</span>
                </div>
                <button
                  onClick={() => setPaystubDownloaded(true)}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: paystubDownloaded ? "#16a34a" : "#475569",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {paystubDownloaded ? "Paystub Generated" : "Download Verified Paystub (CSV)"}
                </button>
              </div>
            )}
          </div>

          <button onClick={handleLogout} style={{ padding: "10px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            Logout (End SSO Session)
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "8px", backgroundColor: "#fdf2f8", border: "1px solid #fbcfe8", textAlign: "center" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#831843", margin: "0 0 6px 0" }}>Enterprise Single Sign-On (SSO)</h2>
            <p style={{ fontSize: "13px", color: "#9d174d", margin: "0 0 16px 0" }}>
              Sign in with your organization email via Sentinel Security with multi-factor verification.
            </p>
            <a
              href={`${portalUrl}/login?client_id=fintech_payroll&redirect_uri=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}&app_name=FinTech%20Payroll`}
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
              <span>Sign in with Enterprise SSO</span>
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
              style={{ width: "100%", padding: "11px", backgroundColor: "#db2777", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
            >
              {loading ? "Authenticating..." : "Login to FinTech Payroll Portal"}
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
