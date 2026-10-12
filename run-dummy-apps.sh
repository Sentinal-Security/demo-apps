#!/usr/bin/env bash

# ==============================================================================
# Sentinel Security — Start All SSO Demo Client Applications Concurrently
# ==============================================================================
# Launches:
#   1. Acme HR Portal        -> http://localhost:3001
#   2. FinTech Payroll       -> http://localhost:3002
#   3. DevOps Incident Command -> http://localhost:3003
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=================================================================="
echo "  Sentinel Security — Launching All SSO Client Applications"
echo "=================================================================="

# Function to clean up background processes upon exit (Ctrl+C)
cleanup() {
  echo ""
  echo "Shutting down all dummy SSO client applications..."
  if [ -n "$PID1" ]; then kill "$PID1" 2>/dev/null || true; fi
  if [ -n "$PID2" ]; then kill "$PID2" 2>/dev/null || true; fi
  if [ -n "$PID3" ]; then kill "$PID3" 2>/dev/null || true; fi
  wait 2>/dev/null || true
  echo "All dummy applications stopped."
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Detect paths (Root dummy apps or demo-apps subfolder)
APP1_DIR="$SCRIPT_DIR/dummy-app-1"
APP2_DIR="$SCRIPT_DIR/dummy-app-2"
APP3_DIR="$SCRIPT_DIR/dummy-app-3"

if [ ! -d "$APP1_DIR" ] && [ -d "$SCRIPT_DIR/demo-apps/dummy-app-1" ]; then
  APP1_DIR="$SCRIPT_DIR/demo-apps/dummy-app-1"
  APP2_DIR="$SCRIPT_DIR/demo-apps/dummy-app-2"
  APP3_DIR="$SCRIPT_DIR/demo-apps/dummy-app-3"
fi

# Ensure dependencies exist
check_deps() {
  local app_dir="$1"
  local app_name="$2"
  if [ ! -d "$app_dir/node_modules" ]; then
    echo "[$app_name] node_modules missing. Running npm install..."
    (cd "$app_dir" && npm install --silent)
  fi
}

check_deps "$APP1_DIR" "Acme HR Portal (Port 3001)"
check_deps "$APP2_DIR" "FinTech Payroll (Port 3002)"
check_deps "$APP3_DIR" "DevOps Incident (Port 3003)"

echo ""
echo "Starting Dummy Apps in parallel:"
echo "  [1] Acme HR Portal        : http://localhost:3001"
echo "  [2] FinTech Payroll       : http://localhost:3002"
echo "  [3] DevOps Incident Portal: http://localhost:3003"
echo ""
echo "Press Ctrl+C at any time to stop all applications."
echo "=================================================================="

# Start App 1 on port 3001
(cd "$APP1_DIR" && npm run dev) &
PID1=$!

# Start App 2 on port 3002
(cd "$APP2_DIR" && npm run dev) &
PID2=$!

# Start App 3 on port 3003
(cd "$APP3_DIR" && npm run dev) &
PID3=$!

# Keep script running and wait for background jobs
wait "$PID1" "$PID2" "$PID3"
