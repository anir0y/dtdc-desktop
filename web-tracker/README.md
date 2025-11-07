# DTDC Shipment Tracker - Web Edition

A modern web application for tracking DTDC shipments with real-time updates, milestone visualization, and comprehensive timeline tracking. Built with React, Vite, and Supabase.

## Features

- **Real-time Package Tracking**: Track DTDC packages using tracking numbers
- **Cookie-Based History**: Store tracking history locally in browser cookies
- **Privacy-Focused**: All data stored locally, GDPR-compliant cookie consent
- **Mock Data Mode**: Test the application without API credentials
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client-Side API Integration**: All API calls made from the browser
- **Input Validation**: Robust tracking number validation and error handling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- DTDC Tracking API credentials (optional for demo mode)

### Installation

1. Navigate to the web-tracker directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build:

```bash
npm run preview
```

## API Configuration

### Option 1: Demo Mode (Default)

The application starts in demo mode with mock data. This allows you to test all features without API credentials.

1. Enter any tracking number (e.g., D12345678901)
2. Click "Track Package"
3. View mock tracking results

### Option 2: Using Real API

To use real DTDC tracking data, you'll need API credentials from a tracking service provider.

#### Recommended API Providers:

1. **TrackingMore** (https://www.trackingmore.com)
   - Free tier: 100 API calls/month
   - Easy setup and reliable
   - Endpoint: `https://api.trackingmore.com/v4`

2. **AfterShip** (https://www.aftership.com)
   - Free tier: 50 shipments/month
   - 99.9% uptime
   - Endpoint: `https://api.aftership.com/tracking/2024-04`

3. **Ship24** (https://www.ship24.com)
   - Free tier: 10-100 API calls
   - Multiple pricing plans
   - Endpoint: `https://api.ship24.com/public/v1`

#### Setting Up API Credentials:

1. Sign up for an account with your chosen provider
2. Navigate to the API section in your dashboard
3. Copy your API key
4. In the application, click "⚙️ API Configuration"
5. Uncheck "Use Mock Data (Demo Mode)"
6. Enter your API URL and API Key
7. Click "Save Configuration"

## Cookie Management

### What Data is Stored?

The application stores the following in browser cookies:

- `dtdc_cookie_consent`: Whether user has accepted cookies (365 days)
- `dtdc_tracking_history`: List of recently tracked packages (30 days)

### Cookie Details:

- **Purpose**: Store tracking history for quick access
- **Storage**: Browser cookies only
- **Expiration**: 30 days for history, 365 days for consent
- **Privacy**: No data sent to external servers except API calls
- **Max Items**: 10 most recent tracking numbers

### Managing Cookies:

1. **Accept Cookies**: Click "Accept & Continue" on first visit
2. **Decline Cookies**: Click "Decline" to use without history
3. **Clear History**: Click "Clear All" in the tracking history section
4. **Manual Clearing**: Clear browser cookies for the site

## Usage Guide

### Tracking a Package

1. Enter a DTDC tracking number in the input field
2. Click "Track Package" or press Enter
3. View tracking information including:
   - Current status
   - Estimated delivery date
   - Current location
   - Full tracking timeline

### Using Tracking History

- Previously tracked packages appear in "Recent Tracking Numbers"
- Click any tracking number to track it again
- Click the "×" button to remove from history
- Click "Clear All" to remove all history

### Troubleshooting

**"API configuration is missing"**
- Click "⚙️ API Configuration"
- Enable demo mode OR enter valid API credentials

**"Tracking number not found"**
- Verify the tracking number is correct
- Check if the package is in DTDC's system
- Wait a few hours if package was just created

**"Network error"**
- Check your internet connection
- Verify API endpoint URL is correct
- Check if API service is operational

**CORS Errors**
- Some API providers require server-side proxying
- Use demo mode for testing
- Consider setting up a backend proxy

## Security Considerations

### Client-Side Security

- API keys are stored in browser memory only
- No sensitive data logged to console
- Input validation prevents injection attacks
- HTTPS recommended for production deployment

### API Key Protection

Your API key is stored in browser memory and sent with each request. For production use:

1. **Use Environment Variables**: Store API URL in environment config
2. **Implement Rate Limiting**: Most APIs have built-in rate limits
3. **Monitor Usage**: Check API dashboard regularly
4. **Rotate Keys**: Change API keys periodically
5. **Consider Backend Proxy**: For production, proxy API calls through your server

### Recommended Production Setup

For production deployments:

```
[Browser] → [Your Backend] → [Tracking API]
```

This approach:
- Keeps API keys secure on your server
- Prevents CORS issues
- Adds additional rate limiting
- Logs API usage
- Protects against abuse

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## Technical Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **js-cookie**: Cookie management library
- **Fetch API**: HTTP requests
- **CSS3**: Styling with flexbox and grid

## Project Structure

```
web-tracker/
├── src/
│   ├── components/
│   │   ├── ApiConfig.jsx          # API configuration UI
│   │   ├── CookieConsent.jsx      # Cookie consent banner
│   │   ├── TrackingForm.jsx       # Tracking input form
│   │   ├── TrackingHistory.jsx    # Recent tracking list
│   │   └── TrackingResults.jsx    # Results display
│   ├── utils/
│   │   ├── cookieManager.js       # Cookie operations
│   │   └── dtdcApi.js             # API integration
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # Component styles
│   ├── main.jsx                   # App entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## API Integration Details

### Request Format

The application expects the following API structure:

```javascript
POST /track
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_API_KEY'
}
Body: {
  "tracking_number": "D12345678901",
  "carrier": "dtdc"
}
```

### Response Format

Expected API response structure:

```javascript
{
  "tracking_number": "D12345678901",
  "carrier": "DTDC",
  "status": "In Transit",
  "estimated_delivery": "2025-11-10",
  "current_location": "Mumbai Hub",
  "events": [
    {
      "timestamp": "2025-11-07T10:30:00Z",
      "status": "Picked Up",
      "location": "Delhi",
      "description": "Package picked up from sender"
    }
  ]
}
```

### CORS Handling

Client-side API calls may face CORS restrictions. Solutions:

1. Use API providers with CORS enabled (TrackingMore, AfterShip)
2. Implement a backend proxy
3. Use browser extensions for development (not recommended for production)

## Privacy & GDPR Compliance

This application is designed with privacy in mind:

- **Explicit Consent**: Users must accept cookies before storage
- **Clear Purpose**: Cookie usage is clearly explained
- **Easy Management**: Users can clear history anytime
- **No Tracking**: No analytics or third-party tracking scripts
- **Local Storage**: All data stays in the user's browser

## Deployment

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Configure custom domain (optional)

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

## License

This project is open source and available under the MIT License.
