import { useState } from 'react';

export default function TrackingForm({ onTrack, isLoading }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleaned = trackingNumber.trim();
    if (!cleaned) {
      setError('Please enter a tracking number');
      return;
    }

    onTrack(cleaned);
  };

  return (
    <div className="tracking-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tracking-number">Enter DTDC Tracking Number</label>
          <div className="input-group">
            <input
              id="tracking-number"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., D12345678901"
              className={error ? 'error' : ''}
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Tracking...' : 'Track Package'}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </div>
  );
}
