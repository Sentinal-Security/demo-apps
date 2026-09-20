# Dummy App 1 (Acme HR Portal) — Domain Boundary Specification (DDD)

> **App:** Acme HR Portal  
> **Port:** 3001  
> **Central IAM Backend:** `https://backend-pi68.onrender.com`

---

## 1. Domain Boundary & Role Ownership

* **Logic Lead (API Integration)**: `lib/api.ts` connects to Central IAM REST endpoints (`/api/auth/login`, `/api/auth/validate`). Exposes session state.
* **UI Designer (Styling)**: `app/page.tsx` template layout, branding colors (`#2563eb`), cards, and CSS styling.

---

## 2. SSO Session Synchronization

* SSO session tokens are validated against Central IAM Gateway (`POST /api/auth/validate`).
* Signing into Dummy App 1 automatically establishes SSO session across Dummy App 2 (`http://localhost:3002`) and Dummy App 3 (`http://localhost:3003`).
