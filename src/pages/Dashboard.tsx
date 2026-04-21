import React, { useEffect, useState } from 'react';
import { db } from '../services/mockBackend';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Truck, AlertTriangle, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    db.getDashboardStats().then(setStats);
  }, []);

  const chartData = [
    { name: 'Mon', revenue: 4000, expenses: 2400 },
    { name: 'Tue', revenue: 3000, expenses: 1398 },
    { name: 'Wed', revenue: 2000, expenses: 9800 },
    { name: 'Thu', revenue: 2780, expenses: 3908 },
    { name: 'Fri', revenue: 1890, expenses: 4800 },
    { name: 'Sat', revenue: 2390, expenses: 3800 },
    { name: 'Sun', revenue: 3490, expenses: 4300 },
  ];

  if (!stats) return <div className="animate-fade-in"><p>Loading dashboard...</p></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome to ManufactureHub system.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: 'var(--text-secondary)' }}>Total Revenue</h3>
            <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--success)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: 0 }}>${stats.totalRevenue.toLocaleString()}</h2>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: 'var(--text-secondary)' }}>Pending Requests</h3>
            <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: 'var(--warning)' }}>
              <Truck size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: 0 }}>{stats.pendingRequests}</h2>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: 'var(--text-secondary)' }}>Low Stock Items</h3>
            <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: 'var(--danger)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: 0 }}>{stats.lowStockParts}</h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', height: '400px' }}>
        <h3 className="mb-6">Financial Overview (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis dataKey="name" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorRev)" />
            <Area type="monotone" dataKey="expenses" stroke="var(--danger)" fillOpacity={1} fill="url(#colorExp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
