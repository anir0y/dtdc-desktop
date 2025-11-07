# DTDC Package Tracker - Quick Setup Guide

This guide will help you get the DTDC Package Tracker running in minutes.

## Quick Start (Demo Mode)

The fastest way to try the application:

```bash
cd web-tracker
npm install
npm run dev
```

Then open http://localhost:5173 in your browser. The app runs in demo mode by default, so you can test it immediately with any tracking number.

## Understanding Cookie Management

### First-Time Visit

When you first visit the application, you'll see a cookie consent banner:

```
┌─────────────────────────────────────────────────┐
│ Cookie Notice                                   │
│                                                 │
│ We use cookies to store your tracking history  │
│ locally in your browser for your convenience.  │
│                                                 │
│ • Tracking numbers stored in cookies only      │
│ • No data sent to external servers             │
│ • You can clear your history anytime           │
│ • Cookies expire after 30 days                 │
│                                                 │
│ [Accept & Continue]  [Decline]                 │
└─────────────────────────────────────────────────┘
```

**Important:** You must accept cookies to save tracking history. If you decline, the app still works but won't remember your searches.

### What Happens When You Accept

The app stores two cookies:

1. **dtdc_cookie_consent**: Records your consent (expires in 365 days)
2. **dtdc_tracking_history**: Stores up to 10 recent tracking numbers (expires in 30 days)

### What Happens When You Decline

- No cookies are stored
- The app works normally
- Previous searches are not saved
- You'll see a message: "Accept cookies to save your tracking history"

## Using Demo Mode

Demo mode is perfect for:
- Testing the application
- Understanding the UI
- Demonstrating features
- Development work

**How to use:**

1. Leave "Use Mock Data (Demo Mode)" checked in API Configuration
2. Enter any tracking number (e.g., D12345678901)
3. Click "Track Package"
4. View realistic mock tracking data

The demo returns the same mock data for any tracking number you enter.

## Setting Up Real API Access

To track real DTDC packages, you need API credentials from a third-party tracking service.

### Step 1: Choose a Provider

We recommend these providers (all have free tiers):

| Provider | Free Tier | Setup Time | Best For |
|----------|-----------|------------|----------|
| **TrackingMore** | 100 calls/month | 5 minutes | Beginners, most reliable |
| **AfterShip** | 50 shipments/month | 10 minutes | More features, webhooks |
| **Ship24** | 10-100 calls | 5 minutes | Multiple carriers |

### Step 2: Get API Credentials (TrackingMore Example)

1. Go to https://www.trackingmore.com
2. Click "Sign Up" or "Get Started"
3. Complete registration (email verification required)
4. Navigate to Dashboard → API
5. Copy these two values:
   - **API Key**: Something like `tm-abc123xyz...`
   - **API Endpoint**: `https://api.trackingmore.com/v4`

### Step 3: Configure the Application

1. In the app, click "⚙️ API Configuration"
2. Uncheck "Use Mock Data (Demo Mode)"
3. Paste your API URL in the "API URL" field
4. Paste your API Key in the "API Key" field
5. Click "Save Configuration"

**Note:** Your API key is stored in browser memory only and is never sent anywhere except the tracking API.

### Step 4: Track Real Packages

Now when you enter a tracking number, the app will:
1. Send a request to the tracking API
2. Receive real tracking data
3. Display the actual package status

## Cookie Management Features

### Viewing History

After accepting cookies and tracking some packages, you'll see:

```
Recent Tracking Numbers              [Clear All]
─────────────────────────────────────────────────
D12345678901    Nov 7, 2025              [×]
D98765432109    Nov 6, 2025              [×]
D55555555555    Nov 5, 2025              [×]
```

Click any tracking number to track it again instantly.

### Removing Items

- **Single Item**: Click the [×] button next to any tracking number
- **All Items**: Click "Clear All" button at the top right
- **Manual**: Clear cookies in your browser settings

### Clearing All Data

To completely remove all stored data:

**In the App:**
1. Click "Clear All" in the tracking history section
2. Clear browser cookies for the site

**In Browser:**
- Chrome: Settings → Privacy → Cookies → See all site data → Search for your site → Remove
- Firefox: Settings → Privacy → Cookies and Site Data → Manage Data → Search → Remove
- Safari: Preferences → Privacy → Manage Website Data → Search → Remove

## Understanding Cookie Expiration

### Cookie Consent (365 days)
- Records whether you accepted cookies
- Lasts for one year
- Prevents the banner from showing again
- Can be cleared manually anytime

### Tracking History (30 days)
- Stores your recent tracking numbers
- Automatically expires after 30 days of inactivity
- Updates expiry date each time you track a package
- Limited to 10 most recent items

## Privacy & Security

### What Data is Stored

**Stored in Cookies:**
- Tracking numbers you've searched
- Timestamp of each search
- Cookie consent status

**NOT Stored:**
- Package contents
- Personal information
- Delivery addresses
- API keys (stored in browser memory only)

### Where Data Goes

```
[Your Browser] → [Tracking API] → [DTDC]
     ↑
  Cookies
(Local Only)
```

- Cookies never leave your browser
- Only tracking requests go to the API
- API key stays in browser memory
- No data sent to other servers

### Cookie Consent Compliance

This application follows GDPR and cookie consent best practices:

1. **Explicit Consent**: Banner appears before any cookies are set
2. **Clear Information**: Explains exactly what cookies do
3. **Easy Opt-Out**: Users can decline cookies
4. **Easy Management**: Clear history button always visible
5. **Automatic Expiry**: Cookies expire automatically

## Troubleshooting

### "Cookie consent banner keeps appearing"

**Cause:** Cookies are being blocked or cleared automatically

**Solutions:**
1. Check browser settings allow cookies
2. Disable "Clear cookies on exit" for this site
3. Disable third-party cookie blockers temporarily
4. Try a different browser

### "My tracking history disappeared"

**Possible causes:**
- Cookies expired (after 30 days inactivity)
- Browser cleared cookies automatically
- Private/Incognito mode (cookies cleared on close)
- Different browser or device

**Solution:** Accept cookies again and your new searches will be saved

### "I declined cookies but changed my mind"

**Solution:**
1. Clear your browser's cookies for this site
2. Refresh the page
3. The consent banner will appear again
4. Click "Accept & Continue"

### "CORS error when using real API"

**Cause:** The API doesn't allow requests from browsers

**Solutions:**
1. Use demo mode for testing
2. Set up a backend proxy server
3. Contact the API provider about CORS support
4. Use a different API provider (TrackingMore has good CORS support)

## Best Practices

### For Regular Users

1. **Accept Cookies**: Makes the app much more convenient
2. **Use Real API**: Get actual tracking data
3. **Check History**: Quickly re-track packages
4. **Clear Old Items**: Remove tracking numbers you don't need
5. **Bookmark**: Add to browser bookmarks for quick access

### For Developers

1. **Start with Demo Mode**: Test UI without API setup
2. **Use Free Tier**: Most providers offer adequate free tiers
3. **Monitor Usage**: Check API dashboard for rate limits
4. **Handle Errors**: App includes comprehensive error handling
5. **Consider Backend**: For production, use a backend proxy

### For Production Deployments

1. **Use HTTPS**: Always deploy with SSL certificate
2. **Backend Proxy**: Don't expose API keys in browser
3. **Rate Limiting**: Implement request throttling
4. **Error Logging**: Track API failures
5. **Privacy Policy**: Add a privacy policy page

## Advanced: Environment Variables

For production, store API URL in environment variables:

1. Create `.env.local`:
   ```
   VITE_API_URL=https://api.trackingmore.com/v4
   ```

2. Update `dtdcApi.js`:
   ```javascript
   const defaultApiUrl = import.meta.env.VITE_API_URL || '';
   ```

3. Users only need to enter API key, not the URL

## Getting Help

If you encounter issues:

1. Check the main README.md for detailed documentation
2. Review the Troubleshooting section above
3. Check browser console for error messages
4. Verify API credentials are correct
5. Test with demo mode to isolate issues

## Quick Reference

### Essential Commands

```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Default Settings

- **Demo Mode**: Enabled
- **Cookie Consent**: Not given (banner shows)
- **History Limit**: 10 items
- **Cookie Expiry**: 30 days
- **Port**: 5173 (development)

### Important URLs

- Development: http://localhost:5173
- TrackingMore: https://www.trackingmore.com
- AfterShip: https://www.aftership.com
- Ship24: https://www.ship24.com

## Next Steps

Now that you understand cookie management:

1. Run the app with `npm run dev`
2. Accept cookies when prompted
3. Try tracking a package (demo mode)
4. View your tracking history
5. Set up real API credentials (optional)
6. Track actual DTDC packages

Enjoy using the DTDC Package Tracker!
