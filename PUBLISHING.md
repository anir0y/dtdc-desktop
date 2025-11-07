# 🚀 Quick Publishing Guide

## Option 1: Using the Script (Recommended)

```bash
./publish-to-github.sh
```

This interactive script will:
- Create the GitHub repository (if you have `gh` CLI)
- Add the remote
- Push the code
- Push the tags
- Create the release with binaries

## Option 2: Manual GitHub CLI

```bash
# Create repository
gh repo create dtdc-desktop --public --source=. --remote=origin \
  --description="Beautiful cross-platform DTDC shipment tracker"

# Push code
git push -u origin main
git push origin v1.0.0

# Create release with binaries
gh release create v1.0.0 \
  --title "v1.0.0 - Initial Release" \
  --notes-file CHANGELOG.md \
  build/bin/dtdc-desktop-macos-amd64.zip \
  build/bin/dtdc-desktop-windows-amd64.zip
```

## Option 3: Manual via Web Interface

### Step 1: Create Repository
1. Go to https://github.com/new
2. Repository name: `dtdc-desktop`
3. Description: `Beautiful cross-platform DTDC shipment tracker`
4. Public repository
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/dtdc-desktop.git
git push -u origin main
git push origin v1.0.0
```

### Step 3: Create Release
1. Go to https://github.com/YOUR_USERNAME/dtdc-desktop/releases/new
2. Choose existing tag: `v1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description: Copy from `CHANGELOG.md`
5. Upload binaries:
   - `build/bin/dtdc-desktop-macos-amd64.zip`
   - `build/bin/dtdc-desktop-windows-amd64.zip`
6. Click "Publish release"

## 📦 What's Included in Release

- **macOS Intel (amd64)**: `dtdc-desktop-macos-amd64.zip` (3.5 MB)
- **Windows 64-bit**: `dtdc-desktop-windows-amd64.zip` (3.8 MB)
- **Linux 64-bit**: Will be built automatically by GitHub Actions

## 🔄 Future Releases

For future releases, GitHub Actions will automatically build for all platforms:

```bash
# Make your changes
git add .
git commit -m "Your changes"

# Create and push tag
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin main
git push origin v1.0.1

# GitHub Actions will automatically:
# - Build for macOS (ARM64 + AMD64)
# - Build for Windows (AMD64)
# - Build for Linux (AMD64)
# - Create release with all binaries
```

## 🎯 Post-Publishing

1. **Add topics** to your repository:
   - `dtdc`
   - `shipment-tracker`
   - `wails`
   - `go`
   - `svelte`
   - `desktop-app`
   - `tracking`
   - `cross-platform`

2. **Update repository settings**:
   - Add social preview image
   - Enable Discussions (optional)
   - Configure branch protection (optional)

3. **Share your project**:
   - Star your own repository ⭐
   - Share on social media
   - Add to awesome-wails list

## 📊 Repository Stats

Once published, you'll have:
- ✅ Full source code
- ✅ MIT License
- ✅ Professional README
- ✅ Automated builds
- ✅ Release with binaries
- ✅ CHANGELOG
- ✅ Cross-platform support

## 🆘 Troubleshooting

### GitHub CLI not found
Install it:
```bash
brew install gh
gh auth login
```

### Push rejected
If you get "failed to push some refs":
```bash
git pull origin main --rebase
git push -u origin main
```

### Tag already exists on remote
If tag already exists:
```bash
git tag -d v1.0.0                    # Delete local tag
git push origin :refs/tags/v1.0.0    # Delete remote tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

---

**Need help?** Check the main README.md or open an issue on GitHub.
