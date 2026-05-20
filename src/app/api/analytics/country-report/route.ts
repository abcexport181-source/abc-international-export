import { NextResponse } from 'next/server';
import { fetchCountryAnalyticsReport } from '@/lib/googleAnalytics';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate') || '30daysAgo';
    const endDate = url.searchParams.get('endDate') || 'today';

    const report = await fetchCountryAnalyticsReport(startDate, endDate);
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Analytics fetch failed' }, { status: 500 });
  }
}
