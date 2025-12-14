#!/bin/bash

# Vercel Dev Script
# 
# KNOWN ISSUE: Vercel CLI has a bug where it appends the project name to the directory path
# when the project name matches the directory name. This causes the error:
# "Error: /path/to/recipe/recipe doesn't exist"
#
# WORKAROUND: Temporarily rename project in .vercel/project.json, run dev, then restore

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_JSON="$SCRIPT_DIR/.vercel/project.json"
BACKUP_JSON="$SCRIPT_DIR/.vercel/project.json.backup"

echo "🚀 Starting Vercel dev server..."
echo "📁 Project directory: $SCRIPT_DIR"
echo ""

# Backup original project.json
if [ -f "$PROJECT_JSON" ]; then
    cp "$PROJECT_JSON" "$BACKUP_JSON"
    
    # Temporarily change project name to avoid the bug
    # Use a different name that doesn't match directory name
    TEMP_NAME="recipe-app-dev"
    # macOS sed requires backup extension, Linux doesn't - handle both
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"projectName\":\"recipe\"/\"projectName\":\"$TEMP_NAME\"/" "$PROJECT_JSON"
    else
        sed -i "s/\"projectName\":\"recipe\"/\"projectName\":\"$TEMP_NAME\"/" "$PROJECT_JSON"
    fi
    
    echo "🔧 Applied workaround for Vercel CLI bug..."
    echo ""
fi

# Run vercel dev from current directory
cd "$SCRIPT_DIR" || exit 1

# Run vercel dev (it should work now with modified project name)
vercel dev

# Restore original project.json
if [ -f "$BACKUP_JSON" ]; then
    mv "$BACKUP_JSON" "$PROJECT_JSON"
    rm -f "$PROJECT_JSON.bak"
    echo ""
    echo "✅ Restored original project configuration"
fi

