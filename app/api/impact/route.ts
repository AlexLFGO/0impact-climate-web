import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.0impact.ai';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'No endpoint specified' }, { status: 400 });
  }

  try {
    // Build the full URL with all query params
    const url = new URL(endpoint, API_BASE_URL);

    // Copy all search params except 'endpoint' to the target URL
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        url.searchParams.set(key, value);
      }
    });

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