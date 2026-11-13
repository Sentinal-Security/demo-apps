"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { SsoVerifyingScreen } from "../../components/SsoVerifyingScreen";
import { APP_CONFIG } from "../../lib/appConfig";
import {
  registerAppAccount,
  resendAppVerificationCode,
  verifyAppRegistration,
} from "../../lib/api";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <SsoVerifyingScreen
          title="Loading Registration..."
          subtitle={`Preparing ${APP_CONFIG.brandPortal}...`}
        />
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authStatus, buildSsoLoginUrl, setNotice } = useAuth();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [authStatus, router]);

  useEffect(() => {
    const verifyParam = searchParams.get("verify");
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
    if (verifyParam === "1" && emailParam) {
      setStep("verify");
      setInfoMsg(`Enter the 6-digit verification code sent to ${emailParam} to activate your account.`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (authStatus === "authenticated") {
    return (
      <SsoVerifyingScreen
        title="Opening Dashboard..."
        subtitle={`Redirecting to your ${APP_CONFIG.brandName} workspace...`}
      />
    );
  }

  const appDisplayName = `${APP_CONFIG.brandName} | ${APP_CONFIG.brandPortal}`;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please check and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerAppAccount({
        appId: APP_CONFIG.appId,
        appName: appDisplayName,
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (res.success && res.requiresVerification) {
        setStep("verify");
        setCode("");
        setCooldown(30);
        setInfoMsg(
          res.message ||
            `We sent a 6-digit verification code to ${email.trim()}. Enter it below to complete registration.`
        );
      } else {
        setErrorMsg(res.message || "Unable to create your account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await verifyAppRegistration({
        appId: APP_CONFIG.appId,
        email: email.trim(),
        code: cleanCode,
      });

      if (res.success && res.verified) {
        setNotice({
          type: "success",
          text:
            res.message ||
            "Your account is verified! Sign in below with your email and password to open your dashboard.",
        });
        router.replace(`/?verified=1&email=${encodeURIComponent(email.trim())}#signin`);
      } else {
        setErrorMsg(res.message || "Invalid verification code. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || resending || !email.trim()) return;
    setErrorMsg(null);
    setResending(true);
    try {
      const res = await resendAppVerificationCode({
        appId: APP_CONFIG.appId,
        appName: appDisplayName,
        email: email.trim(),
      });
      if (res.success) {
        setCooldown(30);
        setInfoMsg(res.message || `A new 6-digit code was sent to ${email.trim()}.`);
      } else {
        setErrorMsg(res.message || "Could not resend the verification code.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "12px auto", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="card">
        <div style={{ marginBottom: "18px" }}>
          <span className="badge badge-accent" style={{ marginBottom: "10px" }}>
            {step === "form" ? "Step 1 of 2 · Create Account" : "Step 2 of 2 · Verify Email"}
          </span>
          <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 6px", color: "#0f172a" }}>
            {step === "form" ? `Create Your ${APP_CONFIG.brandName} Account` : "Verify Your Email Address"}
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {step === "form"
              ? `Sign up directly to use ${APP_CONFIG.brandPortal} independently with your own email and password.`
              : `We sent a 6-digit verification code to ${email}. Enter it below before signing in.`}
          </p>
        </div>

        {errorMsg && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: "16px" }}>
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="alert alert-info" role="status" style={{ marginBottom: "16px" }}>
            <span>{infoMsg}</span>
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="form-label" htmlFor="reg-fullname">
                Full Name:
              </label>
              <input
                id="reg-fullname"
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reg-email">
                Email Address:
              </label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reg-password">
                Password:
              </label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                placeholder="At least 8 characters"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="reg-confirm">
                Confirm Password:
              </label>
              <input
                id="reg-confirm"
                type="password"
                className="form-input"
                placeholder="Re-enter your password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: "100%", padding: "11px", marginTop: "4px" }}
            >
              {submitting ? "Sending Verification Code..." : "Continue & Verify Email"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label className="form-label" htmlFor="verify-code">
                6-Digit Verification Code:
              </label>
              <input
                id="verify-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="form-input"
                style={{
                  textAlign: "center",
                  fontSize: "22px",
                  letterSpacing: "0.35em",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || code.length !== 6}
              className="btn btn-primary"
              style={{ width: "100%", padding: "11px" }}
            >
              {submitting ? "Verifying Account..." : "Verify Account & Proceed to Sign In"}
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={cooldown > 0 || resending}
                className="btn btn-outline"
                style={{ fontSize: "12px", padding: "7px 12px" }}
              >
                {resending
                  ? "Sending..."
                  : cooldown > 0
                  ? `Resend Code (${cooldown}s)`
                  : "Resend Code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setErrorMsg(null);
                  setInfoMsg(null);
                }}
                className="btn btn-outline"
                style={{ fontSize: "12px", padding: "7px 12px" }}
              >
                Edit Registration Details
              </button>
            </div>
          </form>
        )}

        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontSize: "13px",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          <div>
            Already have an account?{" "}
            <Link href="/#signin" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
              Sign in here
            </Link>
          </div>
          <div>
            Organization employee?{" "}
            <a href={buildSsoLoginUrl()} style={{ color: "var(--text-muted)", fontWeight: 600, textDecoration: "underline" }}>
              Sign in with Sentinel Security
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
