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
          {user.authMode === "local" ? "Engineer Profile & Account Session" : "Engineer Profile & SSO Session"}
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
          {user.authMode === "local"
            ? "Account verified and managed directly on Nexus Ops."
            : "Identity claims validated via Sentinel Zero-Trust Identity Federation."}
        </p>
      </div>

      <div className="two-col-grid">
        <div className="card">
          <h2 style={{ fontSize: "17px", margin: "0 0 14px", color: "#16a34a" }}>
            Authenticated Engineer Profile
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <div>
              <strong>Engineer ID:</strong> {user.userId}
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
                <strong>Cluster / Entity:</strong> {user.company}
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
          <h2 style={{ fontSize: "17px", margin: "0 0 14px" }}>
            {user.authMode === "local" ? "Session Controls" : "SSO Session Controls"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", marginBottom: "20px" }}>
            <div>
              <strong>{user.authMode === "local" ? "Account Type:" : "Identity Provider:"}</strong>{" "}
              {user.authMode === "local" ? "Direct Application Account" : "Sentinel Security Gateway"}
            </div>
            <div>
              <strong>Active Token:</strong>{" "}
              <code style={{ backgroundColor: "#ecfdf5", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>
                {maskedToken}
              </code>
            </div>
            <div>
              <strong>Client Application:</strong> Nexus Ops | Incident Command Center
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" onClick={logout} className="btn btn-danger">
              {user.authMode === "local" ? "Logout" : "Logout (End SSO Session)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
