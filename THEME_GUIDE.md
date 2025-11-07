# DTDC Desktop Tracker - Theme & Icon Guide

## 🌓 Light & Dark Mode

### Automatic Theme Switching

The app automatically detects and adapts to your macOS system theme preference.

**To change the theme:**

1. Open **System Preferences** (or **System Settings** on macOS 13+)
2. Go to **General** → **Appearance**
3. Select:
   - **Light** - Clean, bright interface
   - **Dark** - Eye-friendly, low-light optimized
   - **Auto** - Switches based on time of day

The app will instantly adapt without needing to restart!

### Light Mode

**Best for:**
- Daytime use
- Bright environments
- Maximum readability

**Colors:**
- Background: Light gray (`#f5f7fa`)
- Cards: Pure white
- Text: Dark gray
- Accents: DTDC red/orange

**Visual Style:**
- Clean and professional
- Soft shadows
- High contrast text
- Bright, energetic feel

### Dark Mode

**Best for:**
- Nighttime use
- Low-light environments
- Reducing eye strain
- OLED displays (battery saving)

**Colors:**
- Background: Deep blue-gray (`#1a202c`)
- Cards: Medium dark (`#2d3748`)
- Text: Light gray
- Accents: DTDC orange (enhanced visibility)

**Visual Style:**
- Easy on the eyes
- Reduced brightness
- Maintained contrast
- Modern, sleek appearance

## 📮 App Icon - Mail Envelope

### Design

A custom-designed mail envelope icon with DTDC branding:

```
┌─────────────────┐
│   🔴 Circle     │  ← DTDC Red background
│    ┌─────┐     │
│    │ ✉️  │     │  ← White envelope
│    └─────┘     │
│   Mail Icon    │
└─────────────────┘
```

**Features:**
- **Shape**: Mail envelope with flap
- **Background**: DTDC red circular gradient
- **Color**: White envelope with red outline
- **Details**: Three horizontal lines (text representation)
- **Size**: 1024x1024px (high resolution)
- **Format**: PNG → ICNS (macOS standard)

### Where You'll See It

1. **Dock** - When app is running
2. **Applications Folder** - In Finder
3. **Spotlight** - In search results
4. **App Switcher** (⌘+Tab) - When switching between apps
5. **Mission Control** - When viewing all windows

### Icon Customization

Want to regenerate or customize the icon?

```bash
# Navigate to app directory
cd /Users/animeshroy/scripts/dtdc/dtdc-desktop

# Run the icon generator
python3 create_mail_icon.py

# Rebuild the app
/Users/animeshroy/go/bin/wails build -platform darwin/arm64 -clean
```

**Edit `create_mail_icon.py` to customize:**
- Colors (DTDC red/orange or custom)
- Icon design (envelope style)
- Size and proportions
- Shadow effects

## 📏 Font Sizing

### Compact, Professional Design

All fonts have been optimized for better information density:

| Element | Size | Weight | Purpose |
|---------|------|--------|---------|
| Page Title | 2rem | Bold | Main heading |
| Section Headers | 1.25rem | Bold | Content sections |
| Body Text | 14px | Regular | Main content |
| Button Text | 14px | Semi-Bold | Actions |
| Labels | 12px | Bold | Field labels |
| Small Text | 11px | Regular | Details |

### Mobile Optimization

On screens < 768px:
- Base font: 13px
- Headers: 1.6rem
- Better readability on small displays

## 🎨 Color Palette

### Light Mode Colors

| Element | Hex | Usage |
|---------|-----|-------|
| Background | `#f5f7fa` | Page background |
| Cards | `#ffffff` | Content cards |
| Text Primary | `#2d3748` | Main text |
| Text Secondary | `#718096` | Labels, hints |
| Borders | `#e2e8f0` | Dividers, lines |
| DTDC Red | `#E31837` | Primary accent |
| DTDC Orange | `#FF6B35` | Secondary accent |
| Success Green | `#48bb78` | Completed states |

### Dark Mode Colors

| Element | Hex | Usage |
|---------|-----|-------|
| Background | `#1a202c` | Page background |
| Cards | `#2d3748` | Content cards |
| Text Primary | `#e2e8f0` | Main text |
| Text Secondary | `#a0aec0` | Labels, hints |
| Borders | `#4a5568` | Dividers, lines |
| DTDC Orange | `#FF6B35` | Primary accent |
| DTDC Red | `#E31837` | Secondary accent |
| Success Green | `#48bb78` | Completed states |

## 🔄 Theme Testing

### Quick Test Checklist

**Light Mode:**
- [ ] Background is light gray
- [ ] Cards are white with shadows
- [ ] Text is dark and readable
- [ ] DTDC red buttons stand out
- [ ] Timeline is clearly visible

**Dark Mode:**
- [ ] Background is dark blue-gray
- [ ] Cards are medium dark
- [ ] Text is light gray
- [ ] DTDC orange accents visible
- [ ] No eye strain in darkness

**Icon:**
- [ ] Mail icon visible in Dock
- [ ] Icon is sharp (not pixelated)
- [ ] Red background visible
- [ ] Envelope design clear

### Toggle Test

1. Open the app
2. Go to System Preferences → Appearance
3. Switch between Light and Dark
4. Watch the app adapt instantly ✨

## 📱 Responsive Behavior

### Desktop (> 768px)
- Full layout with sidebars
- Larger fonts and spacing
- Multi-column info grid

### Mobile (< 768px)
- Single column layout
- Smaller, compact fonts
- Stacked navigation
- Touch-friendly buttons

## 🎯 Best Practices

### For Light Environments
- Use Light mode
- Adjust screen brightness up
- Position away from glare

### For Dark Environments
- Use Dark mode
- Reduce screen brightness
- Enable Night Shift (macOS)

### For All-Day Use
- Use Auto mode
- Let system manage theme
- Reduces eye strain

## 🔧 Troubleshooting

### Theme Not Switching?

**Check system preference:**
```bash
# Check current appearance
defaults read -g AppleInterfaceStyle
# Returns "Dark" or error (Light mode)
```

**Force app restart:**
- Quit app completely (⌘+Q)
- Reopen from Applications

### Icon Not Showing?

**Clear icon cache:**
```bash
# Reset icon cache
sudo rm -rf /Library/Caches/com.apple.iconservices.store
killall Dock
```

**Rebuild app:**
```bash
cd /Users/animeshroy/scripts/dtdc/dtdc-desktop
/Users/animeshroy/go/bin/wails build -platform darwin/arm64 -clean
```

### Fonts Too Small?

**System zoom:**
- System Preferences → Accessibility
- Display → Enable larger text
- Or use macOS zoom (⌘+Option+=)

**Browser zoom (dev mode):**
- ⌘+Plus to zoom in
- ⌘+Minus to zoom out

## 💡 Tips & Tricks

1. **Quick Theme Toggle**: 
   - Add keyboard shortcut in System Preferences
   - Switch theme without opening preferences

2. **Icon Preview**:
   - Finder → Right-click app → Get Info
   - Large icon preview at top

3. **Theme Scheduling**:
   - Use Auto mode for automatic switching
   - Syncs with sunset/sunrise times

4. **Accessibility**:
   - Increase Contrast in system settings
   - Reduces transparency in dark mode
   - Better visibility

5. **Screenshots**:
   - Light mode for documentation
   - Dark mode for presentations
   - Both look professional!

## 📊 Comparison Table

| Feature | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Eye Strain | Low (bright) | Very Low |
| Battery (OLED) | Higher | Lower |
| Readability | High contrast | Soft contrast |
| Professional | ✅ Yes | ✅ Yes |
| Best Time | Daytime | Nighttime |
| Best For | Office work | Late night |

## 🎨 Design Philosophy

**Why Light/Dark Mode?**
- **Accessibility** - Users with different visual needs
- **Flexibility** - Adapts to environment
- **Modern** - Follows platform standards
- **Professional** - Shows attention to detail

**Why Smaller Fonts?**
- **Density** - More info on screen
- **Professional** - Cleaner appearance
- **Modern** - Contemporary UI standards
- **Efficient** - Better space usage

**Why Mail Icon?**
- **Recognition** - Instantly identifiable
- **Purpose** - Represents delivery/tracking
- **Branding** - DTDC colors integrated
- **Professional** - Custom, not generic

## 🚀 Quick Reference

**Switch Theme Manually:**
System Preferences → General → Appearance → Light/Dark

**Regenerate Icon:**
```bash
python3 create_mail_icon.py
```

**Rebuild App:**
```bash
wails build -platform darwin/arm64 -clean
```

**Open App:**
```bash
open build/bin/dtdc-desktop.app
```

---

**Version**: 2.1  
**Updated**: November 7, 2025  
**Author**: Animesh (anir0y.in)
