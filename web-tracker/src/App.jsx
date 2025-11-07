import { useState, useEffect, useCallback } from 'react';
import CookieConsent from './components/CookieConsent';
import ApiConfig from './components/ApiConfig';
import TrackingForm from './components/TrackingForm';
import TrackingHistory from './components/TrackingHistory';
import TrackingResults from './components/TrackingResults';
import { cookieManager } from './utils/cookieManager';
import { trackPackage, getMockTrackingData } from './utils/dtdcApi';
import './App.css';

function App() {
  const [hasConsent, setHasConsent] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    apiUrl: '',
    apiKey: '',
    useMockData: true
  });
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasConsent) {
      setTrackingHistory(cookieManager.getTrackingHistory());
    }
  }, [hasConsent]);

  const handleConsentChange = useCallback((consent) => {
    setHasConsent(consent);
    if (consent) {
      setTrackingHistory(cookieManager.getTrackingHistory());
    } else {
      setTrackingHistory([]);
    }
  }, []);

  const handleApiConfigSave = (config) => {
    setApiConfig(config);
  };

  const handleTrack = async (trackingNumber) => {
    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      let data;

      if (apiConfig.useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        data = getMockTrackingData(trackingNumber);
      } else {
        data = await trackPackage(trackingNumber, apiConfig);
      }

      setTrackingData(data);

      if (hasConsent) {
        cookieManager.addToHistory(trackingNumber);
        setTrackingHistory(cookieManager.getTrackingHistory());
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (trackingNumber) => {
    handleTrack(trackingNumber);
  };

  const handleRemoveFromHistory = (trackingNumber) => {
    cookieManager.removeFromHistory(trackingNumber);
    setTrackingHistory(cookieManager.getTrackingHistory());
  };

  return (
    <div className="app">
      <CookieConsent onConsentChange={handleConsentChange} />

      <header className="app-header">
        <h1>DTDC Package Tracker</h1>
        <p>Track your DTDC packages in real-time</p>
      </header>

      <main className="app-main">
        <div className="container">
          <ApiConfig config={apiConfig} onSave={handleApiConfigSave} />

          <TrackingForm onTrack={handleTrack} isLoading={isLoading} />

          <TrackingResults data={trackingData} error={error} />

          {trackingHistory.length > 0 && (
            <TrackingHistory
              history={trackingHistory}
              onSelect={handleSelectFromHistory}
              onRemove={handleRemoveFromHistory}
              hasConsent={hasConsent}
            />
          )}

          {!hasConsent && trackingHistory.length === 0 && (
            <TrackingHistory
              history={[]}
              onSelect={handleSelectFromHistory}
              onRemove={handleRemoveFromHistory}
              hasConsent={hasConsent}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          This application uses cookies to store your tracking history locally.
          Your data never leaves your device except for API calls to DTDC tracking services.
        </p>
      </footer>
    </div>
  );
}

export default App;
