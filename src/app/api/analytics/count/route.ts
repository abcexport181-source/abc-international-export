import { NextResponse } from 'next/server';

const VERCEL_API_BASE = 'https://api.vercel.com';

export async function GET(request: Request) {
  // Check if credentials are set
  if (!process.env.VERCEL_ANALYTICS_TOKEN || !process.env.VERCEL_PROJECT_ID) {
    return NextResponse.json({ 
      notConfigured: true, 
      message: 'Vercel Analytics environment variables are not fully configured.' 
    });
  }

  const { searchParams } = new URL(request.url);
  
  // Get query params from frontend
  const since = searchParams.get('since') || getDefaultSince();
  const until = searchParams.get('until') || getDefaultUntil();

  // Build the API URL
  const apiUrl = new URL(`${VERCEL_API_BASE}/v1/query/web-analytics/visits/count`);
  
  apiUrl.searchParams.set('projectId', process.env.VERCEL_PROJECT_ID);
  if (process.env.VERCEL_TEAM_ID) {
    apiUrl.searchParams.set('teamId', process.env.VERCEL_TEAM_ID);
  }
  apiUrl.searchParams.set('since', since);
  apiUrl.searchParams.set('until', until);

  try {
    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_ANALYTICS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch count analytics' }, { status: 500 });
  }
}

// Helper functions for default date range (last 30 days)
function getDefaultSince(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultUntil(): string {
  return new Date().toISOString().split('T')[0];
}
