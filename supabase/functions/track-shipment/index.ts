import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const DTDC_URL = 'https://www.dtdc.com/wp-json/custom/v1/domestic/track';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { trackingNumber } = await req.json();

    if (!trackingNumber || typeof trackingNumber !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Tracking number is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const dtdcResponse = await fetch(DTDC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': 'https://www.dtdc.com',
        'Referer': 'https://www.dtdc.com/track-your-shipment/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        trackType: 'cnno',
        trackNumber: trackingNumber,
      }),
    });

    const data = await dtdcResponse.json();

    if (!dtdcResponse.ok) {
      return new Response(
        JSON.stringify({ error: `DTDC API error: ${dtdcResponse.status}` }),
        {
          status: dtdcResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseClient.from('tracking_history').insert({
      tracking_number: trackingNumber,
      response_data: data,
      status: data.header?.currentStatusDescription || 'Unknown',
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});