#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./update-urls.sh https://your-vercel-url.vercel.app"
    exit 1
fi

VERCEL_URL=$1

echo "Updating API URLs to: $VERCEL_URL"

find . -type f \( -name "*.js" -o -name "*.html" \) \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -exec sed -i '' "s|http://localhost:3001|$VERCEL_URL|g" {} +

echo "✓ URLs updated successfully!"
echo "Now commit and push:"
echo "  git add ."
echo "  git commit -m 'Update API URLs for production'"
echo "  git push"
