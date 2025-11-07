export default function TrackingResults({ data, error }) {
  if (error) {
    return (
      <div className="tracking-results error">
        <div className="error-box">
          <h3>Tracking Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'status-delivered';
    if (statusLower.includes('transit')) return 'status-transit';
    if (statusLower.includes('picked')) return 'status-picked';
    return 'status-default';
  };

  return (
    <div className="tracking-results">
      <div className="result-header">
        <h2>Tracking Information</h2>
        <p className="tracking-number-display">
          Tracking #: <strong>{data.tracking_number}</strong>
        </p>
      </div>

      <div className="status-card">
        <div className={`status-badge ${getStatusClass(data.status)}`}>
          {data.status}
        </div>
        <div className="status-details">
          <div className="detail-item">
            <span className="label">Carrier:</span>
            <span className="value">{data.carrier}</span>
          </div>
          {data.current_location && (
            <div className="detail-item">
              <span className="label">Current Location:</span>
              <span className="value">{data.current_location}</span>
            </div>
          )}
          {data.estimated_delivery && (
            <div className="detail-item">
              <span className="label">Estimated Delivery:</span>
              <span className="value">
                {new Date(data.estimated_delivery).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {data.events && data.events.length > 0 && (
        <div className="tracking-timeline">
          <h3>Tracking History</h3>
          <div className="timeline">
            {data.events.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-time">
                    {new Date(event.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="timeline-status">{event.status}</div>
                  <div className="timeline-location">{event.location}</div>
                  <div className="timeline-description">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
