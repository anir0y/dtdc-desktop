import { cookieManager } from '../utils/cookieManager';

export default function TrackingHistory({ history, onSelect, onRemove, hasConsent }) {
  if (!hasConsent) {
    return (
      <div className="tracking-history">
        <h3>Recent Tracking Numbers</h3>
        <p className="info-message">
          Accept cookies to save your tracking history for quick access.
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="tracking-history">
        <h3>Recent Tracking Numbers</h3>
        <p className="info-message">
          Your recently tracked packages will appear here.
        </p>
      </div>
    );
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all tracking history?')) {
      cookieManager.clearHistory();
      window.location.reload();
    }
  };

  return (
    <div className="tracking-history">
      <div className="history-header">
        <h3>Recent Tracking Numbers</h3>
        <button onClick={handleClearAll} className="btn btn-link">
          Clear All
        </button>
      </div>
      <ul className="history-list">
        {history.map((item) => (
          <li key={item.number} className="history-item">
            <button
              onClick={() => onSelect(item.number)}
              className="history-button"
            >
              <span className="tracking-number">{item.number}</span>
              <span className="tracking-date">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </button>
            <button
              onClick={() => onRemove(item.number)}
              className="btn-remove"
              title="Remove from history"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
