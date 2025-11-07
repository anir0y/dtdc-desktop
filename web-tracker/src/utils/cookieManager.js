import Cookies from 'js-cookie';

const TRACKING_HISTORY_KEY = 'dtdc_tracking_history';
const COOKIE_CONSENT_KEY = 'dtdc_cookie_consent';
const MAX_HISTORY_ITEMS = 10;

export const cookieManager = {
  hasConsent() {
    return Cookies.get(COOKIE_CONSENT_KEY) === 'true';
  },

  setConsent(consent) {
    if (consent) {
      Cookies.set(COOKIE_CONSENT_KEY, 'true', { expires: 365 });
    } else {
      Cookies.remove(COOKIE_CONSENT_KEY);
      this.clearHistory();
    }
  },

  getTrackingHistory() {
    if (!this.hasConsent()) return [];

    const history = Cookies.get(TRACKING_HISTORY_KEY);
    if (!history) return [];

    try {
      return JSON.parse(history);
    } catch (error) {
      console.error('Error parsing tracking history:', error);
      return [];
    }
  },

  addToHistory(trackingNumber) {
    if (!this.hasConsent()) return;

    const history = this.getTrackingHistory();
    const trackingData = {
      number: trackingNumber,
      timestamp: new Date().toISOString()
    };

    const filtered = history.filter(item => item.number !== trackingNumber);
    const newHistory = [trackingData, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    Cookies.set(TRACKING_HISTORY_KEY, JSON.stringify(newHistory), { expires: 30 });
  },

  removeFromHistory(trackingNumber) {
    if (!this.hasConsent()) return;

    const history = this.getTrackingHistory();
    const filtered = history.filter(item => item.number !== trackingNumber);

    Cookies.set(TRACKING_HISTORY_KEY, JSON.stringify(filtered), { expires: 30 });
  },

  clearHistory() {
    Cookies.remove(TRACKING_HISTORY_KEY);
  }
};
