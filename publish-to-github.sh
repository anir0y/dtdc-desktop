#!/bin/bash

# DTDC Desktop Tracker - GitHub Publishing Script
# This script helps you publish the project to GitHub

echo "🚀 DTDC Desktop Tracker - GitHub Publishing"
echo "==========================================="
echo ""

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI (gh) is installed"
    USE_GH_CLI=true
else
    echo "⚠️  GitHub CLI (gh) not found. Will use manual process."
    USE_GH_CLI=false
fi

echo ""
echo "📝 Current Status:"
git log --oneline -3
echo ""

# Get GitHub username
read -p "Enter your GitHub username (default: anir0y): " GITHUB_USER
GITHUB_USER=${GITHUB_USER:-anir0y}

read -p "Enter repository name (default: dtdc-desktop): " REPO_NAME
REPO_NAME=${REPO_NAME:-dtdc-desktop}

echo ""
echo "📦 Repository will be: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""

if [ "$USE_GH_CLI" = true ]; then
    read -p "🔨 Create GitHub repository now? (y/n): " CREATE_REPO
    if [ "$CREATE_REPO" = "y" ]; then
        echo "Creating repository..."
        gh repo create $REPO_NAME --public --source=. --remote=origin --description="Beautiful cross-platform DTDC shipment tracker with recent searches and dark mode"
        
        echo ""
        echo "✅ Repository created!"
    fi
else
    echo "📌 Manual Steps Required:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: Beautiful cross-platform DTDC shipment tracker"
    echo "4. Make it Public"
    echo "5. DO NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo ""
    read -p "Press Enter when repository is created..."
    
    echo ""
    echo "Adding remote..."
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
fi

echo ""
echo "📤 Pushing code to GitHub..."
git push -u origin main

echo ""
echo "🏷️  Pushing tag v1.0.0..."
git push origin v1.0.0

echo ""
echo "✅ Code pushed successfully!"
echo ""

if [ "$USE_GH_CLI" = true ]; then
    read -p "📦 Create release with built binaries? (y/n): " CREATE_RELEASE
    if [ "$CREATE_RELEASE" = "y" ]; then
        echo "Creating release v1.0.0..."
        gh release create v1.0.0 \
            --title "v1.0.0 - Initial Release" \
            --notes-file CHANGELOG.md \
            build/bin/dtdc-desktop-macos-amd64.zip \
            build/bin/dtdc-desktop-windows-amd64.zip
        
        echo ""
        echo "✅ Release created with binaries!"
        echo "🌐 View at: https://github.com/$GITHUB_USER/$REPO_NAME/releases/tag/v1.0.0"
    fi
else
    echo "📦 To create a release manually:"
    echo "1. Go to https://github.com/$GITHUB_USER/$REPO_NAME/releases/new"
    echo "2. Choose tag: v1.0.0"
    echo "3. Release title: v1.0.0 - Initial Release"
    echo "4. Copy description from CHANGELOG.md"
    echo "5. Upload these files:"
    echo "   - build/bin/dtdc-desktop-macos-amd64.zip"
    echo "   - build/bin/dtdc-desktop-windows-amd64.zip"
    echo "6. Click 'Publish release'"
fi

echo ""
echo "🎉 All done!"
echo ""
echo "📌 Next Steps:"
echo "1. Visit: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "2. Update repository description and topics"
echo "3. Enable GitHub Actions (should trigger on next tag push)"
echo "4. Star your own repo! ⭐"
echo ""
echo "Future releases will be automated via GitHub Actions!"
echo "Just push a new tag: git tag v1.0.1 && git push origin v1.0.1"
echo ""
