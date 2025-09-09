import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calculator as CalcIcon, TrendUp, Clock, Coins, ChartLine, Target, Lightbulb } from '@phosphor-icons/react';

interface CalculatorData {
  callPerMinute: number;
  targetCall: number;
  pricePerMinute: number;
  hoursPerDay: number;
  channels: number;
  oneTimePurchase: number;
  operationalCosts: number;
}

interface Results {
  grossRevenue: number;
  netRevenue: number;
  totalMinutes: number;
  completionDays: number;
  roi: number;
}

const predefinedScenarios = [
  {
    name: '1.5M Calls',
    data: {
      callPerMinute: 3,
      targetCall: 1500000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 208,
      oneTimePurchase: 445800000,
      operationalCosts: 194826560
    }
  },
  {
    name: '500K Calls',
    data: {
      callPerMinute: 3,
      targetCall: 500000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 72,
      oneTimePurchase: 219700000,
      operationalCosts: 194826560
    }
  },
  {
    name: '300K Calls',
    data: {
      callPerMinute: 3,
      targetCall: 300000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 32,
      oneTimePurchase: 179800000,
      operationalCosts: 194826560
    }
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

export default function CombinedCalculator() {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>(predefinedScenarios[0].data);
  const [results, setResults] = useState<Results | null>(null);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const calculateResults = (data: CalculatorData): Results => {
    const grossRevenue = data.callPerMinute * data.targetCall * data.pricePerMinute;
    const netRevenue = grossRevenue - data.operationalCosts - data.oneTimePurchase;
    const totalMinutes = data.callPerMinute * data.targetCall;
    const completionDays = totalMinutes / (data.channels * 60 * data.hoursPerDay);
    const roi = (netRevenue / (data.operationalCosts + data.oneTimePurchase)) * 100;

    return {
      grossRevenue,
      netRevenue,
      totalMinutes,
      completionDays,
      roi
    };
  };

  const generateMonthlyProjections = (currentData: CalculatorData, currentResults: Results) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, index) => {
      // Bulan pertama termasuk one-time purchase sebagai expenses
      if (index === 0) {
        // Untuk bulan pertama: gross revenue per bulan - one time purchase per bulan
        const monthlyGrossRevenue = Math.round(currentResults.grossRevenue / 12);
        const monthlyOneTimePurchase = Math.round(currentData.oneTimePurchase / 12);
        const firstMonthRevenue = monthlyGrossRevenue - monthlyOneTimePurchase;
        // Pastikan nilai tidak negatif
        const adjustedFirstMonthRevenue = Math.max(firstMonthRevenue, 0);
        return {
          month,
          current: adjustedFirstMonthRevenue,
          projected: Math.round(adjustedFirstMonthRevenue * 1.15), // 15% optimistic projection
          conservative: Math.round(adjustedFirstMonthRevenue * 0.85) // 15% conservative projection
        };
      } else {
        // Bulan selanjutnya: gross revenue - operational costs (tanpa one-time purchase)
        const monthlyGrossRevenue = Math.round(currentResults.grossRevenue / 12);
        const monthlyRevenue = monthlyGrossRevenue - Math.round(currentData.operationalCosts / 12);
        return {
          month,
          current: monthlyRevenue,
          projected: Math.round(monthlyRevenue * 1.15), // 15% optimistic projection
          conservative: Math.round(monthlyRevenue * 0.85) // 15% conservative projection
        };
      }
    });
  };

  const generateComparisonData = (currentData: CalculatorData, currentResults: Results) => {
    return [
      {
        name: 'Current Scenario',
        grossRevenue: currentResults.grossRevenue,
        netRevenue: currentResults.netRevenue,
        roi: currentResults.roi,
        completionDays: currentResults.completionDays
      },
      ...predefinedScenarios.map(scenario => {
        const scenarioResults = calculateResults(scenario.data);
        return {
          name: scenario.name,
          grossRevenue: scenarioResults.grossRevenue,
          netRevenue: scenarioResults.netRevenue,
          roi: scenarioResults.roi,
          completionDays: scenarioResults.completionDays
        };
      })
    ];
  };

  useEffect(() => {
    const newResults = calculateResults(calculatorData);
    setResults(newResults);
    setMonthlyData(generateMonthlyProjections(calculatorData, newResults));
    setComparisonData(generateComparisonData(calculatorData, newResults));
  }, [calculatorData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Menampilkan angka penuh, bukan notasi kompak
  const formatCurrencyCompact = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleInputChange = (field: keyof CalculatorData, value: number) => {
    setCalculatorData(prev => ({ ...prev, [field]: value }));
    setSelectedScenario(-1); // Custom input
  };

  const selectScenario = (index: number) => {
    setSelectedScenario(index);
    setCalculatorData(predefinedScenarios[index].data);
  };

  const assumptions = [
    {
      title: 'Market Stability',
      description: 'Call demand remains consistent with gross revenue per bulan - one time purchase per bulan di bulan pertama, dan gross revenue - operational costs di bulan-bulan berikutnya',
      impact: 'Medium',
      color: 'blue'
    },
    {
      title: 'Operational Efficiency',
      description: '95% uptime and consistent call quality maintained across all channels',
      impact: 'High',
      color: 'emerald'
    },
    {
      title: 'Price Stability',
      description: `Per-minute pricing remains at IDR ${calculatorData.pricePerMinute} throughout the period`,
      impact: 'Medium',
      color: 'yellow'
    },
    {
      title: 'Channel Utilization',
      description: `All ${calculatorData.channels} channels operating at optimal capacity during ${calculatorData.hoursPerDay} business hours`,
      impact: 'High',
      color: 'purple'
    }
  ];

  const pieData = comparisonData.slice(1).map((item, index) => ({
    name: item.name,
    value: item.netRevenue,
    fill: COLORS[index]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Live Revenue <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Calculator</span>
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Real-time revenue calculations with instant projection updates. Analyze your call center's financial performance dynamically.
          </p>
        </motion.div>

        {/* Scenario Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {predefinedScenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => selectScenario(index)}
                className={`px-6 py-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 font-light ${
                  selectedScenario === index
                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}
                style={{
                  boxShadow: selectedScenario === index 
                    ? '0 0 30px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid xl:grid-cols-3 gap-12 mb-16">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="xl:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 sticky top-28"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <CalcIcon weight="light" size={24} className="text-blue-400" />
                <h3 className="text-xl font-light text-white tracking-tight">Input Parameters</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-light text-slate-300 mb-2">Call Duration (minutes)</label>
                  <input
                    type="number"
                    value={calculatorData.callPerMinute}
                    onChange={(e) => handleInputChange('callPerMinute', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-300 mb-2">Target Calls</label>
                  <input
                    type="number"
                    value={calculatorData.targetCall}
                    onChange={(e) => handleInputChange('targetCall', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-300 mb-2">Price per Minute (IDR)</label>
                  <input
                    type="number"
                    value={calculatorData.pricePerMinute}
                    onChange={(e) => handleInputChange('pricePerMinute', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-slate-300 mb-2">Hours/Day</label>
                    <input
                      type="number"
                      value={calculatorData.hoursPerDay}
                      onChange={(e) => handleInputChange('hoursPerDay', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-slate-300 mb-2">Channels</label>
                    <input
                      type="number"
                      value={calculatorData.channels}
                      onChange={(e) => handleInputChange('channels', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-300 mb-2">One Time Purchase (IDR)</label>
                  <input
                    type="number"
                    value={calculatorData.oneTimePurchase}
                    onChange={(e) => handleInputChange('oneTimePurchase', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-slate-300 mb-2">Operational Costs (IDR)</label>
                  <input
                    type="number"
                    value={calculatorData.operationalCosts}
                    onChange={(e) => handleInputChange('operationalCosts', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results and Charts Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="xl:col-span-2 space-y-12"
          >
            {results && (
              <>
                {/* Current Results */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <TrendUp weight="light" size={24} className="text-emerald-400" />
                    <h3 className="text-xl font-light text-white tracking-tight">Live Results</h3>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl border border-blue-400/20 overflow-hidden">
                      <p className="text-sm font-light text-slate-300 mb-1">Gross Revenue</p>
                      <p className="text-xl font-medium text-white truncate" title={formatCurrencyCompact(results.grossRevenue)}>{formatCurrencyCompact(results.grossRevenue)}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 rounded-2xl border border-emerald-400/20 overflow-hidden">
                      <p className="text-sm font-light text-slate-300 mb-1">Net Revenue</p>
                      <p className="text-xl font-medium text-white truncate" title={formatCurrencyCompact(results.netRevenue)}>{formatCurrencyCompact(results.netRevenue)}</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock weight="light" size={16} className="text-blue-400" />
                        <p className="text-sm font-light text-slate-300">Completion</p>
                      </div>
                      <p className="text-lg font-medium text-white truncate">{Math.round(results.completionDays)} days</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                      <div className="flex items-center space-x-2 mb-2">
                        <Coins weight="light" size={16} className="text-emerald-400" />
                        <p className="text-sm font-light text-slate-300">ROI</p>
                      </div>
                      <p className="text-lg font-medium text-white truncate">{results.roi.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* Monthly Projection Chart */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
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
                      <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={formatCurrencyCompact} width={120} />
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
                      <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={3} name="Current Scenario" />
                      <Line type="monotone" dataKey="projected" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Optimistic" />
                      <Line type="monotone" dataKey="conservative" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Conservative" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Yearly Projection Table */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <ChartLine weight="light" size={24} className="text-emerald-400" />
                    <h3 className="text-xl font-light text-white tracking-tight">Yearly Revenue Projection</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-3 px-4 text-slate-300 font-light">Month</th>
                          <th className="py-3 px-4 text-slate-300 font-light">Current Scenario</th>
                          <th className="py-3 px-4 text-slate-300 font-light">Optimistic</th>
                          <th className="py-3 px-4 text-slate-300 font-light">Conservative</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((data, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 text-white font-light">{data.month}</td>
                            <td className="py-3 px-4 text-white font-light overflow-hidden">
                              <span className="inline-block max-w-[150px] truncate" title={formatCurrencyCompact(data.current)}>
                                {formatCurrencyCompact(data.current)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-emerald-400 font-light overflow-hidden">
                              <span className="inline-block max-w-[150px] truncate" title={formatCurrencyCompact(data.projected)}>
                                {formatCurrencyCompact(data.projected)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-yellow-400 font-light overflow-hidden">
                              <span className="inline-block max-w-[150px] truncate" title={formatCurrencyCompact(data.conservative)}>
                                {formatCurrencyCompact(data.conservative)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-white/5">
                          <td className="py-3 px-4 text-white font-medium">Total</td>
                          <td className="py-3 px-4 text-white font-medium overflow-hidden">
                            <span className="inline-block max-w-[150px] truncate" title={formatCurrencyCompact(monthlyData.reduce((sum, data) => sum + data.current, 0))}>
                              {formatCurrencyCompact(monthlyData.reduce((sum, data) => sum + data.current, 0))}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-emerald-400 font-medium overflow-hidden">
                            <span className="inline-block max-w-[150px] truncate" title={formatCurrencyCompact(monthlyData.reduce((sum, data) => sum + data.projected, 0))}>
                              {formatCurrencyCompact(monthlyData.reduce((sum, data) => sum + data.projected, 0))}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-yellow-400 font-medium overflow-hidden">
                            <span className="inline-block max-w-[150px] truncate" title={formatCurrencyCompact(monthlyData.reduce((sum, data) => sum + data.conservative, 0))}>
                              {formatCurrencyCompact(monthlyData.reduce((sum, data) => sum + data.conservative, 0))}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Comparison Charts */}
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* ROI Comparison */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                    style={{
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <TrendUp weight="light" size={24} className="text-emerald-400" />
                      <h3 className="text-xl font-light text-white tracking-tight">ROI Comparison</h3>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                        <YAxis stroke="#94A3B8" fontSize={12} width={80} />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
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
                  </div>

                  {/* Revenue Distribution */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                    style={{
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Target weight="light" size={24} className="text-yellow-400" />
                      <h3 className="text-xl font-light text-white tracking-tight">Package Comparison</h3>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ payload, percent }) => `${payload.name} ${(percent * 100).toFixed(0)}%`}
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
                </div>

                {/* Key Metrics */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <h3 className="text-lg font-light text-white tracking-tight mb-6">Key Metrics</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl overflow-hidden">
                      <span className="text-slate-400 font-light text-sm">Total Minutes</span>
                      <span className="text-white font-medium truncate ml-2" title={results.totalMinutes.toLocaleString()}>{results.totalMinutes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl overflow-hidden">
                      <span className="text-slate-400 font-light text-sm">Daily Capacity</span>
                      <span className="text-white font-medium truncate ml-2" title={`${(calculatorData.channels * 60 * calculatorData.hoursPerDay).toLocaleString()} min`}>{(calculatorData.channels * 60 * calculatorData.hoursPerDay).toLocaleString()} min</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl overflow-hidden">
                      <span className="text-slate-400 font-light text-sm">Total Investment</span>
                      <span className="text-white font-medium truncate ml-2" title={formatCurrencyCompact(calculatorData.operationalCosts + calculatorData.oneTimePurchase)}>{formatCurrencyCompact(calculatorData.operationalCosts + calculatorData.oneTimePurchase)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl overflow-hidden">
                      <span className="text-slate-400 font-light text-sm">Break-even</span>
                      <span className="text-white font-medium truncate ml-2">{Math.round(results.completionDays * 0.7)} days</span>
                    </div>
                  </div>
                </div>

                {/* Business Assumptions */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Lightbulb weight="light" size={24} className="text-yellow-400" />
                    <h3 className="text-xl font-light text-white tracking-tight">Live Business Assumptions</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
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

                  <div className="mt-10 p-6 bg-blue-500/10 rounded-2xl border border-blue-400/20">
                    <h4 className="text-lg font-medium text-white mb-3">Live Insights</h4>
                    <ul className="space-y-2 text-slate-300 font-light">
                      <li className="flex">
                        <span className="mr-2">•</span>
                        <span>Current scenario offers {results.roi.toFixed(1)}% ROI over {Math.round(results.completionDays)} days</span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">•</span>
                        <span>Monthly revenue projection shows gross revenue - one time purchase per month in first month, and gross revenue - operational costs in subsequent months</span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">•</span>
                        <span>Break-even point estimated at {Math.round(results.completionDays * 0.7)} days</span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">•</span>
                        <span className="truncate" title={`Total investment of ${formatCurrencyCompact(calculatorData.operationalCosts + calculatorData.oneTimePurchase)} generates ${formatCurrencyCompact(results.netRevenue)} net profit`}>
                          Total investment of {formatCurrencyCompact(calculatorData.operationalCosts + calculatorData.oneTimePurchase)} generates {formatCurrencyCompact(results.netRevenue)} net profit
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}