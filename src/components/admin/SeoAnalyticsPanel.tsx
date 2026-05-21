'use client'

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FiActivity, FiGlobe, FiMonitor, FiCpu, FiExternalLink } from 'react-icons/fi';

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


    </div>
  );
};

export default SeoAnalyticsPanel;
