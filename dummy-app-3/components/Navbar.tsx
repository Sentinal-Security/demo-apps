"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEMO_APPS, getAppSwitchHref } from "../lib/api";
import { APP_CONFIG } from "../lib/appConfig";
import { useAuth } from "./AuthProvider";

export function Navbar() {
  const pathname = usePathname();
  const { authStatus, user, ssoToken, portalUrl, buildSsoLoginUrl, logout } = useAuth();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSwitcherOpen(false);
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
          <div className="switcher-wrap nav-desktop-only" ref={switcherRef}>
            <button
              type="button"
              className="switcher-btn"
              onClick={() => setSwitcherOpen((prev) => !prev)}
              aria-expanded={switcherOpen}
            >
              <span>Apps</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {switcherOpen && (
              <div className="switcher-menu">
                <div className="switcher-header">Sentinel Demo Ecosystem</div>
                {DEMO_APPS.map((app) => {
                  const isCurrent = app.id === APP_CONFIG.appId;
                  const href = isCurrent
                    ? brandHref
                    : getAppSwitchHref(app, user?.userId, user?.email, ssoToken);
                  return (
                    <a
                      key={app.id}
                      href={href}
                      className={`switcher-item ${isCurrent ? "switcher-item-current" : ""}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                        <span className="switcher-dot" style={{ backgroundColor: app.color }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "13px" }}>{app.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{app.subtitle}</div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="badge badge-accent" style={{ fontSize: "10px" }}>
                          Current
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <a
            href={isAuthenticated ? `${portalUrl}/dashboard` : portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary nav-desktop-only"
            style={{ padding: "7px 11px", fontSize: "12px" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>{isAuthenticated ? "IAM Portal" : "Sentinel IAM"}</span>
          </a>

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
                  backgroundColor: "#ecfdf5",
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

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "10px", marginTop: "4px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
            SWITCH DEMO APP
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {DEMO_APPS.map((app) => {
              const isCurrent = app.id === APP_CONFIG.appId;
              const href = isCurrent ? brandHref : getAppSwitchHref(app, user?.userId, user?.email, ssoToken);
              return (
                <a key={app.id} href={href} className="nav-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="switcher-dot" style={{ backgroundColor: app.color }} />
                  <span>{app.name}</span>
                  {isCurrent && <span className="badge badge-accent">Current</span>}
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", paddingTop: "8px", flexWrap: "wrap" }}>
          <a
            href={isAuthenticated ? `${portalUrl}/dashboard` : portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Sentinel IAM Portal
          </a>
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
