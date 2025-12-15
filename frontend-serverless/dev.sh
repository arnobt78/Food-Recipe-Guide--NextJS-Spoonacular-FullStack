#!/bin/bash

# Unified Development Server Script
# Runs both frontend (Vite) and backend (Vercel dev) together
# 
# Frontend: http://localhost:3000 (Vite)
# Backend API: http://localhost:3001/api (Vercel dev, proxied through Vite)

# Get script directory and parent directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_JSON="$SCRIPT_DIR/.vercel/project.json"
TEMP_VERCEL_COPIED=false

echo "🚀 Starting unified development server..."
echo "📁 Project directory: $SCRIPT_DIR"
echo "📁 Parent directory: $PARENT_DIR"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001/api"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    # Kill background processes
    pkill -P $$ 2>/dev/null
    # Kill Vercel dev process specifically
    if [ ! -z "$VERCEL_PID" ]; then
        kill "$VERCEL_PID" 2>/dev/null
    fi
    # Kill any process on port 3001
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    # Clean up temporary .vercel copy in parent directory (only if we created it)
    if [ "$TEMP_VERCEL_COPIED" = true ] && [ -d "$PARENT_DIR/.vercel" ]; then
        rm -rf "$PARENT_DIR/.vercel" 2>/dev/null
        echo "   ✓ Removed temporary .vercel copy"
    fi
    echo "✅ Cleanup complete"
}
trap cleanup EXIT INT TERM

# Check if project.json exists, if not, try to link project
if [ ! -f "$PROJECT_JSON" ]; then
    echo "⚠️  .vercel/project.json not found. Linking project..."
    echo "   This will prompt you to select your Vercel project."
    cd "$SCRIPT_DIR" || exit 1
    vercel link --yes 2>&1 | head -10
    echo ""
fi

# Start Vercel dev server in background (port 3001)
# Run from parent directory because Vercel project has Root Directory set to "frontend-serverless"
# The Root Directory setting in Vercel dashboard expects to find "frontend-serverless" as a subdirectory
echo "🔌 Starting Vercel dev server (backend API) on port 3001..."
echo "   Running from parent directory to match Vercel Root Directory setting..."
cd "$PARENT_DIR" || exit 1
# Copy .vercel directory to parent temporarily so Vercel can find it
# Only if parent doesn't already have a .vercel directory (to avoid conflicts)
if [ -d "$SCRIPT_DIR/.vercel" ] && [ ! -d "$PARENT_DIR/.vercel" ]; then
    cp -r "$SCRIPT_DIR/.vercel" "$PARENT_DIR/.vercel"
    TEMP_VERCEL_COPIED=true
    echo "   ✓ Copied .vercel config to parent directory"
elif [ -d "$PARENT_DIR/.vercel" ]; then
    echo "   ⚠️  Parent directory already has .vercel - using existing config"
fi
vercel dev --listen 3001 --yes > /tmp/vercel-dev.log 2>&1 &
VERCEL_PID=$!

# Wait for Vercel dev to be ready (check port and log)
echo "⏳ Waiting for backend API to be ready..."
VERCEL_READY=false
for i in {1..30}; do
    # Check if port 3001 is listening (most reliable check)
    if lsof -ti:3001 >/dev/null 2>&1; then
        echo "✅ Backend API ready! (port 3001 is listening)"
        VERCEL_READY=true
        break
    fi
    # Also check log for ready messages
    if grep -qE "(Ready|listening|Local:)" /tmp/vercel-dev.log 2>/dev/null; then
        echo "✅ Backend API ready!"
        VERCEL_READY=true
        break
    fi
    # Check for errors in log
    if grep -qiE "(Error|Failed|Cannot)" /tmp/vercel-dev.log 2>/dev/null; then
        echo "⚠️  Vercel dev encountered an error. Checking log..."
        tail -10 /tmp/vercel-dev.log
        echo ""
        echo "💡 Troubleshooting tips:"
        echo "   1. Check if port 3001 is already in use: lsof -ti:3001"
        echo "   2. If project linking issues, try: rm -rf .vercel && vercel link"
        echo "   3. Check Vercel CLI is installed: vercel --version"
        break
    fi
    sleep 1
done

if [ "$VERCEL_READY" = false ]; then
    echo "⚠️  Backend API may not be ready yet, but continuing..."
    echo "   Check /tmp/vercel-dev.log if API calls fail"
    echo "   You can also check: tail -f /tmp/vercel-dev.log"
fi

# Start Vite dev server (port 3000, proxies /api to 3001)
# Vite needs to run from the frontend-serverless directory
echo ""
echo "🎨 Starting Vite dev server (frontend) on port 3000..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cd "$SCRIPT_DIR" || exit 1
# Use vite directly to avoid script loop (npm run dev would call this script again)
npx vite

