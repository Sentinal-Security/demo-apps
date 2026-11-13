# Sentinel Security — Single Sign-On (SSO) Client Showcase

This directory contains three distinct client web applications configured for Single Sign-On (SSO) authentication against the central Sentinel Security IAM Gateway (`https://backend-pi68.onrender.com`).

For the complete SSO federation architecture and port allocations, refer to [`UNIFIED-SYSTEM-GUIDE.md`](../UNIFIED-SYSTEM-GUIDE.md).

---

## Showcase Applications

| Application | Folder | Local Port | Role & Purpose | Production URL |
| :--- | :--- | :--- | :--- | :--- |
| **Acme HR Portal** | [`dummy-app-1/`](./dummy-app-1) | `http://localhost:3001` | Enterprise HR management client | [https://demo-apps-blue.vercel.app/](https://demo-apps-blue.vercel.app/) |
| **FinTech Payroll Portal** | [`dummy-app-2/`](./dummy-app-2) | `http://localhost:3002` | Payroll and financial management client | [https://demo-apps-sfjl.vercel.app/](https://demo-apps-sfjl.vercel.app/) |
| **DevOps Incident Portal** | [`dummy-app-3/`](./dummy-app-3) | `http://localhost:3003` | Infrastructure incident monitoring client | [https://demo-apps-fjk5.vercel.app/](https://demo-apps-fjk5.vercel.app/) |

---

## Quick Start (Run All 3 Apps)

Launch all 3 client applications concurrently using the root script:

```bash
./run-dummy-apps.sh
```

Or run each client individually in separate terminals:

```bash
# Terminal 1: Acme HR Portal
cd dummy-app-1 && npm install && npm run dev

# Terminal 2: FinTech Payroll Portal
cd dummy-app-2 && npm install && npm run dev

# Terminal 3: DevOps Incident Portal
cd dummy-app-3 && npm install && npm run dev
```

---

## Demonstrating Single Sign-On (SSO)

1. Open `http://localhost:3001` (Acme HR) and sign in using your Sentinel account.
2. Open `http://localhost:3002` (FinTech) and `http://localhost:3003` (DevOps) in separate browser tabs.
3. Both applications automatically validate the central session token with the backend gateway (`POST /api/auth/validate`) and sign you in immediately without re-prompting for credentials.
