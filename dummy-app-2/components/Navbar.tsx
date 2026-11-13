"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "../lib/appConfig";
import { useAuth } from "./AuthProvider";

export function Navbar() {
  const pathname = usePathname();
  const { authStatus, user, buildSsoLoginUrl, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isAuthenticated = authStatus === "authenticated" && Boolean(user);
  const brandHref = isAuthenticated ? "/dashboard" : "/";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href={brandHref} className="navbar-brand">
          <div className="brand-badge">{APP_CONFIG.brandInitials}</div>
          <div>
            <div className="brand-title">
              {APP_CONFIG.brandName} | {APP_CONFIG.brandPortal}
            </div>
            <div className="brand-sub">{APP_CONFIG.tagline}</div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links" aria-label="Primary Navigation">
          {isAuthenticated ? (
            APP_CONFIG.navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${active ? "nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })
          ) : (
            <>
              <Link href="/" className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}>
                Home
              </Link>
              <a href="/#capabilities" className="nav-link">
                Capabilities
              </a>
              <a href="/#signin" className="nav-link">
                Sign In
              </a>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="nav-desktop-only" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                href="/profile"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 10px",
                  borderRadius: "999px",
                  backgroundColor: "#fdf2f8",
                  border: "1px solid var(--accent-border)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <span>{user?.fullName || user?.email}</span>
                <span className="badge badge-accent">{user?.role || "USER"}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="btn btn-outline"
                style={{ padding: "7px 11px", fontSize: "12px", color: "#dc2626" }}
              >
                Logout
              </button>
            </div>
          ) : (
            authStatus === "unauthenticated" && (
              <a
                href={buildSsoLoginUrl()}
                className="btn btn-primary nav-desktop-only"
                style={{ padding: "7px 13px", fontSize: "12px" }}
              >
                Sign in with SSO
              </a>
            )
          )}

          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? "mobile-drawer-open" : ""}`}>
        {isAuthenticated ? (
          <>
            {APP_CONFIG.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </>
        ) : (
          <>
            <Link href="/" className="nav-link">
              Home
            </Link>
            <a href="/#capabilities" className="nav-link" onClick={() => setMobileOpen(false)}>
              Capabilities
            </a>
            <a href="/#signin" className="nav-link" onClick={() => setMobileOpen(false)}>
              Sign In
            </a>
          </>
        )}

        <div style={{ display: "flex", gap: "8px", paddingTop: "8px", flexWrap: "wrap" }}>
          {isAuthenticated ? (
            <button type="button" onClick={logout} className="btn btn-danger" style={{ flex: 1 }}>
              Logout
            </button>
          ) : (
            <a href={buildSsoLoginUrl()} className="btn btn-primary" style={{ flex: 1 }}>
              Sign in with SSO
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
