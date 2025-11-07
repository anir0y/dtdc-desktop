import { useState, useEffect } from 'react';
import { cookieManager } from '../utils/cookieManager';

export default function CookieConsent({ onConsentChange }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsent = cookieManager.hasConsent();
    if (!hasConsent) {
      setShowBanner(true);
    }
    onConsentChange(hasConsent);
  }, [onConsentChange]);

  const handleAccept = () => {
    cookieManager.setConsent(true);
    setShowBanner(false);
    onConsentChange(true);
  };

  const handleDecline = () => {
    cookieManager.setConsent(false);
    setShowBanner(false);
    onConsentChange(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <div className="cookie-text">
          <h3>Cookie Notice</h3>
          <p>
            We use cookies to store your tracking history locally in your browser for your convenience.
            This helps you quickly access previously tracked packages. Your data never leaves your device.
          </p>
          <ul>
            <li>Tracking numbers are stored in browser cookies only</li>
            <li>No data is sent to external servers (except DTDC API)</li>
            <li>You can clear your history anytime</li>
            <li>Cookies expire after 30 days of inactivity</li>
          </ul>
        </div>
        <div className="cookie-actions">
          <button onClick={handleAccept} className="btn btn-primary">
            Accept & Continue
          </button>
          <button onClick={handleDecline} className="btn btn-secondary">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
