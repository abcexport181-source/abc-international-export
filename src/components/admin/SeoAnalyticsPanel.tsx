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

const getCountryName = (code: string) => {
  const map: Record<string, string> = {
    IN: 'India (IN)',
    US: 'United States (US)',
    AE: 'United Arab Emirates (AE)',
    GB: 'United Kingdom (GB)',
    DE: 'Germany (DE)',
    CA: 'Canada (CA)',
    FR: 'France (FR)',
    AU: 'Australia (AU)',
    JP: 'Japan (JP)',
    SG: 'Singapore (SG)',
  };
  return map[code.toUpperCase()] || code;
};

const getReferrerName = (ref: string) => {
  if (!ref || ref === '' || ref === 'direct') return 'direct (Direct Traffic)';
  if (ref.toLowerCase().includes('google')) return 'google.com (Organic)';
  if (ref.toLowerCase().includes('linkedin')) return 'linkedin.com (Social)';
  if (ref.toLowerCase().includes('twitter') || ref.toLowerCase().includes('t.co')) return 'twitter.com (Social)';
  if (ref.toLowerCase().includes('facebook') || ref.toLowerCase().includes('fb')) return 'facebook.com (Social)';
  return ref;
};

const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

const getDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const getDefaultSince = () => {
  return getDaysAgo(30);
};

const getDefaultUntil = () => {
  return getToday();
};

const SeoAnalyticsPanel = () => {
  const [activeDimension, setActiveDimension] = useState<'countries' | 'paths' | 'devices' | 'browsers' | 'referrers'>('countries');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const [stream, setStream] = useState<EventStreamRow[]>(initialStreamData);
  
  // Real-time Vercel Analytics state
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  
  // Date range picker states
  const [since, setSince] = useState(getDefaultSince());
  const [until, setUntil] = useState(getDefaultUntil());
  const [activePreset, setActivePreset] = useState<string>('30d');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [liveTotals, setLiveTotals] = useState<{ total: number; devices: number } | null>(null);
  const [liveCountries, setLiveCountries] = useState<DimensionRow[]>([]);
  const [livePaths, setLivePaths] = useState<DimensionRow[]>([]);
  const [liveDevices, setLiveDevices] = useState<DimensionRow[]>([]);
  const [liveBrowsers, setLiveBrowsers] = useState<DimensionRow[]>([]);
  const [liveReferrers, setLiveReferrers] = useState<DimensionRow[]>([]);

  // Dynamic parameterized Vercel Analytics fetch handler
  const fetchLiveAnalytics = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      // 1. Fetch page view and unique devices count
      const countRes = await fetch(`/api/analytics/count?since=${startDate}&until=${endDate}`);
      const countData = await countRes.json();
      
      if (countData.notConfigured) {
        setNotConfigured(true);
        setIsLive(false);
        setLoading(false);
        return;
      }

      if (countData.data) {
        setLiveTotals({
          total: countData.data.total || 0,
          devices: countData.data.devices || 0,
        });
      }

      // 2. Fetch aggregates for dimensions in parallel
      const [countriesRes, pathsRes, devicesRes, browsersRes, referrersRes] = await Promise.all([
        fetch(`/api/analytics?by=country&since=${startDate}&until=${endDate}`),
        fetch(`/api/analytics?by=path&since=${startDate}&until=${endDate}`),
        fetch(`/api/analytics?by=device&since=${startDate}&until=${endDate}`),
        fetch(`/api/analytics?by=browser&since=${startDate}&until=${endDate}`),
        fetch(`/api/analytics?by=referrer&since=${startDate}&until=${endDate}`),
      ]);

      const [countriesJSON, pathsJSON, devicesJSON, browsersJSON, referrersJSON] = await Promise.all([
        countriesRes.json(),
        pathsRes.json(),
        devicesRes.json(),
        browsersRes.json(),
        referrersRes.json(),
      ]);

      // Mapping function to adapt Vercel response key/total/devices to DimensionRow
      const mapVercelData = (vercelData: any, nameMapper?: (key: string) => string): DimensionRow[] => {
        if (!vercelData || !Array.isArray(vercelData.data)) return [];
        const items = vercelData.data;
        const totalSum = items.reduce((acc: number, item: any) => acc + (item.devices || item.total || 0), 0);
        return items.map((item: any) => {
          const val = item.devices || item.total || 0;
          const pct = totalSum > 0 ? Math.round((val / totalSum) * 100) : 0;
          return {
            name: nameMapper ? nameMapper(item.key) : item.key,
            value: val,
            percentage: pct,
          };
        });
      };

      setLiveCountries(mapVercelData(countriesJSON, getCountryName));
      setLivePaths(mapVercelData(pathsJSON));
      setLiveDevices(mapVercelData(devicesJSON));
      setLiveBrowsers(mapVercelData(browsersJSON));
      setLiveReferrers(mapVercelData(referrersJSON, getReferrerName));

      setIsLive(true);
      setNotConfigured(false);
    } catch (err) {
      console.error('Error fetching Vercel Analytics:', err);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial mount load
  useEffect(() => {
    fetchLiveAnalytics(since, until);
  }, []);

  // Quick preset loader
  const handlePreset = (days: number) => {
    const startDate = getDaysAgo(days);
    const endDate = getToday();
    setSince(startDate);
    setUntil(endDate);
    fetchLiveAnalytics(startDate, endDate);
  };

  // Manual range applier
  const handleApplyRange = () => {
    fetchLiveAnalytics(since, until);
  };

  const handleSelectPreset = (presetId: string, days: number | null) => {
    setActivePreset(presetId);
    if (days !== null) {
      const startDate = getDaysAgo(days);
      const endDate = getToday();
      setSince(startDate);
      setUntil(endDate);
      fetchLiveAnalytics(startDate, endDate);
      setShowDropdown(false);
    }
  };

  const handleApplyCustomRange = () => {
    fetchLiveAnalytics(since, until);
    setShowDropdown(false);
  };

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

  // Date range day duration parser for high-fidelity mock scaling
  const getDaysBetween = (startStr: string, endStr: string): number => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diffDays > 0 ? diffDays : 30;
  };

  const diffDays = getDaysBetween(since, until);
  const simulatedScale = diffDays / 30;

  const getActiveData = (): DimensionRow[] => {
    if (isLive) {
      switch (activeDimension) {
        case 'countries': return liveCountries;
        case 'paths': return livePaths;
        case 'devices': return liveDevices;
        case 'browsers': return liveBrowsers;
        case 'referrers': return liveReferrers;
      }
    } else {
      const scale = simulatedScale;
      switch (activeDimension) {
        case 'countries': return countriesData.map(item => ({ ...item, value: Math.round(item.value * scale) }));
        case 'paths': return pathsData.map(item => ({ ...item, value: Math.round(item.value * scale) }));
        case 'devices': return devicesData.map(item => ({ ...item, value: Math.round(item.value * scale) }));
        case 'browsers': return browsersData.map(item => ({ ...item, value: Math.round(item.value * scale) }));
        case 'referrers': return referrersData.map(item => ({ ...item, value: Math.round(item.value * scale) }));
      }
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

      {/* Warning/Setup Notice if Vercel Environment variables are missing */}
      {notConfigured && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <h4 style={{ margin: 0, color: '#92400e', fontWeight: 600 }}>Vercel Web Analytics Setup Required</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#b45309' }}>
                Real-time integration is currently in fallback mode because environment variables are not yet configured in your Vercel project settings.
              </p>
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#78350f', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>To enable live data, add the following Environment Variables in Vercel Settings:</p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li><code>VERCEL_ANALYTICS_TOKEN</code> — Create a token at <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#b45309' }}>vercel.com/account/tokens</a></li>
              <li><code>VERCEL_PROJECT_ID</code> — Found under your Project Settings → General</li>
              <li><code>VERCEL_TEAM_ID</code> — <code>team_7vWWSeOa0pG3hC8fFPtPfI6n</code> (included by default)</li>
            </ul>
          </div>
        </div>
      )}

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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Live/Demo Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', background: isLive ? '#ecfdf5' : '#f8fafc', border: '1px solid ' + (isLive ? '#a7f3d0' : '#e2e8f0'), borderRadius: '999px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: isLive ? '#10b981' : '#94a3b8', animation: isLive ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }}></span>
              <span style={{ color: isLive ? '#065f46' : '#475569', fontSize: '0.85rem', fontWeight: 600 }}>{isLive ? 'Active Live Tracking' : 'Demo Offline Mode'}</span>
            </div>

            {/* Vercel-Style Premium Date Picker Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#334155',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                <span>📅</span>
                <span>
                  {activePreset === '24h' && 'Last 24 Hours'}
                  {activePreset === '7d' && 'Last 7 Days'}
                  {activePreset === '30d' && 'Last 30 Days'}
                  {activePreset === '90d' && 'Last 90 Days'}
                  {activePreset === 'custom' && `${since} to ${until}`}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>▼</span>
              </button>

              {/* Overlay for closing dropdown on outer clicks */}
              {showDropdown && (
                <div 
                  onClick={() => setShowDropdown(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'transparent',
                    zIndex: 99,
                    cursor: 'default'
                  }}
                />
              )}

              {/* Dropdown Card */}
              {showDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 100,
                    minWidth: '220px',
                    padding: '0.4rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'dropdownFadeIn 0.15s ease-out'
                  }}
                >
                  {/* Preset Choices */}
                  {[
                    { id: '24h', label: 'Last 24 Hours', days: 1 },
                    { id: '7d', label: 'Last 7 Days', days: 7 },
                    { id: '30d', label: 'Last 30 Days', days: 30 },
                    { id: '90d', label: 'Last 90 Days', days: 90 },
                  ].map((preset) => {
                    const isSelected = activePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id, preset.days)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.6rem 1.2rem',
                          background: isSelected ? '#f1f5f9' : 'transparent',
                          border: 'none',
                          color: '#1e293b',
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? 600 : 400,
                          textAlign: 'left',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>}
                      </button>
                    );
                  })}

                  {/* Custom option */}
                  <button
                    type="button"
                    onClick={() => setActivePreset('custom')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 1.2rem',
                      background: activePreset === 'custom' ? '#f1f5f9' : 'transparent',
                      border: 'none',
                      color: '#1e293b',
                      fontSize: '0.875rem',
                      fontWeight: activePreset === 'custom' ? 600 : 400,
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'background 0.15s ease',
                      borderTop: '1px solid #f1f5f9',
                      marginTop: '0.2rem',
                      paddingTop: '0.6rem',
                    }}
                    onMouseEnter={(e) => {
                      if (activePreset !== 'custom') e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (activePreset !== 'custom') e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span>Custom Range...</span>
                    {activePreset === 'custom' && <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>}
                  </button>

                  {/* Inline inputs for Custom Range */}
                  {activePreset === 'custom' && (
                    <div
                      style={{
                        padding: '0.8rem 1.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                        background: '#f8fafc',
                        borderTop: '1px solid #e2e8f0',
                        marginTop: '0.4rem',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Start Date:</span>
                        <input
                          type="date"
                          value={since}
                          onChange={(e) => setSince(e.target.value)}
                          style={{
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                            outline: 'none',
                            color: '#334155',
                            fontWeight: 500,
                            background: '#ffffff',
                            width: '100%'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>End Date:</span>
                        <input
                          type="date"
                          value={until}
                          onChange={(e) => setUntil(e.target.value)}
                          style={{
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                            outline: 'none',
                            color: '#334155',
                            fontWeight: 500,
                            background: '#ffffff',
                            width: '100%'
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCustomRange}
                        disabled={loading}
                        style={{
                          padding: '0.45rem 1rem',
                          background: '#000000',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.7 : 1,
                          marginTop: '0.2rem',
                          transition: 'opacity 0.15s ease'
                        }}
                      >
                        {loading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
          Vercel Web Analytics tracks visitor behavior on your site without using cookies, in a privacy-friendly manner. This data can be accessed programmatically via the Vercel API or exported via Web Analytics Drains.
        </p>

        {/* Live Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Page Views</span>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0 0 0', color: '#0f172a' }}>
              {loading ? '...' : (isLive ? liveTotals?.total?.toLocaleString() : Math.round(15420 * simulatedScale).toLocaleString())}
            </h3>
            <span style={{ fontSize: '0.75rem', color: isLive ? '#10b981' : '#64748b', fontWeight: 600 }}>
              {isLive ? '● Live from Vercel' : '○ Simulated Demo'}
            </span>
          </div>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Unique Visitors (Devices)</span>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0 0 0', color: '#0f172a' }}>
              {loading ? '...' : (isLive ? liveTotals?.devices?.toLocaleString() : Math.round(8350 * simulatedScale).toLocaleString())}
            </h3>
            <span style={{ fontSize: '0.75rem', color: isLive ? '#10b981' : '#64748b', fontWeight: 600 }}>
              {isLive ? '● Live from Vercel' : '○ Simulated Demo'}
            </span>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .5; transform: scale(1.2); }
          }
          @keyframes dropdownFadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
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
