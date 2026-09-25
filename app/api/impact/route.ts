import { NextRequest, NextResponse } from 'next/server';
import { buildUpstreamUrl, resolveApiBase, resolveEndpoint } from '../../lib/impactProxy';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawEndpoint = searchParams.get('endpoint');

  if (!rawEndpoint) {
    return NextResponse.json({ error: 'No endpoint specified' }, { status: 400 });
  }

  const endpoint = resolveEndpoint(rawEndpoint);
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint not allowed' }, { status: 400 });
  }

  const apiBase = resolveApiBase(process.env.IMPACT_API_BASE_URL);
  if (!apiBase) {
    console.error('Proxy misconfigured: IMPACT_API_BASE_URL is not a valid http(s) URL');
    return NextResponse.json({ error: 'Proxy misconfigured' }, { status: 500 });
  }

  try {
    // Build the full URL with all query params
    const url = buildUpstreamUrl(apiBase, endpoint, searchParams);

    console.log('Proxy request details:');
    console.log('  Endpoint:', endpoint);
    console.log('  Query params:', Object.fromEntries(searchParams.entries()));
    console.log('  Final URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `API Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Add CORS headers to allow client-side access
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from API', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
