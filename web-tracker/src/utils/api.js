import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function trackShipment(trackingNumber) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/track-shipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ trackingNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to track shipment');
    }

    const data = await response.json();
    return parseTrackingResponse(data, trackingNumber);
  } catch (error) {
    console.error('Tracking error:', error);
    return {
      error: error.message || 'Failed to track shipment',
    };
  }
}

export async function getRecentSearches(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('tracking_history')
      .select('tracking_number')
      .order('tracked_at', { ascending: false })
      .limit(limit * 2);

    if (error) throw error;

    const uniqueSearches = [];
    const seen = new Set();

    for (const item of data) {
      if (!seen.has(item.tracking_number)) {
        seen.add(item.tracking_number);
        uniqueSearches.push(item.tracking_number);
        if (uniqueSearches.length >= limit) break;
      }
    }

    return uniqueSearches;
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    return [];
  }
}

function parseTrackingResponse(resp, trackingNum) {
  const info = {
    trackingNumber: trackingNum,
    referenceNo: resp.header?.referenceNo || '',
    status: resp.header?.currentStatusDescription || 'Unknown',
    statusDate: formatDateTime(resp.header?.currentStatusDate, resp.header?.currentStatusTime),
    origin: `${resp.header?.originCity || 'N/A'} (${resp.header?.originPincode || 'N/A'})`,
    destination: `${resp.header?.destinationCity || 'N/A'} (${resp.header?.destinationPincode || 'N/A'})`,
    bookingDate: formatDateTime(resp.header?.bookingDate, resp.header?.bookingTime),
    estimatedDelivery: formatDate(resp.header?.opsEdd),
    currentLocation: resp.header?.currentLocationCityName || '',
    nextLocation: resp.header?.nextLocationCityName || '',
    milestones: [],
    timeline: [],
    isDelivered: false,
  };

  if (resp.milestones && Array.isArray(resp.milestones)) {
    info.milestones = resp.milestones
      .filter(m => m.mileName)
      .map(m => {
        const completed = m.mileStatus === 'A';
        if (m.mileName === 'Delivered' && completed) {
          info.isDelivered = true;
        }
        return {
          name: m.mileName,
          location: m.mileLocationName || '',
          dateTime: formatDate(m.mileStatusDateTime),
          completed,
        };
      });
  }

  if (resp.statuses && Array.isArray(resp.statuses)) {
    info.timeline = resp.statuses.map(s => ({
      dateTime: formatDate(s.statusTimestamp),
      location: `${s.actBranchName || ''}, ${s.actCityName || ''}`.trim(),
      status: s.statusDescription || '',
      details: cleanHTML(s.remarks || ''),
    }));
  }

  return info;
}

function formatDateTime(date, timeStr) {
  if (!date) return 'N/A';
  const combined = `${date} ${timeStr || ''}`.trim();
  const parsed = parseFlexibleTime(combined);
  if (parsed) {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(parsed);
  }
  return combined;
}

function formatDate(dateTime) {
  if (!dateTime || dateTime === 'null') return 'N/A';
  const parsed = parseFlexibleTime(dateTime);
  if (parsed) {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(parsed);
  }
  return dateTime;
}

function parseFlexibleTime(s) {
  if (!s) return null;
  s = s.trim();

  const formats = [
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d+)$/,
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
    /^(\d{4})-(\d{2})-(\d{2})$/,
  ];

  for (const format of formats) {
    const match = s.match(format);
    if (match) {
      const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    }
  }

  const attempt = new Date(s);
  if (!isNaN(attempt.getTime())) {
    return attempt;
  }

  return null;
}

function cleanHTML(s) {
  if (!s) return '';
  let cleaned = s;

  cleaned = cleaned.replace(/<\/a>/g, '');

  while (cleaned.includes('<a ')) {
    const start = cleaned.indexOf('<a ');
    if (start === -1) break;
    const end = cleaned.indexOf('>', start);
    if (end === -1) break;
    cleaned = cleaned.slice(0, start) + cleaned.slice(end + 1);
  }

  cleaned = cleaned.replace(/<b>/g, '');
  cleaned = cleaned.replace(/<\/b>/g, '');
  cleaned = cleaned.replace(/<span[^>]*>/g, '');
  cleaned = cleaned.replace(/<\/span>/g, '');

  return cleaned.trim();
}
