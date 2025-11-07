# DTDC Desktop Tracker

A beautiful, native macOS desktop application for tracking DTDC shipments with real-time updates, visual milestones, and detailed timeline views.

![Version](https://img.shields.io/badge/version-2.0-red)
![Platform](https://img.shields.io/badge/platform-macOS%20Apple%20Silicon-blue)
![Framework](https://img.shields.io/badge/framework-Wails%20v2.10.2-green)

## ✨ Features

- 📦 **Real-time Tracking** - Get instant updates on your DTDC shipments
- 🎯 **Visual Milestones** - See your package journey at a glance
- 📅 **Detailed Timeline** - Complete event history with Load More pagination
- 🎨 **DTDC Branding** - Beautiful red/orange corporate color scheme
- ⚡ **Native Performance** - Fast, lightweight macOS app (8.4 MB)
- 🖥️ **Modern UI** - Clean, intuitive interface with tab navigation
- 📱 **Responsive Design** - Works perfectly on all screen sizes

## 🚀 Quick Start

### Running the Pre-built App

```bash
# Navigate to build directory
cd build/bin

# Launch the app
open dtdc-desktop.app
```

### Development Mode

```bash
# Run development server with hot reload
wails dev

# Access in browser: http://localhost:34115
```

## 🏗️ Building

```bash
# Production build for macOS Apple Silicon
wails build -platform darwin/arm64 -clean

# Output: build/bin/dtdc-desktop.app
```

## 📖 Usage

1. **Launch the app** - Double-click dtdc-desktop.app
2. **Enter tracking number** - Type your DTDC tracking ID
3. **Track shipment** - Click "Track Shipment" button
4. **View results** - See visual milestones and timeline
5. **Load more events** - Click "Load More Events" to see additional history
6. **About tab** - Click "About" to view app and author information

## 🎨 Tabs

### Tracker Tab
- Search interface with tracking number input
- Visual milestone progress bar
- Shipment information grid
- Timeline with Load More pagination (shows 10 events initially)

### About Tab
- Author: Animesh
- Website: [anir0y.in](https://anir0y.in)
- Features list
- Technology stack
- License information

## 🛠️ Technology Stack

- **Backend**: Go 1.16+
- **Framework**: Wails v2.10.2
- **Frontend**: Svelte + Vite
- **API**: DTDC REST API
- **Styling**: Custom CSS with DTDC red/orange branding
- **Build**: Native macOS arm64 executable

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

### App won't open
```bash
# Remove macOS quarantine attribute
xattr -cr build/bin/dtdc-desktop.app
```

### Clean rebuild
```bash
# Remove build artifacts and rebuild
rm -rf build
wails build -platform darwin/arm64 -clean
```

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
