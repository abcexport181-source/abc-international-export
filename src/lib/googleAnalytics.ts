import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA4_PROPERTY_ID;
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

function getServiceAccountCredentials() {
  if (!serviceAccountKey) {
    throw new Error('Google service account key is not configured. Set GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_JSON.');
  }

  try {
    return JSON.parse(serviceAccountKey);
  } catch (err) {
    throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON.');
  }
}

export function getAnalyticsClient() {
  if (!propertyId) {
    throw new Error('GA4 property ID is not configured. Set GA4_PROPERTY_ID.');
  }

  const credentials = getServiceAccountCredentials();
  return new BetaAnalyticsDataClient({ credentials });
}

export async function fetchCountryAnalyticsReport(startDate = '30daysAgo', endDate = 'today') {
  if (!propertyId) {
    throw new Error('GA4 property ID is not configured. Set GA4_PROPERTY_ID.');
  }

  const client = getAnalyticsClient();
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    orderBys: [{
      metric: {
        metricName: 'sessions',
      },
      desc: true,
    }],
    limit: 50,
  });

  const rows = response.rows || [];
  return rows.map(row => ({
    country: row.dimensionValues?.[0]?.value || 'Unknown',
    activeUsers: Number(row.metricValues?.[0]?.value || 0),
    sessions: Number(row.metricValues?.[1]?.value || 0),
  }));
}
