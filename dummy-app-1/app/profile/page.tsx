"use client";

import React from "react";
import { useAuth } from "../../components/AuthProvider";

export default function ProfilePage() {
  const { user, ssoToken, logout } = useAuth();
  if (!user) return null;

  const maskedToken = ssoToken
    ? `${ssoToken.slice(0, 10)}...${ssoToken.slice(-4)}`
    : "Session ID Verified";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800 }}>
          Employee Profile &amp; SSO Session
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
          Identity claims validated via Sentinel Zero-Trust Identity Federation.
        </p>
      </div>

      <div className="two-col-grid">
        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 14px", color: "#16a34a" }}>
            Authenticated Employee Profile
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <div>
              <strong>Employee ID:</strong> {user.userId}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Full Name:</strong> {user.fullName || "N/A"}
            </div>
            <div>
              <strong>Role:</strong> <span className="badge badge-accent">{user.role || "USER"}</span>
            </div>
            {user.company && (
              <div>
                <strong>Organization:</strong> {user.company}
              </div>
            )}
            <div>
              <strong>MFA Verified:</strong>{" "}
              <span className={`badge ${user.mfaEnabled ? "badge-success" : "badge-warning"}`}>
                {user.mfaEnabled ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 14px" }}>SSO Session Controls</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", marginBottom: "20px" }}>
            <div>
              <strong>Identity Provider:</strong> Sentinel Security Gateway
            </div>
            <div>
              <strong>Active Token:</strong>{" "}
              <code style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>
                {maskedToken}
              </code>
            </div>
            <div>
              <strong>Client Application:</strong> Acme Corp | Global HR Portal
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" onClick={logout} className="btn btn-danger">
              Logout (End SSO Session)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
