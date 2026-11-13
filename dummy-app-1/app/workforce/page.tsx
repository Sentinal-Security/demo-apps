"use client";

import React, { useState } from "react";
import { useAuth } from "../../components/AuthProvider";

const DIRECTORY_EMPLOYEES = [
  { id: "EMP-101", name: "Alex Turner", role: "Staff Engineer", dept: "Platform Engineering", status: "Active" },
  { id: "EMP-102", name: "Elena Rostova", role: "UX Researcher", dept: "Product Design", status: "Leave Pending" },
  { id: "EMP-103", name: "Marcus Vance", role: "HR Operations Lead", dept: "People & Governance", status: "Active" },
  { id: "EMP-104", name: "Priya Nair", role: "Security Architect", dept: "Zero-Trust IAM", status: "Active" },
];

export default function WorkforcePage() {
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [lastClockTime, setLastClockTime] = useState<string | null>(null);
  const [hrLeaveApproved, setHrLeaveApproved] = useState(false);
  const [hrPromotionApproved, setHrPromotionApproved] = useState(false);
  const [hrAuditLog, setHrAuditLog] = useState("");
  const [search, setSearch] = useState("");

  if (!user) return null;

  const isPrivileged = user.role === "HR" || user.role === "ADMIN";
  const filteredEmployees = DIRECTORY_EMPLOYEES.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.dept.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800 }}>
          Workforce &amp; Attendance
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
          Role-based HR operations and corporate employee directory.
        </p>
      </div>

      {/* Role-Specific Feature Module */}
      <div className="card card-accent">
        {isPrivileged ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "17px", color: "var(--accent-dark)", fontWeight: 700 }}>
                HR Governance &amp; Staff Moderation Terminal
              </h2>
              <span className="badge badge-accent">ROLE: {user.role} (PRIVILEGED)</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
              Authorized HR moderation terminal for employee onboarding, department leave, and rank adjustments.
            </p>

            {hrAuditLog && (
              <div className="alert alert-success" style={{ marginBottom: "14px" }}>
                <span>[APPROVED] {hrAuditLog}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                className="card"
                style={{
                  padding: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>Alex Turner (Staff Engineer)</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Application: Promotion to Senior Staff Lead
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHrPromotionApproved(true);
                    setHrAuditLog(
                      `Promotion for Alex Turner approved by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()}`
                    );
                  }}
                  disabled={hrPromotionApproved}
                  className="btn btn-primary"
                >
                  {hrPromotionApproved ? "Approved" : "Approve Promotion"}
                </button>
              </div>

              <div
                className="card"
                style={{
                  padding: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>Elena Rostova (UX Researcher)</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Application: 3-Day Annual Leave Request
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHrLeaveApproved(true);
                    setHrAuditLog(
                      `Leave request for Elena Rostova approved by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()}`
                    );
                  }}
                  disabled={hrLeaveApproved}
                  className="btn"
                  style={{
                    backgroundColor: hrLeaveApproved ? "#94a3b8" : "#16a34a",
                    color: "#ffffff",
                  }}
                >
                  {hrLeaveApproved ? "Approved" : "Approve Leave"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>
                Employee Attendance &amp; Self-Service
              </h2>
              <span className="badge badge-neutral">ROLE: {user.role || "USER"} (STANDARD)</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
              Record your attendance timestamp. Manager moderation actions require the HR or ADMIN role.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  const now = new Date().toLocaleTimeString();
                  setClockedIn(!clockedIn);
                  setLastClockTime(now);
                }}
                className="btn"
                style={{
                  backgroundColor: clockedIn ? "#ea580c" : "#0284c7",
                  color: "#ffffff",
                }}
              >
                {clockedIn ? "Clock Out (Break)" : "Clock In (Shift Start)"}
              </button>
              <span style={{ fontSize: "13px", color: "#334155" }}>
                Status: <strong>{clockedIn ? "On Duty (Clocked In)" : "Off Duty"}</strong>
                {lastClockTime && ` | Last punch: ${lastClockTime}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Employee Directory Table */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "17px" }}>Corporate Employee Directory</h2>
          <input
            type="search"
            className="form-input"
            placeholder="Filter by name, department, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "280px" }}
          />
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Title</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 600 }}>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.dept}</td>
                  <td>
                    <span
                      className={`badge ${
                        emp.status === "Active" ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
