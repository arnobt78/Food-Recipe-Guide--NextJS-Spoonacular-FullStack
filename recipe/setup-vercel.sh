#!/bin/bash

# Setup script to link local development to existing Vercel project
# This ensures local dev and production use the same project

echo "🔗 Linking to existing Vercel project..."

# Remove any existing .vercel directory
rm -rf .vercel

# Link to existing project (recipe-smart)
# You can change the project name if different
vercel link --project recipe-smart --yes

echo "✅ Setup complete!"
echo "📝 You can now run: npm run dev:vercel"

