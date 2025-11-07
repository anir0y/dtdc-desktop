export const validateTrackingNumber = (trackingNumber) => {
  if (!trackingNumber) {
    return { valid: false, error: 'Tracking number is required' };
  }

  const cleaned = trackingNumber.trim();

  if (cleaned.length < 8 || cleaned.length > 20) {
    return { valid: false, error: 'Tracking number must be between 8 and 20 characters' };
  }

  if (!/^[A-Z0-9]+$/i.test(cleaned)) {
    return { valid: false, error: 'Tracking number can only contain letters and numbers' };
  }

  return { valid: true, cleaned };
};

export const trackPackage = async (trackingNumber, apiConfig) => {
  const validation = validateTrackingNumber(trackingNumber);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { apiUrl, apiKey } = apiConfig;

  if (!apiUrl || !apiKey) {
    throw new Error('API configuration is missing. Please check your setup.');
  }

  try {
    const response = await fetch(`${apiUrl}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        tracking_number: validation.cleaned,
        carrier: 'dtdc'
      })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Tracking number not found');
      } else if (response.status === 401) {
        throw new Error('Invalid API credentials');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your internet connection');
    }
    throw error;
  }
};

export const getMockTrackingData = (trackingNumber) => {
  return {
    tracking_number: trackingNumber,
    carrier: 'DTDC',
    status: 'In Transit',
    estimated_delivery: '2025-11-10',
    current_location: 'Mumbai Hub',
    events: [
      {
        timestamp: '2025-11-07T10:30:00Z',
        status: 'Picked Up',
        location: 'Delhi',
        description: 'Package picked up from sender'
      },
      {
        timestamp: '2025-11-07T14:20:00Z',
        status: 'In Transit',
        location: 'Delhi Hub',
        description: 'Package sorted at facility'
      },
      {
        timestamp: '2025-11-07T18:45:00Z',
        status: 'In Transit',
        location: 'Mumbai Hub',
        description: 'Package arrived at destination hub'
      }
    ]
  };
};
