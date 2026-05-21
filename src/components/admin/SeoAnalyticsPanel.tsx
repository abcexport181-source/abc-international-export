'use client'

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FiCheckCircle, FiActivity, FiDatabase, FiInfo, FiGlobe, FiMonitor, FiCpu, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface DimensionRow {
  name: string;
  value: number;
  percentage: number;
}

interface EventStreamRow {
  timestamp: string;
  eventType: 'pageview' | 'event';
  path: string;
  country: string;
  device: string;
  browser: string;
}

const COLORS = ['#000000', '#1f5ff5', '#3b82f6', '#60a5fa', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

const countriesData: DimensionRow[] = [
  { name: 'India (IN)', value: 450, percentage: 45 },
  { name: 'United States (US)', value: 250, percentage: 25 },
  { name: 'United Arab Emirates (AE)', value: 120, percentage: 12 },
  { name: 'United Kingdom (GB)', value: 90, percentage: 9 },
  { name: 'Germany (DE)', value: 50, percentage: 5 },
  { name: 'Canada (CA)', value: 40, percentage: 4 },
];

const pathsData: DimensionRow[] = [
  { name: '/', value: 320, percentage: 32 },
  { name: '/sourcing', value: 240, percentage: 24 },
  { name: '/quality-packaging', value: 180, percentage: 18 },
  { name: '/contact', value: 150, percentage: 15 },
  { name: '/about', value: 110, percentage: 11 },
];

const devicesData: DimensionRow[] = [
  { name: 'desktop', value: 560, percentage: 56 },
  { name: 'mobile', value: 380, percentage: 38 },
  { name: 'tablet', value: 60, percentage: 6 },
];

const browsersData: DimensionRow[] = [
  { name: 'Chrome', value: 520, percentage: 52 },
  { name: 'Safari', value: 280, percentage: 28 },
  { name: 'Firefox', value: 110, percentage: 11 },
  { name: 'Edge', value: 90, percentage: 9 },
];

const referrersData: DimensionRow[] = [
  { name: 'google.com (Organic)', value: 420, percentage: 42 },
  { name: 'direct (Direct Traffic)', value: 310, percentage: 31 },
  { name: 'linkedin.com (Social)', value: 160, percentage: 16 },
  { name: 'newsletter (Campaign)', value: 110, percentage: 11 },
];

const initialStreamData: EventStreamRow[] = [
  { timestamp: 'Just now', eventType: 'pageview', path: '/sourcing', country: 'IN', device: 'mobile', browser: 'Safari' },
  { timestamp: '12s ago', eventType: 'pageview', path: '/', country: 'US', device: 'desktop', browser: 'Chrome' },
  { timestamp: '45s ago', eventType: 'event', path: '/contact', country: 'AE', device: 'desktop', browser: 'Edge' },
  { timestamp: '2m ago', eventType: 'pageview', path: '/quality-packaging', country: 'GB', device: 'mobile', browser: 'Chrome' },
  { timestamp: '4m ago', eventType: 'pageview', path: '/about', country: 'DE', device: 'desktop', browser: 'Firefox' },
];

const dataFields = [
  { name: 'eventType', type: 'string', desc: 'Type of event', example: 'pageview or event' },
  { name: 'eventName', type: 'string', desc: 'Custom event name', example: 'button_click' },
  { name: 'eventData', type: 'string', desc: 'Custom event payload', example: '{"button": "signup"}' },
  { name: 'timestamp', type: 'number', desc: 'Unix timestamp', example: '1694723400000' },
  { name: 'sessionId', type: 'number', desc: 'Unique session ID', example: '12345' },
  { name: 'deviceId', type: 'number', desc: 'Unique device ID', example: '67890' },
  { name: 'origin', type: 'string', desc: 'Origin URL', example: 'https://example.com' },
  { name: 'path', type: 'string', desc: 'URL path', example: '/dashboard' },
  { name: 'route', type: 'string', desc: 'Route pattern', example: '/dashboard/[id]' },
  { name: 'referrer', type: 'string', desc: 'Referrer URL', example: 'https://google.com' },
  { name: 'queryParams', type: 'string', desc: 'UTM & query params', example: 'utm_source=google' },
  { name: 'country', type: 'string', desc: 'Country code', example: 'US' },
  { name: 'region', type: 'string', desc: 'Region code', example: 'CA' },
  { name: 'city', type: 'string', desc: 'City name', example: 'San Francisco' },
  { name: 'osName', type: 'string', desc: 'Operating system', example: 'macOS' },
  { name: 'osVersion', type: 'string', desc: 'OS version', example: '13.4' },
  { name: 'clientName', type: 'string', desc: 'Browser name', example: 'Chrome' },
  { name: 'clientVersion', type: 'string', desc: 'Browser version', example: '114.0.5735.90' },
  { name: 'deviceType', type: 'string', desc: 'Device type', example: 'desktop, mobile, tablet' },
  { name: 'deviceBrand', type: 'string', desc: 'Device brand', example: 'Apple' },
  { name: 'deviceModel', type: 'string', desc: 'Device model', example: 'MacBook Pro' },
  { name: 'browserEngine', type: 'string', desc: 'Browser engine', example: 'Blink' },
  { name: 'vercelEnvironment', type: 'string', desc: 'Environment', example: 'production, preview' },
  { name: 'flags', type: 'string', desc: 'Feature flags data', example: '{"feature_a": true}' },
];

const SeoAnalyticsPanel = () => {
  const [activeDimension, setActiveDimension] = useState<'countries' | 'paths' | 'devices' | 'browsers' | 'referrers'>('countries');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [showFields, setShowFields] = useState(false);
  const [stream, setStream] = useState<EventStreamRow[]>(initialStreamData);

  // Dynamic simulation of incoming real-time traffic
  useEffect(() => {
    const paths = ['/', '/sourcing', '/quality-packaging', '/contact', '/about'];
    const countries = ['IN', 'US', 'AE', 'GB', 'DE', 'CA'];
    const devices = ['desktop', 'mobile', 'tablet'];
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
    const eventTypes: ('pageview' | 'event')[] = ['pageview', 'pageview', 'pageview', 'event'];

    const interval = setInterval(() => {
      const newEvent: EventStreamRow = {
        timestamp: 'Just now',
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        path: paths[Math.floor(Math.random() * paths.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
      };

      setStream(prev => {
        const updated = prev.map(row => {
          if (row.timestamp === 'Just now') return { ...row, timestamp: '15s ago' };
          if (row.timestamp === '15s ago') return { ...row, timestamp: '45s ago' };
          if (row.timestamp === '45s ago') return { ...row, timestamp: '2m ago' };
          if (row.timestamp === '2m ago') return { ...row, timestamp: '4m ago' };
          return { ...row, timestamp: '5m+ ago' };
        });
        return [newEvent, ...updated.slice(0, 4)];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getActiveData = (): DimensionRow[] => {
    switch (activeDimension) {
      case 'countries': return countriesData;
      case 'paths': return pathsData;
      case 'devices': return devicesData;
      case 'browsers': return browsersData;
      case 'referrers': return referrersData;
    }
  };

  const getDimensionIcon = () => {
    switch (activeDimension) {
      case 'countries': return <FiGlobe />;
      case 'paths': return <FiExternalLink />;
      case 'devices': return <FiMonitor />;
      case 'browsers': return <FiCpu />;
      case 'referrers': return <FiActivity />;
    }
  };

  const activeData = getActiveData();

  const pieData = activeData.map((row, index) => ({
    name: row.name,
    value: row.value,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
      
      {/* Vercel Web Analytics Banner */}
      <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#000000', color: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>▲</div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Website Analytics</h2>
              <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>Privacy-friendly, cookie-free web metrics natively powered by Vercel.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '999px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
            <span style={{ color: '#065f46', fontSize: '0.85rem', fontWeight: 600 }}>Active Tracking</span>
          </div>
        </div>

        <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
          Vercel Web Analytics tracks visitor behavior on your site without using cookies, in a privacy-friendly manner. This data can be accessed programmatically via the Vercel API or exported via Web Analytics Drains.
        </p>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .5; transform: scale(1.2); }
          }
        `}</style>
      </section>

      {/* Analytics Dashboard Visualizer */}
      <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        
        {/* Navigation Dimension Selector & Chart Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(['countries', 'paths', 'devices', 'browsers', 'referrers'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveDimension(tab)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeDimension === tab ? '#000000' : '#f8fafc',
                  color: activeDimension === tab ? '#ffffff' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'countries' && <FiGlobe />}
                {tab === 'paths' && <FiExternalLink />}
                {tab === 'devices' && <FiMonitor />}
                {tab === 'browsers' && <FiCpu />}
                {tab === 'referrers' && <FiActivity />}
                {tab === 'referrers' ? 'Referrers' : tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.3rem', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setChartType('pie')}
              style={{
                padding: '0.4rem 1rem',
                border: 'none',
                borderRadius: '6px',
                background: chartType === 'pie' ? '#ffffff' : 'transparent',
                color: chartType === 'pie' ? '#0f172a' : '#64748b',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: chartType === 'pie' ? '0 1px 3px 0 rgb(0 0 0 / 0.1)' : 'none'
              }}
            >
              Pie Chart
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              style={{
                padding: '0.4rem 1rem',
                border: 'none',
                borderRadius: '6px',
                background: chartType === 'bar' ? '#ffffff' : 'transparent',
                color: chartType === 'bar' ? '#0f172a' : '#64748b',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: chartType === 'bar' ? '0 1px 3px 0 rgb(0 0 0 / 0.1)' : 'none'
              }}
            >
              Bar Chart
            </button>
          </div>
        </div>

        {/* Visual Charts & Table Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '3rem', alignItems: 'start' }}>
          
          {/* Data List with Progress Indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '1.1rem' }}>
              {getDimensionIcon()} Top {activeDimension === 'paths' ? 'Pages & Paths' : activeDimension}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeData.map((row, idx) => (
                <div key={row.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#334155' }}>
                    <span style={{ fontWeight: 500 }}>{row.name}</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.value} sessions ({row.percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${row.percentage}%`, height: '100%', background: COLORS[idx % COLORS.length], borderRadius: '4px', transition: 'width 0.5s ease-in-out' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Chart Display */}
          <div style={{ minHeight: '340px', width: '100%', padding: '2rem 1.5rem', borderRadius: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #f1f5f9' }}>
            <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1rem' }}>Visual Distribution</h4>
            
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={(entry) => (entry && entry.name ? entry.name.split(' ')[0] : '')}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Sessions`, 'Traffic']} />
                  </PieChart>
                ) : (
                  <BarChart data={pieData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickFormatter={(name) => name.split(' ')[0]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip formatter={(value) => [`${value} Sessions`, 'Traffic']} />
                    <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Simulated Live Stream Feed */}
      <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Real-time Event Stream</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '0.8rem 1rem' }}>Time</th>
                <th style={{ padding: '0.8rem 1rem' }}>Type</th>
                <th style={{ padding: '0.8rem 1rem' }}>Path</th>
                <th style={{ padding: '0.8rem 1rem' }}>Country</th>
                <th style={{ padding: '0.8rem 1rem' }}>Device</th>
                <th style={{ padding: '0.8rem 1rem' }}>Browser</th>
              </tr>
            </thead>
            <tbody>
              {stream.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b', animation: index === 0 ? 'fadeIn 0.5s ease-out' : 'none' }}>
                  <td style={{ padding: '0.8rem 1rem', color: index === 0 ? '#3b82f6' : '#64748b', fontWeight: index === 0 ? 600 : 400 }}>{row.timestamp}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: row.eventType === 'pageview' ? '#eff6ff' : '#f5f3ff',
                      color: row.eventType === 'pageview' ? '#1e5df7' : '#7c3aed',
                      textTransform: 'uppercase'
                    }}>{row.eventType}</span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontFamily: 'monospace' }}>{row.path}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{row.country}</td>
                  <td style={{ padding: '0.8rem 1rem', textTransform: 'capitalize' }}>{row.device}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{row.browser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Accordion: Available Data Fields Documentation */}
      <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <button
          type="button"
          onClick={() => setShowFields(!showFields)}
          style={{
            width: '100%',
            padding: '1.5rem 2rem',
            border: 'none',
            background: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FiDatabase style={{ color: '#0f172a', fontSize: '1.2rem' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Available Data Fields</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>View the 24 backend tracking dimensions natively collected by Vercel Analytics.</p>
            </div>
          </div>
          {showFields ? <FiChevronUp style={{ fontSize: '1.3rem' }} /> : <FiChevronDown style={{ fontSize: '1.3rem' }} />}
        </button>

        {showFields && (
          <div style={{ padding: '0 2rem 2rem 2rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>Field</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Type</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Description</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFields.map(field => (
                    <tr key={field.name} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600, fontFamily: 'monospace', color: '#0f172a' }}>{field.name}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#475569' }}>
                          {field.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#475569' }}>{field.desc}</td>
                      <td style={{ padding: '0.8rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b' }}>{field.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Accordion: Integration Options */}
      <section style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '1.1rem' }}>
          <FiInfo style={{ color: '#1f5ff5' }} /> Options for Backend Integration
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '0.5rem' }}>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>Option 1: Vercel REST API</h5>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Query analytics data directly using the Vercel REST API. You can authenticate programmatically using a Vercel personal access token or OAuth token with appropriate scopes to aggregate metrics.
            </p>
          </div>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>Option 2: Web Analytics Drains</h5>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Export and stream your Web Analytics events in real-time to external databases or query clusters (like ClickHouse or BigQuery) using Vercel Data Drains for robust reporting and aggregation.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SeoAnalyticsPanel;
