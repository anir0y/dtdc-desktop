import { useState } from 'react';

export default function ApiConfig({ config, onSave }) {
  const [isEditing, setIsEditing] = useState(!config.apiUrl || !config.apiKey);
  const [apiUrl, setApiUrl] = useState(config.apiUrl || '');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [useMockData, setUseMockData] = useState(config.useMockData || false);

  const handleSave = () => {
    if (!useMockData && (!apiUrl.trim() || !apiKey.trim())) {
      alert('Please enter both API URL and API Key, or enable mock data mode');
      return;
    }

    onSave({
      apiUrl: apiUrl.trim(),
      apiKey: apiKey.trim(),
      useMockData
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!config.apiUrl || !config.apiKey) {
      return;
    }
    setApiUrl(config.apiUrl);
    setApiKey(config.apiKey);
    setUseMockData(config.useMockData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="api-config collapsed">
        <button onClick={() => setIsEditing(true)} className="btn btn-link">
          ⚙️ API Configuration
          {useMockData && <span className="badge">Demo Mode</span>}
        </button>
      </div>
    );
  }

  return (
    <div className="api-config">
      <h3>API Configuration</h3>
      <div className="config-form">
        <div className="form-check">
          <input
            type="checkbox"
            id="mock-data"
            checked={useMockData}
            onChange={(e) => setUseMockData(e.target.checked)}
          />
          <label htmlFor="mock-data">
            Use Mock Data (Demo Mode)
          </label>
        </div>

        {!useMockData && (
          <>
            <div className="form-group">
              <label htmlFor="api-url">API URL</label>
              <input
                id="api-url"
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.trackingmore.com/v4"
              />
              <small>Enter the tracking API endpoint URL</small>
            </div>

            <div className="form-group">
              <label htmlFor="api-key">API Key</label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API key"
              />
              <small>Your API key will be stored in browser memory only</small>
            </div>
          </>
        )}

        <div className="form-actions">
          <button onClick={handleSave} className="btn btn-primary">
            Save Configuration
          </button>
          {(config.apiUrl || config.apiKey) && (
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>

        <div className="info-box">
          <h4>How to get API credentials:</h4>
          <ol>
            <li>Sign up for a tracking API service (e.g., TrackingMore, AfterShip, Ship24)</li>
            <li>Navigate to the API section in your dashboard</li>
            <li>Copy your API key and endpoint URL</li>
            <li>Paste them above and save</li>
          </ol>
          <p>
            <strong>Recommended providers:</strong> TrackingMore, AfterShip, Ship24
            <br />
            Most offer free tiers with limited API calls.
          </p>
        </div>
      </div>
    </div>
  );
}
