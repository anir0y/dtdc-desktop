# DTDC Desktop Tracker

A beautiful, cross-platform desktop application for tracking DTDC shipments with real-time updates, visual milestones, detailed timeline views, and recent search history.

![Version](https://img.shields.io/badge/version-1.0.0-red)
![Platform](https://img.shields.io/badge/platform-macOS%20|%20Windows%20|%20Linux-blue)
![Framework](https://img.shields.io/badge/framework-Wails%20v2.10.2-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 📦 **Real-time Tracking** - Get instant updates on your DTDC shipments
- 🕒 **Recent Searches** - Clickable history of your last 5 tracking searches
- � **Home Button** - Easy navigation back to search from results
- �🎯 **Visual Milestones** - See your package journey at a glance with progress indicator
- 📅 **Detailed Timeline** - Complete event history with Load More pagination
- 🎨 **DTDC Branding** - Beautiful red/orange corporate color scheme with gradients
- ⚡ **Native Performance** - Fast, lightweight desktop app
- 🖥️ **Modern UI** - Clean, intuitive interface with tab navigation
- 📱 **Responsive Design** - Works perfectly on all screen sizes
- 🌓 **Dark Mode Support** - Automatically adapts to system theme
- 💾 **Local Logging** - All tracking requests logged to `dtdc_log.jsonl`

## 📥 Download

Download the latest release for your platform:

- **macOS** (Apple Silicon): `dtdc-desktop-macos-arm64.zip`
- **macOS** (Intel): `dtdc-desktop-macos-amd64.zip`
- **Windows** (64-bit): `dtdc-desktop-windows-amd64.zip`
- **Linux** (64-bit): `dtdc-desktop-linux-amd64.tar.gz` (via GitHub Actions)

> **Note**: Releases are automatically built for all platforms using GitHub Actions.

## 🚀 Quick Start

### macOS

```bash
# Extract the zip file
unzip dtdc-desktop-macos-*.zip

# Remove quarantine attribute
xattr -cr dtdc-desktop.app

# Launch the app
open dtdc-desktop.app
```

### Windows

```bash
# Extract the zip file
# Double-click dtdc-desktop.exe
```

### Linux

```bash
# Extract the tarball
tar -xzf dtdc-desktop-linux-amd64.tar.gz

# Make executable (if needed)
chmod +x dtdc-desktop

# Run the app
./dtdc-desktop
```

## 🎯 Usage Guide

1. **Launch the app** - Open dtdc-desktop
2. **Enter tracking number** - Type your DTDC tracking ID in the search box
3. **Track shipment** - Click "🔍 Track Shipment" button or press Enter
4. **View results** - See visual milestones and detailed timeline
5. **Recent searches** - Click any recent search to instantly track it again
6. **Home button** - Click "🏠 Back to Home" to start a new search
7. **Switch shipments** - Click recent searches to switch between tracked packages
8. **Load more events** - Click "Load More Events" for additional timeline history
9. **About tab** - Click "About" to view app information

## 🎨 Tabs

### 📦 Tracker Tab
- Search interface with tracking number input
- Recent searches (clickable chips showing last 5 searches)
- Active tracking indicator (highlights currently viewed shipment)
- Visual milestone progress bar with completion status
- Shipment information grid (from/to, dates, locations)
- Timeline with Load More pagination (shows 10 events initially)
- Home button for easy navigation

### ℹ️ About Tab
- Author: Animesh
- Website: [anir0y.in](https://anir0y.in)
- Email: mail@anir0y.in
- Features list
- Technology stack
- License information

## 🛠️ Technology Stack

- **Backend**: Go 1.21+
- **Framework**: Wails v2.10.2
- **Frontend**: Svelte 3 + Vite 3
- **API**: DTDC REST API
- **Styling**: Custom CSS with DTDC red/orange branding and dark mode
- **Build**: Cross-platform native executables

## 🏗️ Development

### Prerequisites

- Go 1.21 or higher
- Node.js 18 or higher
- Wails CLI v2.10.2

### Setup

```bash
# Install Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Clone the repository
git clone https://github.com/yourusername/dtdc-desktop.git
cd dtdc-desktop

# Install frontend dependencies
cd frontend
npm install
cd ..

# Run in development mode
wails dev
```

### Building

```bash
# Build for current platform
wails build -clean

# Build for specific platforms
wails build -platform darwin/arm64    # macOS Apple Silicon
wails build -platform darwin/amd64    # macOS Intel
wails build -platform windows/amd64   # Windows 64-bit
wails build -platform linux/amd64     # Linux 64-bit (on Linux only)

# Output directory
build/bin/
```

### GitHub Actions

The project includes automated builds for all platforms via GitHub Actions. Simply push a tag to trigger a release:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 📁 Project Structure

```
dtdc-desktop/
├── app.go                    # Main application logic
├── tracking.go              # DTDC API integration
├── main.go                  # Entry point
├── wails.json               # Wails configuration
├── frontend/
│   ├── src/
│   │   ├── App.svelte       # Main UI component
│   │   └── style.css        # DTDC themed styles
│   └── package.json         # Frontend dependencies
└── build/
    └── bin/
        └── dtdc-desktop.app # Built application
```

## 🎨 Color Scheme (DTDC Branding)

- **Primary Red**: `#E31837`
- **Secondary Orange**: `#FF6B35`
- **Success Green**: `#48bb78`
- **Text Dark**: `#2d3748`
- **Background**: White with red/orange gradients

## 🐛 Troubleshooting

### macOS: App won't open
```bash
# Remove macOS quarantine attribute
xattr -cr dtdc-desktop.app
```

### macOS: "App is damaged" message
This happens when the app is downloaded from the internet. Remove the quarantine attribute:
```bash
xattr -cr dtdc-desktop.app
```

### Clean rebuild
```bash
# Remove build artifacts and rebuild
rm -rf build/bin
wails build -clean
```

### Frontend issues
```bash
# Clean and reinstall frontend dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..
```

## 🎨 Color Scheme (DTDC Branding)

### Light Mode
- **Primary Red**: `#E31837`
- **Secondary Orange**: `#FF6B35`
- **Success Green**: `#48bb78`
- **Text Dark**: `#2d3748`
- **Background**: `#f5f7fa`

### Dark Mode
- **Primary Orange**: `#FF6B35`
- **Secondary Orange**: `#FF8C5C`
- **Success Green**: `#48bb78`
- **Text Light**: `#e2e8f0`
- **Background**: `#1a202c`

## 📁 Project Structure

```
dtdc-desktop/
├── .github/
│   └── workflows/
│       └── build-release.yml    # GitHub Actions workflow
├── app.go                       # Main application logic
├── tracking.go                  # DTDC API integration & logging
├── main.go                      # Entry point
├── wails.json                   # Wails configuration
├── LICENSE                      # MIT License
├── README.md                    # This file
├── frontend/
│   ├── src/
│   │   ├── App.svelte          # Main UI component
│   │   ├── style.css           # DTDC themed styles with dark mode
│   │   └── main.js             # Frontend entry
│   ├── wailsjs/                # Auto-generated Go bindings
│   └── package.json            # Frontend dependencies
└── build/
    ├── bin/                    # Compiled applications
    ├── darwin/                 # macOS build resources
    └── windows/                # Windows build resources
```

## 🔐 Privacy & Data

- **No data collection**: The app does not collect or send any personal data
- **Local logging only**: All tracking requests are logged locally to `dtdc_log.jsonl`
- **Direct API calls**: Communicates directly with DTDC API
- **No analytics**: No tracking or analytics of any kind

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is an independent tool and is not officially affiliated with DTDC. DTDC® is a registered trademark of their respective owners.

## 👤 Author

**Animesh Roy**
- Website: [anir0y.in](https://anir0y.in)
- Email: mail@anir0y.in
- GitHub: [@anir0y](https://github.com/anir0y)

## 🙏 Acknowledgments

- [Wails Framework](https://wails.io/) - Amazing Go + Web framework
- [Svelte](https://svelte.dev/) - Elegant frontend framework
- [DTDC](https://www.dtdc.com/) - For their tracking API

## 📊 Project Stats

- **Size**: ~8-9 MB per platform
- **Build time**: ~3-5 seconds per platform
- **Dependencies**: Minimal (Go standard library + Wails)
- **Performance**: Native speed with low memory footprint

---

**Built with ❤️ using Wails v2.10.2 and Svelte**

*Made for better package tracking experience*

## 📝 Development Setup

```bash
# Install Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Install frontend dependencies
cd frontend
npm install

# Run in development mode
cd ..
wails dev
```

## 📄 License

MIT License

## 👤 Author

**Animesh**
- Website: [anir0y.in](https://anir0y.in)

## 🙏 Acknowledgments

- [Wails Framework](https://wails.io/)
- [Svelte](https://svelte.dev/)
- [DTDC](https://www.dtdc.com/)

---

**Built with ❤️ using Wails v2.10.2**
