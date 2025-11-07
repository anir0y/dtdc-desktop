import { useState, useEffect } from 'react';
import { trackShipment, getRecentSearches } from './utils/api';
import './App.css';

function App() {
  const [trackingId, setTrackingId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tracker');
  const [visibleTimelineEvents, setVisibleTimelineEvents] = useState(10);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  async function loadRecentSearches() {
    try {
      const searches = await getRecentSearches(5);
      setRecentSearches(searches || []);
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  }

  async function handleTrackShipment() {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingInfo(null);
    setVisibleTimelineEvents(10);

    try {
      const result = await trackShipment(trackingId.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setTrackingInfo(result);
        await loadRecentSearches();
      }
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleTrackShipment();
    }
  }

  function selectRecentSearch(search) {
    setTrackingId(search);
    setTimeout(() => handleTrackShipment(), 100);
  }

  function getMilestoneProgress() {
    if (!trackingInfo || !trackingInfo.milestones) return 0;
    const completed = trackingInfo.milestones.filter(m => m.completed).length;
    const total = trackingInfo.milestones.length;
    return total > 0 ? (completed / total) * 100 : 0;
  }

  function loadMoreEvents() {
    setVisibleTimelineEvents(prev => prev + 10);
  }

  function goHome() {
    setTrackingInfo(null);
    setError('');
    setTrackingId('');
  }

  return (
    <main>
      <div className="container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracker')}
          >
            📦 Tracker
          </button>
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ About
          </button>
        </div>

        {activeTab === 'tracker' ? (
          <>
            <div className="header">
              <h1>📦 DTDC Shipment Tracker</h1>
              <p>Track your shipments in real-time</p>
              {trackingInfo && (
                <button className="home-btn" onClick={goHome}>
                  🏠 Back to Home
                </button>
              )}
            </div>

            <div className="search-card">
              <div className="search-form">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your tracking ID"
                  className="search-input"
                  disabled={loading}
                />
                <button onClick={handleTrackShipment} className="search-btn" disabled={loading}>
                  {loading ? '⏳ Tracking...' : '🔍 Track Shipment'}
                </button>
              </div>

              {recentSearches.length > 0 && (
                <div className="recent-searches">
                  <div className="recent-label">🕒 Recent Searches:</div>
                  <div className="recent-items">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        className={`recent-item ${trackingInfo && trackingInfo.trackingNumber === search ? 'active' : ''}`}
                        onClick={() => selectRecentSearch(search)}
                        disabled={loading}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="result-card">
                <div className="error">
                  <strong>❌ Error:</strong> {error}
                </div>
              </div>
            )}

            {trackingInfo && (
              <div className="result-card">
                <div className="status-header">
                  <h2>{trackingInfo.status}</h2>
                  <div>Tracking: <strong>{trackingInfo.trackingNumber}</strong></div>
                  {trackingInfo.referenceNo && (
                    <div className="status-badge">Ref: {trackingInfo.referenceNo}</div>
                  )}
                  <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                    Last Updated: {trackingInfo.statusDate}
                  </div>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <label>📍 From</label>
                    <div className="value">{trackingInfo.origin}</div>
                  </div>
                  <div className="info-item">
                    <label>🎯 To</label>
                    <div className="value">{trackingInfo.destination}</div>
                  </div>
                  <div className="info-item">
                    <label>📅 Booked On</label>
                    <div className="value">{trackingInfo.bookingDate}</div>
                  </div>
                  {trackingInfo.estimatedDelivery !== 'N/A' && !trackingInfo.isDelivered && (
                    <div className="info-item">
                      <label>⏰ Expected Delivery</label>
                      <div className="value">{trackingInfo.estimatedDelivery}</div>
                    </div>
                  )}
                  {trackingInfo.currentLocation && (
                    <div className="info-item">
                      <label>📌 Current Location</label>
                      <div className="value">{trackingInfo.currentLocation}</div>
                    </div>
                  )}
                  {trackingInfo.nextLocation && (
                    <div className="info-item">
                      <label>➡️ Next Stop</label>
                      <div className="value">{trackingInfo.nextLocation}</div>
                    </div>
                  )}
                </div>

                {trackingInfo.milestones && trackingInfo.milestones.length > 0 && (
                  <>
                    <h3 className="section-title">🎯 Shipment Progress</h3>
                    <div className="milestones" style={{ '--progress': `${getMilestoneProgress()}%` }}>
                      {trackingInfo.milestones.map((milestone, index) => (
                        <div key={index} className={`milestone ${milestone.completed ? 'completed' : ''}`}>
                          <div className="milestone-icon">{milestone.completed ? '✓' : '○'}</div>
                          <div className="milestone-label">{milestone.name}</div>
                          {milestone.completed && milestone.dateTime !== 'N/A' && (
                            <div className="milestone-time">{milestone.dateTime}</div>
                          )}
                          {milestone.completed && milestone.location && (
                            <div className="milestone-time">{milestone.location}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {trackingInfo.timeline && trackingInfo.timeline.length > 0 && (
                  <>
                    <h3 className="section-title">📜 Detailed Timeline</h3>
                    <div className="timeline">
                      {trackingInfo.timeline.slice(0, visibleTimelineEvents).map((event, index) => (
                        <div key={index} className="timeline-event">
                          <div className="timeline-date">{event.dateTime}</div>
                          <div className="timeline-location">📍 {event.location}</div>
                          {event.status && <div className="timeline-status">{event.status}</div>}
                          {event.details && event.details.length < 200 && (
                            <div className="timeline-details">{event.details}</div>
                          )}
                        </div>
                      ))}
                      {trackingInfo.timeline.length > visibleTimelineEvents && (
                        <div className="timeline-load-more">
                          <button onClick={loadMoreEvents} className="load-more-btn">
                            📄 Load More Events ({trackingInfo.timeline.length - visibleTimelineEvents} remaining)
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="about-card">
            <div className="about-header">
              <h1>📦 DTDC Shipment Tracker</h1>
              <p className="version">Version 1.0.0 - Web Edition</p>
            </div>

            <div className="about-content">
              <div className="about-section">
                <h2>👨‍💻 Author</h2>
                <p className="author-name">Animesh Roy</p>
                <a href="https://anir0y.in" target="_blank" rel="noopener noreferrer" className="author-link">
                  anir0y.in
                </a>
              </div>

              <div className="about-section">
                <h2>📖 Description</h2>
                <p className="description">
                  DTDC Shipment Tracker is a modern web application designed to provide
                  real-time tracking information for DTDC shipments. Built with React and Supabase,
                  this application offers a seamless experience with beautiful visualizations of your package journey.
                </p>
                <br />
                <p className="description">
                  <strong>Key Features:</strong>
                </p>
                <ul className="features-list">
                  <li>🎯 Real-time shipment tracking</li>
                  <li>📊 Visual milestone progress tracking</li>
                  <li>📜 Detailed timeline with complete shipment history</li>
                  <li>🎨 Beautiful, intuitive interface with DTDC branding</li>
                  <li>⚡ Fast and responsive web application</li>
                  <li>💾 Automatic tracking history with Supabase</li>
                  <li>🌐 Works on any device with a web browser</li>
                </ul>
              </div>

              <div className="about-section">
                <h2>🛠️ Technology Stack</h2>
                <div className="tech-grid">
                  <div className="tech-item">
                    <span className="tech-icon">⚛️</span>
                    <span>React</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🔥</span>
                    <span>Vite</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🗄️</span>
                    <span>Supabase</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🌐</span>
                    <span>DTDC API</span>
                  </div>
                </div>
              </div>

              <div className="about-section">
                <h2>📄 License & Credits</h2>
                <p className="description">
                  This application is provided as-is for personal and commercial use.
                  DTDC® is a registered trademark of their respective owners.
                  This is an independent tool and is not officially affiliated with DTDC.
                </p>
              </div>

              <div className="about-footer">
                <p>Made with ❤️ for better package tracking</p>
                <p className="copyright">© 2025 Animesh. No rights reserved.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
