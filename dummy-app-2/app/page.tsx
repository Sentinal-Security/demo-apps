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
    // Check shared local storage SSO session
    const savedUserId = localStorage.getItem("sentinel_sso_userId");
    if (savedUserId) {
      validateSsoSession(Number(savedUserId)).then((res) => {
        if (res.success) {
          setUser(res);
          setMessage("Single Sign-On (SSO) Session Active.");
        } else {
          localStorage.removeItem("sentinel_sso_userId");
        }
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await loginToCentralApi({ email, password });
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
      <header style={{ borderBottom: "2px solid #db2777", paddingBottom: "12px", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, color: "#db2777", fontSize: "24px" }}>💳 FinTech Payroll Portal (Dummy App 2)</h1>
        <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>Running on Port 3002 | Central IAM Gateway SSO Client</p>
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
          <p><strong>MFA Enabled:</strong> {user.mfaEnabled ? "Yes" : "No"}</p>
          <button onClick={handleLogout} style={{ padding: "10px 16px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            Logout (End SSO Session)
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Sign In via Central IAM Gateway</h2>
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
            {loading ? "Authenticating..." : "Login to Dummy App 2"}
          </button>
        </form>
      )}

      <footer style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #e5e7eb", fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
        Sentinel Security IAM System | Coursework Demonstration
      </footer>
    </div>
  );
}
