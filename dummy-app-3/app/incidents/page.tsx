"use client";

import React, { useState } from "react";
import { useAuth } from "../../components/AuthProvider";

const CLUSTER_SERVICES = [
  { service: "Central API Gateway", region: "ap-southeast-2", latency: "38ms", uptime: "99.99%", status: "Healthy" },
  { service: "PostgreSQL Session Gateway", region: "ap-southeast-2", latency: "64ms", uptime: "99.92%", status: "Degraded" },
  { service: "Kubernetes Ingress HPA", region: "us-west-2", latency: "29ms", uptime: "99.98%", status: "Healthy" },
  { service: "MFA Push Relay Worker", region: "eu-central-1", latency: "41ms", uptime: "100.0%", status: "Healthy" },
];

export default function IncidentsPage() {
  const { user } = useAuth();
  const [incidentMitigated, setIncidentMitigated] = useState(false);
  const [maintenanceTriggered, setMaintenanceTriggered] = useState(false);
  const [incidentResolved, setIncidentResolved] = useState<string | null>(null);

  if (!user) return null;

  const isDevOps = user.role === "DEVOPS" || user.role === "ADMIN";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800 }}>
          Incidents &amp; Telemetry
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
          Role-based production remediation and cluster uptime monitoring.
        </p>
      </div>

      {/* Role-Specific Feature Module */}
      <div className="card card-accent">
        {isDevOps ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "17px", color: "var(--accent-dark)", fontWeight: 700 }}>
                Production Escalation &amp; Failover Console
              </h2>
              <span className="badge badge-accent">ROLE: {user.role} (SRE CLEARANCE)</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
              Authorized incident remediation console. SRE engineers can execute failover drain commands and resolve outages.
            </p>

            {incidentResolved && (
              <div className="alert alert-success" style={{ marginBottom: "14px" }}>
                <span>[RESOLVED] {incidentResolved}</span>
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
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#dc2626" }}>
                    INC-8891: Database Connection Pool Exhaustion
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Cluster: ap-southeast-2 (PostgreSQL Session Gateway)
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIncidentMitigated(true);
                    setIncidentResolved(
                      `INC-8891 mitigated: Pool connections recycled by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()}`
                    );
                  }}
                  disabled={incidentMitigated}
                  className="btn btn-danger"
                >
                  {incidentMitigated ? "Mitigated" : "Drain & Recycle Pool"}
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
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>
                    Kubernetes Ingress Pod Autoscaling (HPA)
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Current: 14 Replicas (Load 82%)
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMaintenanceTriggered(true);
                    setIncidentResolved(
                      `HPA scaled up to 24 pods by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()}`
                    );
                  }}
                  disabled={maintenanceTriggered}
                  className="btn btn-primary"
                >
                  {maintenanceTriggered ? "Scaled Up" : "Scale HPA (24 Pods)"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>
                System Health &amp; Incident Status Board
              </h2>
              <span className="badge badge-neutral">ROLE: {user.role || "USER"} (OBSERVER)</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
              Read-only infrastructure uptime telemetry. Production mitigation actions require DEVOPS or ADMIN role clearance.
            </p>
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
              <div style={{ fontSize: "14px", fontWeight: 700 }}>Central API Gateway Latency</div>
              <span className="badge badge-success">38ms (Healthy)</span>
            </div>
          </div>
        )}
      </div>

      {/* Telemetry Table */}
      <div className="card">
        <h2 style={{ margin: "0 0 14px", fontSize: "17px" }}>Service Telemetry Matrix</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Region</th>
                <th>Latency</th>
                <th>30d Uptime</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CLUSTER_SERVICES.map((svc) => (
                <tr key={svc.service}>
                  <td style={{ fontWeight: 600 }}>{svc.service}</td>
                  <td>{svc.region}</td>
                  <td>{svc.latency}</td>
                  <td>{svc.uptime}</td>
                  <td>
                    <span
                      className={`badge ${
                        svc.status === "Healthy" || (svc.service === "PostgreSQL Session Gateway" && incidentMitigated)
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {svc.service === "PostgreSQL Session Gateway" && incidentMitigated ? "Healthy" : svc.status}
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
