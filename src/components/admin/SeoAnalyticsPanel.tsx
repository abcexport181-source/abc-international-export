'use client'

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FiActivity, FiGlobe, FiMonitor, FiCpu, FiExternalLink, FiTerminal, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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



const SeoAnalyticsPanel = () => {
  const [activeDimension, setActiveDimension] = useState<'countries' | 'paths' | 'devices' | 'browsers' | 'referrers'>('countries');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const [showApiDocs, setShowApiDocs] = useState(false);
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

      {/* Accordion: Web Analytics API Endpoints */}
      <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <button
          type="button"
          onClick={() => setShowApiDocs(!showApiDocs)}
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
            <FiTerminal style={{ color: '#0f172a', fontSize: '1.2rem' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Web Analytics API Endpoints</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Query Vercel Web Analytics data programmatically via REST endpoints.</p>
            </div>
          </div>
          {showApiDocs ? <FiChevronUp style={{ fontSize: '1.3rem' }} /> : <FiChevronDown style={{ fontSize: '1.3rem' }} />}
        </button>

        {showApiDocs && (
          <div style={{ padding: '0 2rem 2rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ marginTop: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base URL</span>
              <div style={{ background: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '0.9rem', color: '#0f172a', marginTop: '0.4rem' }}>
                https://api.vercel.com
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Endpoints</span>
              <div style={{ overflowX: 'auto', marginTop: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>Endpoint</th>
                      <th style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600, fontFamily: 'monospace', color: '#000000' }}>
                        <span style={{ background: '#eff6ff', color: '#1e5df7', padding: '0.2rem 0.4rem', borderRadius: '4px', marginRight: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>GET</span>
                        /v1/query/web-analytics/visits/aggregate
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#475569' }}>Aggregate page views with breakdowns</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600, fontFamily: 'monospace', color: '#000000' }}>
                        <span style={{ background: '#eff6ff', color: '#1e5df7', padding: '0.2rem 0.4rem', borderRadius: '4px', marginRight: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>GET</span>
                        /v1/query/web-analytics/visits/count
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#475569' }}>Count total page views</td>
                    </tr>
                    <tr style={{ color: '#1e293b' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600, fontFamily: 'monospace', color: '#000000' }}>
                        <span style={{ background: '#eff6ff', color: '#1e5df7', padding: '0.2rem 0.4rem', borderRadius: '4px', marginRight: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>GET</span>
                        /v1/query/web-analytics/events/aggregate
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#475569' }}>Aggregate custom events</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Parameters</span>
                <div style={{ overflowX: 'auto', marginTop: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>Parameter</th>
                        <th style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>Description</th>
                        <th style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, fontFamily: 'monospace', color: '#0f172a' }}>projectId</td>
                        <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>Your Vercel project ID</td>
                        <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>prj_XLKmu1DyR1eY7zq8UgeRKbA7yVLA</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, fontFamily: 'monospace', color: '#0f172a' }}>since</td>
                        <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>Start date (timestamp in ms or date string)</td>
                        <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>2024-01-01</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, fontFamily: 'monospace', color: '#0f172a' }}>until</td>
                        <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>End date (timestamp in ms or date string)</td>
                        <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>2024-01-31</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, fontFamily: 'monospace', color: '#0f172a' }}>by</td>
                        <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>Dimension to group by (for aggregate endpoints)</td>
                        <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>country, path, browser, etc.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Optional Parameters</span>
                <div style={{ overflowX: 'auto', marginTop: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>Parameter</th>
                        <th style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>Description</th>
                        <th style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, fontFamily: 'monospace', color: '#0f172a' }}>filter</td>
                        <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>Filter results by dimension</td>
                        <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>{"requestPath eq \"/docs\""}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, fontFamily: 'monospace', color: '#0f172a' }}>limit</td>
                        <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>Number of results (default 10)</td>
                        <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authentication & Example Request</span>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.4rem 0 1rem 0', lineHeight: '1.5' }}>
                Use a personal access token or project-scoped integration token (e.g. <strong>siteanalytics</strong>) passed as a Bearer token in the <code>Authorization</code> header to query the API.
              </p>
              
              <div style={{ background: '#0f172a', padding: '1.2rem', borderRadius: '12px', color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', border: '1px solid #1e293b', boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)' }}>
                <div style={{ color: '#64748b', marginBottom: '0.6rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>cURL Request Example (Token: siteanalytics)</span>
                  <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#94a3b8', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>GET</span>
                </div>
                <code style={{ whiteSpace: 'pre', color: '#38bdf8' }}>
                  {`curl -X GET "https://api.vercel.com/v1/query/web-analytics/visits/aggregate?projectId=YOUR_PROJECT_ID&since=2024-01-01&until=2024-01-31&by=country&teamId=team_7vWWSeOa0pG3hC8fFPtPfI6n" \\\n  -H "Authorization: Bearer vcp_YOUR_siteanalytics_TOKEN"`}
                </code>
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
};

export default SeoAnalyticsPanel;
