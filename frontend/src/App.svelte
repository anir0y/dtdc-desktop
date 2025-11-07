<script>
  import {TrackShipment, GetRecentSearches} from '../wailsjs/go/main/App.js'
  import {onMount} from 'svelte'

  let trackingId = ''
  let trackingInfo = null
  let error = ''
  let loading = false
  let activeTab = 'tracker' // 'tracker' or 'about'
  let visibleTimelineEvents = 10
  let recentSearches = []

  onMount(async () => {
    await loadRecentSearches()
  })

  async function loadRecentSearches() {
    try {
      const searches = await GetRecentSearches(5)
      recentSearches = searches || []
    } catch (err) {
      console.error('Failed to load recent searches:', err)
    }
  }

  async function trackShipment() {
    if (!trackingId.trim()) {
      error = 'Please enter a tracking ID'
      return
    }

    loading = true
    error = ''
    trackingInfo = null
    visibleTimelineEvents = 10 // Reset on new search

    try {
      const result = await TrackShipment(trackingId.trim())
      if (result.error) {
        error = result.error
      } else {
        trackingInfo = result
        await loadRecentSearches() // Refresh recent searches
      }
    } catch (err) {
      error = err.toString()
    } finally {
      loading = false
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      trackShipment()
    }
  }

  function selectRecentSearch(search) {
    trackingId = search
    trackShipment()
  }

  function getMilestoneProgress() {
    if (!trackingInfo || !trackingInfo.milestones) return 0
    const completed = trackingInfo.milestones.filter(m => m.completed).length
    const total = trackingInfo.milestones.length
    return total > 0 ? (completed / total) * 100 : 0
  }

  function loadMoreEvents() {
    visibleTimelineEvents += 10
  }

  function switchTab(tab) {
    activeTab = tab
  }

  function goHome() {
    trackingInfo = null
    error = ''
    trackingId = ''
  }
</script>

<main>
  <div class="container">
    <!-- Tab Navigation -->
    <div class="tabs">
      <button 
        class="tab-btn {activeTab === 'tracker' ? 'active' : ''}" 
        on:click={() => switchTab('tracker')}
      >
        📦 Tracker
      </button>
      <button 
        class="tab-btn {activeTab === 'about' ? 'active' : ''}" 
        on:click={() => switchTab('about')}
      >
        ℹ️ About
      </button>
    </div>

    {#if activeTab === 'tracker'}
      <div class="header">
        <h1>📦 DTDC Shipment Tracker</h1>
        <p>Track your shipments in real-time</p>
        {#if trackingInfo}
          <button class="home-btn" on:click={goHome}>
            🏠 Back to Home
          </button>
        {/if}
      </div>

      <div class="search-card">
        <div class="search-form">
          <input
            type="text"
            bind:value={trackingId}
            on:keypress={handleKeyPress}
            placeholder="Enter your tracking ID"
            class="search-input"
            disabled={loading}
          />
          <button on:click={trackShipment} class="search-btn" disabled={loading}>
            {loading ? '⏳ Tracking...' : '🔍 Track Shipment'}
          </button>
        </div>
        
        {#if recentSearches.length > 0}
          <div class="recent-searches">
            <div class="recent-label">🕒 Recent Searches:</div>
            <div class="recent-items">
              {#each recentSearches as search}
                <button 
                  class="recent-item {trackingInfo && trackingInfo.trackingNumber === search ? 'active' : ''}" 
                  on:click={() => selectRecentSearch(search)}
                  disabled={loading}
                >
                  {search}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      {#if error}
        <div class="result-card">
          <div class="error">
            <strong>❌ Error:</strong> {error}
          </div>
        </div>
      {/if}

      {#if trackingInfo}
        <div class="result-card">
          <div class="status-header">
            <h2>{trackingInfo.status}</h2>
            <div>Tracking: <strong>{trackingInfo.trackingNumber}</strong></div>
            {#if trackingInfo.referenceNo}
              <div class="status-badge">Ref: {trackingInfo.referenceNo}</div>
            {/if}
            <div style="margin-top: 8px; font-size: 0.9rem;">Last Updated: {trackingInfo.statusDate}</div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <label>📍 From</label>
              <div class="value">{trackingInfo.origin}</div>
            </div>
            <div class="info-item">
              <label>🎯 To</label>
              <div class="value">{trackingInfo.destination}</div>
            </div>
            <div class="info-item">
              <label>📅 Booked On</label>
              <div class="value">{trackingInfo.bookingDate}</div>
            </div>
            {#if trackingInfo.estimatedDelivery !== 'N/A' && !trackingInfo.isDelivered}
              <div class="info-item">
                <label>⏰ Expected Delivery</label>
                <div class="value">{trackingInfo.estimatedDelivery}</div>
              </div>
            {/if}
            {#if trackingInfo.currentLocation}
              <div class="info-item">
                <label>📌 Current Location</label>
                <div class="value">{trackingInfo.currentLocation}</div>
              </div>
            {/if}
            {#if trackingInfo.nextLocation}
              <div class="info-item">
                <label>➡️ Next Stop</label>
                <div class="value">{trackingInfo.nextLocation}</div>
              </div>
            {/if}
          </div>

          {#if trackingInfo.milestones && trackingInfo.milestones.length > 0}
            <h3 class="section-title">🎯 Shipment Progress</h3>
            <div class="milestones" style="--progress: {getMilestoneProgress()}%;">
              {#each trackingInfo.milestones as milestone}
                <div class="milestone {milestone.completed ? 'completed' : ''}">
                  <div class="milestone-icon">{milestone.completed ? '✓' : '○'}</div>
                  <div class="milestone-label">{milestone.name}</div>
                  {#if milestone.completed && milestone.dateTime !== 'N/A'}
                    <div class="milestone-time">{milestone.dateTime}</div>
                  {/if}
                  {#if milestone.completed && milestone.location}
                    <div class="milestone-time">{milestone.location}</div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          {#if trackingInfo.timeline && trackingInfo.timeline.length > 0}
            <h3 class="section-title">📜 Detailed Timeline</h3>
            <div class="timeline">
              {#each trackingInfo.timeline.slice(0, visibleTimelineEvents) as event, index}
                <div class="timeline-event">
                  <div class="timeline-date">{event.dateTime}</div>
                  <div class="timeline-location">📍 {event.location}</div>
                  {#if event.status}
                    <div class="timeline-status">{event.status}</div>
                  {/if}
                  {#if event.details && event.details.length < 200}
                    <div class="timeline-details">{event.details}</div>
                  {/if}
                </div>
              {/each}
              {#if trackingInfo.timeline.length > visibleTimelineEvents}
                <div class="timeline-load-more">
                  <button on:click={loadMoreEvents} class="load-more-btn">
                    📄 Load More Events ({trackingInfo.timeline.length - visibleTimelineEvents} remaining)
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    {:else if activeTab === 'about'}
      <div class="about-card">
        <div class="about-header">
          <h1>📦 DTDC Shipment Tracker</h1>
          <p class="version">Version 1.0.0</p>
        </div>

        <div class="about-content">
          <div class="about-section">
            <h2>👨‍💻 Author</h2>
            <p class="author-name">Animesh Roy</p>
            <a href="https://anir0y.in" target="_blank" class="author-link">
              anir0y.in
            </a>
          </div>

          <div class="about-section">
            <h2>📖 Description</h2>
            <p class="description">
              DTDC Shipment Tracker is a modern, user-friendly desktop application designed to provide 
              real-time tracking information for DTDC shipments. Built with Go and Wails, this application 
              offers a seamless experience with beautiful visualizations of your package journey.
            </p>
            <br/>
            <p class="description">
              <strong>Key Features:</strong>
            </p>
            <ul class="features-list">
              <li>🎯 Real-time shipment tracking</li>
              <li>📊 Visual milestone progress tracking</li>
              <li>📜 Detailed timeline with complete shipment history</li>
              <li>🎨 Beautiful, intuitive interface with DTDC branding</li>
              <li>⚡ Fast and responsive native application</li>
              <li>💾 Automatic tracking history logging</li>
              <li>🖥️ Cross-platform support (macOS, Windows, Linux)</li>
            </ul>
          </div>

          <div class="about-section">
            <h2>🛠️ Technology Stack</h2>
            <div class="tech-grid">
              <div class="tech-item">
                <span class="tech-icon">🔷</span>
                <span>Go</span>
              </div>
              <div class="tech-item">
                <span class="tech-icon">⚡</span>
                <span>Wails</span>
              </div>
              <div class="tech-item">
                <span class="tech-icon">🎨</span>
                <span>Svelte</span>
              </div>
              <div class="tech-item">
                <span class="tech-icon">🌐</span>
                <span>DTDC API</span>
              </div>
            </div>
          </div>

          <div class="about-section">
            <h2>📄 License & Credits</h2>
            <p class="description">
              This application is provided as-is for personal and commercial use. 
              DTDC® is a registered trademark of their respective owners. 
              This is an independent tool and is not officially affiliated with DTDC.
            </p>
          </div>

          <div class="about-footer">
            <p>Made with ❤️ for better package tracking</p>
            <p class="copyright">© 2025 Animesh. No rights reserved.</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  /* No additional styles needed - using external style.css */
</style>
