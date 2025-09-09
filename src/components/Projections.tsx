import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendUp, ChartLine, Lightbulb, Target } from '@phosphor-icons/react';

const scenarios = [
  {
    name: 'Premium Package',
    targetCall: 1500000,
    grossRevenue: 2025000000,
    netRevenue: 1425000000,
    completionDays: 195,
    roi: 237.5,
    operationalCosts: 500000000,
    oneTimePurchase: 100000000
  },
  {
    name: 'Standard Package',
    targetCall: 500000,
    grossRevenue: 675000000,
    netRevenue: 425000000,
    completionDays: 65,
    roi: 170,
    operationalCosts: 200000000,
    oneTimePurchase: 50000000
  },
  {
    name: 'Starter Package',
    targetCall: 300000,
    grossRevenue: 405000000,
    netRevenue: 230000000,
    completionDays: 39,
    roi: 123,
    operationalCosts: 150000000,
    oneTimePurchase: 25000000
  }
];

// Generate monthly projection data
const generateMonthlyProjections = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map((month, index) => ({
    month,
    premium: Math.round((scenarios[0].netRevenue / 12) * (1 + index * 0.05)),
    standard: Math.round((scenarios[1].netRevenue / 12) * (1 + index * 0.03)),
    starter: Math.round((scenarios[2].netRevenue / 12) * (1 + index * 0.02))
  }));
};

const monthlyData = generateMonthlyProjections();

const pieData = scenarios.map((scenario, index) => ({
  name: scenario.name,
  value: scenario.netRevenue,
  fill: ['#3B82F6', '#10B981', '#F59E0B'][index]
}));

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

export default function Projections() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const assumptions = [
    {
      title: 'Market Stability',
      description: 'Call demand remains consistent throughout the projection period',
      impact: 'Medium',
      color: 'blue'
    },
    {
      title: 'Operational Efficiency',
      description: '95% uptime and consistent call quality maintained',
      impact: 'High',
      color: 'emerald'
    },
    {
      title: 'Price Stability',
      description: 'Per-minute pricing remains at IDR 450 throughout the period',
      impact: 'Medium',
      color: 'yellow'
    },
    {
      title: 'Channel Utilization',
      description: 'All 32 channels operating at optimal capacity during business hours',
      impact: 'High',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Business <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Projections</span>
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Comprehensive financial forecasting and strategic insights for your call center operations.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.name}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-white">{scenario.name}</h3>
                <div className={`w-3 h-3 rounded-full bg-${COLORS[index].replace('#', '').toLowerCase()}`} style={{ backgroundColor: COLORS[index] }}></div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400 font-light">Net Revenue</p>
                  <p className="text-xl font-medium text-white">{formatCurrency(scenario.netRevenue)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 font-light">ROI</p>
                    <p className="text-lg font-medium text-emerald-400">{scenario.roi}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-light">Timeline</p>
                    <p className="text-lg font-medium text-blue-400">{scenario.completionDays}d</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Projection Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <ChartLine weight="light" size={24} className="text-blue-400" />
              <h3 className="text-xl font-light text-white tracking-tight">Monthly Revenue Projection</h3>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="premium" stroke="#3B82F6" strokeWidth={2} name="Premium" />
                <Line type="monotone" dataKey="standard" stroke="#10B981" strokeWidth={2} name="Standard" />
                <Line type="monotone" dataKey="starter" stroke="#F59E0B" strokeWidth={2} name="Starter" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* ROI Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <TrendUp weight="light" size={24} className="text-emerald-400" />
              <h3 className="text-xl font-light text-white tracking-tight">ROI Comparison</h3>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scenarios}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'ROI']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Bar dataKey="roi" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Revenue Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-12"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Target weight="light" size={24} className="text-yellow-400" />
            <h3 className="text-xl font-light text-white tracking-tight">Revenue Distribution</h3>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Net Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Business Assumptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb weight="light" size={24} className="text-yellow-400" />
            <h3 className="text-xl font-light text-white tracking-tight">Business Assumptions</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {assumptions.map((assumption, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-medium text-white">{assumption.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-light ${
                    assumption.impact === 'High' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {assumption.impact} Impact
                  </span>
                </div>
                <p className="text-slate-400 font-light text-sm leading-relaxed">
                  {assumption.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-500/10 rounded-2xl border border-blue-400/20">
            <h4 className="text-lg font-medium text-white mb-3">Key Insights</h4>
            <ul className="space-y-2 text-slate-300 font-light">
              <li>• Premium package offers the highest ROI at 237.5% over 195 days</li>
              <li>• Standard package provides balanced risk-reward with 170% ROI in 65 days</li>
              <li>• Starter package offers quick returns with 123% ROI in just 39 days</li>
              <li>• All scenarios assume optimal channel utilization and market stability</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}