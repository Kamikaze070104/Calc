import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, TrendUp, Clock, Coins } from '@phosphor-icons/react';

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
    name: 'Premium Package',
    data: {
      callPerMinute: 3,
      targetCall: 1500000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 32,
      oneTimePurchase: 100000000,
      operationalCosts: 500000000
    }
  },
  {
    name: 'Standard Package',
    data: {
      callPerMinute: 3,
      targetCall: 500000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 32,
      oneTimePurchase: 50000000,
      operationalCosts: 200000000
    }
  },
  {
    name: 'Starter Package',
    data: {
      callPerMinute: 3,
      targetCall: 300000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 32,
      oneTimePurchase: 25000000,
      operationalCosts: 150000000
    }
  }
];

export default function Calculator() {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>(predefinedScenarios[0].data);
  const [results, setResults] = useState<Results | null>(null);
  const [selectedScenario, setSelectedScenario] = useState(0);

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

  useEffect(() => {
    const newResults = calculateResults(calculatorData);
    setResults(newResults);
  }, [calculatorData]);

  const formatCurrency = (value: number) => {
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
            Revenue <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Calculator</span>
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Calculate your call center's gross and net revenue with precision. Analyze ROI and completion timelines.
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
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
              <CalcIcon weight="light" size={24} className="text-blue-400" />
              <h3 className="text-xl font-light text-white tracking-tight">Input Parameters</h3>
            </div>

            <div className="space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
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
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {results && (
              <>
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <TrendUp weight="light" size={24} className="text-emerald-400" />
                    <h3 className="text-xl font-light text-white tracking-tight">Revenue Analysis</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl border border-blue-400/20">
                      <p className="text-sm font-light text-slate-300 mb-1">Gross Revenue</p>
                      <p className="text-2xl font-medium text-white">{formatCurrency(results.grossRevenue)}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 rounded-2xl border border-emerald-400/20">
                      <p className="text-sm font-light text-slate-300 mb-1">Net Revenue</p>
                      <p className="text-2xl font-medium text-white">{formatCurrency(results.netRevenue)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock weight="light" size={16} className="text-blue-400" />
                          <p className="text-sm font-light text-slate-300">Completion</p>
                        </div>
                        <p className="text-lg font-medium text-white">{Math.round(results.completionDays)} days</p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center space-x-2 mb-2">
                          <Coins weight="light" size={16} className="text-emerald-400" />
                          <p className="text-sm font-light text-slate-300">ROI</p>
                        </div>
                        <p className="text-lg font-medium text-white">{results.roi.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <h3 className="text-lg font-light text-white tracking-tight mb-4">Key Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-light">Total Minutes</span>
                      <span className="text-white">{results.totalMinutes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-light">Daily Capacity</span>
                      <span className="text-white">{(calculatorData.channels * 60 * calculatorData.hoursPerDay).toLocaleString()} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-light">Total Investment</span>
                      <span className="text-white">{formatCurrency(calculatorData.operationalCosts + calculatorData.oneTimePurchase)}</span>
                    </div>
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