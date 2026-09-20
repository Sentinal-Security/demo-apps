# Sentinel Security Showcase — Domain Boundary Specification (DDD)

> **Repository:** `Sentinal-Security/demo-apps`  
> **Team Structure:** 2-Developer Collaboration Model (Logic Lead & UI Designer)  
> **Central IAM Backend:** `https://backend-pi68.onrender.com`

---

## Domain Boundary Matrix

| Client App | Folder | Port | Logic Ownership | UI Ownership |
| :--- | :--- | :--- | :--- | :--- |
| **Acme HR Portal** | `dummy-app-1/` | 3001 | `lib/api.ts` | `app/page.tsx` styling |
| **FinTech Payroll** | `dummy-app-2/` | 3002 | `lib/api.ts` | `app/page.tsx` styling |
| **DevOps Incident** | `dummy-app-3/` | 3003 | `lib/api.ts` | `app/page.tsx` styling |

---

## SSO Session Validation Protocol

All client apps validate active SSO sessions via `POST /api/auth/validate` on the central backend gateway (`https://backend-pi68.onrender.com`).
