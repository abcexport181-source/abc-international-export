'use client'

import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useWebsiteData } from '@/hooks/useWebsiteData';

interface CountryReportRow {
  country: string;
  activeUsers: number;
  sessions: number;
}

const COLORS = ['#1e5df7', '#0b1427', '#3b82f6', '#60a5fa', '#7c3aed', '#ec4899', '#f59e0b', '#14b8a6', '#22c55e', '#ef4444'];

const SeoAnalyticsPanel = () => {
  const { getContent } = useWebsiteData();
  const [report, setReport] = useState<CountryReportRow[]>([]);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const measurementId = getContent('seo', 'Tracking', 'google_analytics_measurement_id', '');

  useEffect(() => {
    if (!measurementId) return;
    ReactGA.initialize(measurementId);
    ReactGA.send({ hitType: 'pageview', page: '/admin/seo-analytics' });
  }, [measurementId]);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/analytics/country-report');
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Unable to fetch analytics report');
        }
        setReport(data.report);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const pieData = report.slice(0, 8).map((row, index) => ({
    name: row.country,
    value: row.sessions || row.activeUsers,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <section style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2rem', marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Google Analytics Website Visits</h3>
      <p style={{ marginBottom: '1rem', color: '#475569' }}>
        Country-wise visitor and session summary powered by your GA4 property.
      </p>
      <p style={{ marginBottom: '1rem', color: '#475569', fontSize: '0.95rem' }}>
        Note: verification codes are used for Search Console / site ownership and are different from your tracking IDs. Use the GA4 Measurement ID field only for analytics reporting (e.g. G-XXXXXXXXXX).
      </p>
      {!measurementId && (
        <div style={{ padding: '1rem', borderRadius: '10px', background: '#f8fafc', color: '#334155' }}>
          Set your <strong>Google Analytics Measurement ID</strong> in the SEO Settings section above to enable visitor tracking.
        </div>
      )}
      {error && (
        <div style={{ padding: '1rem', borderRadius: '10px', background: '#fef2f2', color: '#991b1b' }}>
          {error}
        </div>
      )}
      {loading ? (
        <div style={{ padding: '1rem', color: '#334155' }}>Loading analytics data...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0 }}>Country Analytics</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setChartType('pie')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    border: chartType === 'pie' ? '1px solid #1e5df7' : '1px solid #d1d5db',
                    background: chartType === 'pie' ? '#eff6ff' : '#ffffff',
                    color: chartType === 'pie' ? '#1e5df7' : '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Pie Chart
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    border: chartType === 'bar' ? '1px solid #1e5df7' : '1px solid #d1d5db',
                    background: chartType === 'bar' ? '#eff6ff' : '#ffffff',
                    color: chartType === 'bar' ? '#1e5df7' : '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Bar Chart
                </button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Country</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Active Users</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {report.map(row => (
                  <tr key={row.country}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>{row.country}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>{row.activeUsers}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>{row.sessions}</td>
                  </tr>
                ))}
                {report.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: '1rem', color: '#64748b' }}>
                      No analytics rows available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ minHeight: '320px', width: '100%', padding: '1rem', borderRadius: '16px', background: '#f8fafc' }}>
            <h4 style={{ marginBottom: '1rem' }}>Top countries by sessions</h4>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label={(entry) => entry.name}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [Number(value ?? 0), 'Sessions']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                ) : (
                  <BarChart data={pieData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [Number(value ?? 0), 'Sessions']} />
                    <Legend verticalAlign="bottom" height={36} />
                    <Bar dataKey="value" name="Sessions">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div style={{ color: '#64748b' }}>No chart data available.</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SeoAnalyticsPanel;
