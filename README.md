# Sentinel Security — Single Sign-On (SSO) Client Showcase

This repository contains **3 distinct client web applications** configured for Single Sign-On (SSO) authentication against the central Sentinel Security IAM Gateway (`https://backend-pi68.onrender.com`).

---

## Showcase Applications

| Application | Folder | Local Port | Purpose |
| :--- | :--- | :--- | :--- |
| 🏢 **Acme HR Portal** | [`dummy-app-1/`](./dummy-app-1) | `http://localhost:3001` | Enterprise HR management client |
| 💳 **FinTech Payroll Portal** | [`dummy-app-2/`](./dummy-app-2) | `http://localhost:3002` | Payroll and financial management client |
| 🛠️ **DevOps Incident Portal** | [`dummy-app-3/`](./dummy-app-3) | `http://localhost:3003` | Infrastructure incident monitoring client |

---

## Quick Start (Run All 3 Apps)

Open 3 terminal windows and start each client application:

```bash
# Terminal 1: Run Dummy App 1 (Port 3001)
cd dummy-app-1
npm install
npm run dev

# Terminal 2: Run Dummy App 2 (Port 3002)
cd dummy-app-2
npm install
npm run dev

# Terminal 3: Run Dummy App 3 (Port 3003)
cd dummy-app-3
npm install
npm run dev
```

---

## Demonstrating Single Sign-On (SSO)

1. Open `http://localhost:3001` (App 1) and log in with your account credentials.
2. Open `http://localhost:3002` (App 2) and `http://localhost:3003` (App 3) in new browser tabs.
3. Both App 2 and App 3 will automatically validate the central session with `https://backend-pi68.onrender.com` and log you in instantly without requiring your password again.
