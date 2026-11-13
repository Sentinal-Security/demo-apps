"use client";

import React, { useState } from "react";
import { useAuth } from "../../components/AuthProvider";

const PAYROLL_LEDGER = [
  { id: "TX-90411", period: "Sep 16 - Sep 30", scope: "Bi-Weekly Cycle (140 Staff)", amount: "$479,800.00", status: "Settled" },
  { id: "TX-90388", period: "Sep 01 - Sep 15", scope: "Bi-Weekly Cycle (139 Staff)", amount: "$475,120.00", status: "Settled" },
  { id: "TX-90354", period: "Aug 16 - Aug 31", scope: "Bi-Weekly Cycle (138 Staff)", amount: "$471,900.00", status: "Settled" },
];

export default function PayrollPage() {
  const { user } = useAuth();
  const [payrollDisbursed, setPayrollDisbursed] = useState(false);
  const [disbursementTx, setDisbursementTx] = useState<string | null>(null);
  const [paystubDownloaded, setPaystubDownloaded] = useState(false);

  if (!user) return null;

  const isFinance = user.role === "FINANCE" || user.role === "ADMIN";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800 }}>
          Payroll &amp; Treasury
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
          Role-based financial disbursements, pay statements, and escrow settlement history.
        </p>
      </div>

      {/* Role-Specific Feature Module */}
      <div className="card card-accent">
        {isFinance ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "17px", color: "var(--accent-dark)", fontWeight: 700 }}>
                Treasury Ledger &amp; Disbursement Terminal
              </h2>
              <span className="badge badge-accent">ROLE: {user.role} (FINANCE CLEARANCE)</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
              Authorized finance terminal. Signatories can initiate automated bi-weekly payroll ACH batches.
            </p>

            {disbursementTx && (
              <div className="alert alert-success" style={{ marginBottom: "14px" }}>
                <span>[EXECUTED] {disbursementTx}</span>
              </div>
            )}

            <div
              className="card"
              style={{
                padding: "16px",
                border: "1px solid #f472b6",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700 }}>
                  Q4 Mid-Cycle Batch (142 Employees)
                </span>
                <span style={{ fontSize: "15px", fontWeight: 800 }}>$486,250.00 USD</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
                Origin: Silicon Valley National Bank Escrow (Acct ending in 4102)
              </div>
              <button
                onClick={() => {
                  setPayrollDisbursed(true);
                  setDisbursementTx(
                    `ACH Batch #TX-90412 executed by ${user.fullName || user.email} at ${new Date().toLocaleTimeString()} (Confirmed)`
                  );
                }}
                disabled={payrollDisbursed}
                className="btn btn-primary"
                style={{ width: "100%", padding: "10px 14px" }}
              >
                {payrollDisbursed ? "Disbursement Completed" : "Authorize & Disburse $486,250.00 Batch"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>
                Personal Earnings &amp; Tax Documents
              </h2>
              <span className="badge badge-neutral">ROLE: {user.role || "USER"} (STANDARD)</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
              Access confidential pay statements and tax withholdings. Treasury actions require the FINANCE or ADMIN role.
            </p>
            <div
              className="card"
              style={{
                padding: "14px",
                marginBottom: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>Latest Pay Period (Oct 01 - 15)</div>
                <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>
                  Deposited: Direct Deposit Checking (Verified)
                </div>
              </div>
              <span style={{ fontSize: "16px", fontWeight: 800 }}>$3,842.10</span>
            </div>
            <button
              onClick={() => setPaystubDownloaded(true)}
              className="btn"
              style={{
                backgroundColor: paystubDownloaded ? "#16a34a" : "#475569",
                color: "#ffffff",
              }}
            >
              {paystubDownloaded ? "Paystub Generated" : "Download Verified Paystub (CSV)"}
            </button>
          </div>
        )}
      </div>

      {/* Ledger Table */}
      <div className="card">
        <h2 style={{ margin: "0 0 14px", fontSize: "17px" }}>Recent Settlement Ledger</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Pay Period</th>
                <th>Description</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYROLL_LEDGER.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>{row.id}</td>
                  <td>{row.period}</td>
                  <td>{row.scope}</td>
                  <td style={{ fontWeight: 700 }}>{row.amount}</td>
                  <td>
                    <span className="badge badge-success">{row.status}</span>
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
