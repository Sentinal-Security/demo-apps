# Dummy App 3 (DevOps Incident Portal) — Domain Boundary Specification (DDD)

> **App:** DevOps Incident Portal  
> **Port:** 3003  
> **Central IAM Backend:** `https://backend-pi68.onrender.com`

---

## 1. Domain Boundary & Role Ownership

* **Logic Lead (API Integration)**: `lib/api.ts` connects to Central IAM REST endpoints (`/api/auth/login`, `/api/auth/validate`). Exposes session state.
* **UI Designer (Styling)**: `app/page.tsx` template layout, branding colors (`#059669`), cards, and CSS styling.

---

## 2. SSO Session Synchronization

* SSO session tokens are validated against Central IAM Gateway (`POST /api/auth/validate`).
* Signing into Dummy App 3 automatically establishes SSO session across Dummy App 1 (`http://localhost:3001`) and Dummy App 2 (`http://localhost:3002`).
