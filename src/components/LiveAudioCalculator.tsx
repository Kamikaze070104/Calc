import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calculator as CalcIcon, TrendUp, Clock, Coins, ChartLine, Target, Lightbulb } from '@phosphor-icons/react';

interface B2CPackageData {
  depositAmount: number;
  targetUsers: number;
  pricePerMinute: number;
}

interface LiveAudioData {
  basePricePerMinute: number;
  b2cPackage: B2CPackageData;
  oneTimePurchase: number; // Tetap ada di interface tapi tidak digunakan
  operationalCosts: number;
}

interface B2CResult {
  depositAmount: number;
  targetUsers: number;
  pricePerMinute: number;
  totalDeposit: number;
  estimatedMinutes: number;
  costToServe: number;
  netRevenue: number;
}

interface Results {
  b2cResult: B2CResult;
  totalGrossRevenue: number;
  totalCostToServe: number;
  operationalCost: number;
  oneTimeCost: number; // Tetap ada di interface tapi tidak digunakan
  totalNetRevenue: number;
  roi: number;
}

export default function LiveAudioCalculator() {
  const [showAssumptions, setShowAssumptions] = useState(true);
  const [data, setData] = useState<LiveAudioData>({
    basePricePerMinute: 200,
    b2cPackage: {
      depositAmount: 100000,
      targetUsers: 10000,
      pricePerMinute: 300,
    },
    oneTimePurchase: 0,
    operationalCosts: 5000000,
  });

  const [results, setResults] = useState<Results | null>(null);

  // Calculate results whenever data changes
  useEffect(() => {
    calculateResults();
  }, [data]);

  const calculateResults = () => {
    // Calculate for B2C package
    // Total deposit adalah jumlah deposit per user dikalikan jumlah target user
    const totalDeposit = data.b2cPackage.depositAmount * data.b2cPackage.targetUsers;
    
    // Estimasi jumlah menit yang digunakan berdasarkan deposit dan harga per menit
    const estimatedMinutes = data.b2cPackage.pricePerMinute > 0 ? 
      totalDeposit / data.b2cPackage.pricePerMinute : 0;
    
    // Biaya layanan dihitung berdasarkan base price per minute
    const costToServe = data.basePricePerMinute * estimatedMinutes;
    
    // Net revenue adalah selisih antara total deposit dengan biaya layanan
    const netRevenue = totalDeposit - costToServe;
    
    // Calculate total business metrics
    const totalGrossRevenue = totalDeposit;
    const totalCostToServe = costToServe;
    const operationalCost = data.operationalCosts;
    const oneTimeCost = 0; // Menghilangkan One-Time Purchase Cost
    const totalNetRevenue = totalGrossRevenue - totalCostToServe - operationalCost;
    
    // ROI = (Net Revenue / Total Investment) * 100
    // Jika totalNetRevenue negatif, ROI juga negatif
    const totalInvestment = operationalCost;
    const roi = totalInvestment > 0 ? (totalNetRevenue / totalInvestment) * 100 : 0;

    setResults({
      b2cResult: {
        depositAmount: data.b2cPackage.depositAmount,
        targetUsers: data.b2cPackage.targetUsers,
        pricePerMinute: data.b2cPackage.pricePerMinute,
        totalDeposit,
        estimatedMinutes,
        costToServe,
        netRevenue,
      },
      totalGrossRevenue,
      totalCostToServe,
      operationalCost,
      oneTimeCost,
      totalNetRevenue,
      roi,
    });
  };

  const handleInputChange = (field: string, value: number) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleB2CPackageChange = (field: string, value: number) => {
    setData({
      ...data,
      b2cPackage: {
        ...data.b2cPackage,
        [field]: value,
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyCompact = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} M`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} Jt`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} Rb`;
    }
    return value.toString();
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  return (
    <div className="pt-24 pb-16 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
          Live Audio <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Calculator</span>
        </h2>
        <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
          Real-time revenue calculations with instant projection updates. Analyze your live audio service's financial performance dynamically.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bagian Input */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
          >
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <Coins className="mr-2" size={20} />
              Parameter Dasar
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Harga Dasar per Menit (Rp)
                </label>
                <input
                  type="number"
                  value={data.basePricePerMinute}
                  onChange={(e) => handleInputChange('basePricePerMinute', Number(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Harga dasar produksi layanan voice (sebelum markup atau margin paket)
                </p>
              </div>



              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Biaya Operasional Bulanan (Rp)
                </label>
                <input
                  type="number"
                  value={data.operationalCosts}
                  onChange={(e) => handleInputChange('operationalCosts', Number(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Infrastruktur, tim, support, hosting, dll
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
          >
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <Target className="mr-2" size={20} />
              Paket B2C
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-slate-200 mb-3">Parameter B2C</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Uang Deposit (Rp)
                    </label>
                    <input
                      type="number"
                      value={data.b2cPackage.depositAmount}
                      onChange={(e) => handleB2CPackageChange('depositAmount', Number(e.target.value))}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Jumlah deposit per user
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Target User
                    </label>
                    <input
                      type="number"
                      value={data.b2cPackage.targetUsers}
                      onChange={(e) => handleB2CPackageChange('targetUsers', Number(e.target.value))}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Jumlah target pengguna
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Harga Per Menit (Rp)
                  </label>
                  <input
                    type="number"
                    value={data.b2cPackage.pricePerMinute}
                    onChange={(e) => handleB2CPackageChange('pricePerMinute', Number(e.target.value))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Harga per menit penggunaan layanan voice AI
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assumptions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden"
          >
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-700/30 transition-colors"
              onClick={() => setShowAssumptions(!showAssumptions)}
            >
              <h2 className="text-lg font-medium text-white flex items-center">
                <Lightbulb className="mr-2" size={20} />
                Panel Asumsi
              </h2>
              <div className="text-slate-400">
                {showAssumptions ? '−' : '+'}
              </div>
            </div>
            
            {showAssumptions && (
              <div className="p-4 pt-0 border-t border-slate-700/50">
                <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2">
                  <li>Harga dasar per menit mencerminkan total biaya backend/API/infrastruktur</li>
                  <li>Quota per paket bisa fixed (misal: 600 menit di Basic) atau unlimited dengan FUP</li>
                  <li>Revenue per paket dihitung sebelum potongan diskon atau pajak</li>
                  <li>Kapasitas layanan tak dibatasi secara waktu karena sistem concurrency</li>
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bagian Hasil */}
        <div className="lg:col-span-2 space-y-6">
          {/* Kartu Ringkasan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur border border-blue-500/30 rounded-xl p-4">
              <div className="text-blue-300 text-sm font-medium mb-1 flex items-center">
                <Coins size={16} className="mr-1" />
                Total Pendapatan Kotor
              </div>
              <div className="text-white text-2xl font-semibold">
                {results ? formatCurrency(results.totalGrossRevenue) : '-'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur border border-green-500/30 rounded-xl p-4">
              <div className="text-green-300 text-sm font-medium mb-1 flex items-center">
                <TrendUp size={16} className="mr-1" />
                Total Pendapatan Bersih
              </div>
              <div className="text-white text-2xl font-semibold">
                {results ? formatCurrency(results.totalNetRevenue) : '-'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-300 text-sm font-medium mb-1 flex items-center">
                <ChartLine size={16} className="mr-1" />
                Tingkat Pengembalian Investasi (ROI)
              </div>
              <div className="text-white text-2xl font-semibold">
                {results ? `${results.roi.toFixed(1)}%` : '-'}
              </div>
            </div>
          </motion.div>

          {/* Kartu Ringkasan Proyeksi B2C */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
          >
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <ChartLine className="mr-2" size={20} />
              Proyeksi B2C
            </h2>
            
            {results && (
              <div className="space-y-6">
                {/* Kartu Metrik Utama */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur border border-indigo-500/30 rounded-xl p-4">
                    <div className="text-indigo-300 text-xs font-medium mb-1">Total Deposit</div>
                    <div className="text-white text-xl font-semibold">{formatCurrency(results.b2cResult.totalDeposit)}</div>
                    <div className="text-indigo-200 text-xs mt-2 flex items-center justify-between">
                      <span>{formatNumber(results.b2cResult.targetUsers)} users</span>
                      <span>@{formatCurrency(results.b2cResult.depositAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur border border-blue-500/30 rounded-xl p-4">
                    <div className="text-blue-300 text-xs font-medium mb-1">Estimasi Penggunaan</div>
                    <div className="text-white text-xl font-semibold">{formatNumber(Math.round(results.b2cResult.estimatedMinutes))} menit</div>
                    <div className="text-blue-200 text-xs mt-2 flex items-center justify-between">
                      <span>Harga/Menit</span>
                      <span>{formatCurrency(results.b2cResult.pricePerMinute)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur border border-red-500/30 rounded-xl p-4">
                    <div className="text-red-300 text-xs font-medium mb-1">Biaya Layanan</div>
                    <div className="text-white text-xl font-semibold">{formatCurrency(results.b2cResult.costToServe)}</div>
                    <div className="text-red-200 text-xs mt-2 flex items-center justify-between">
                      <span>Harga Dasar/Menit</span>
                      <span>{formatCurrency(data.basePricePerMinute)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-300 text-xs font-medium mb-1">Net Revenue</div>
                    <div className="text-white text-xl font-semibold">{formatCurrency(results.b2cResult.netRevenue)}</div>
                    <div className="text-green-200 text-xs mt-2 flex items-center justify-between">
                      <span>Margin Keuntungan</span>
                      <span>{((results.b2cResult.netRevenue / results.b2cResult.totalDeposit) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Tombol untuk tampilan detail */}
                <div className="mt-4">
                  <button 
                    onClick={() => setShowAssumptions(!showAssumptions)}
                    className="text-sm text-slate-400 hover:text-white flex items-center transition-colors"
                  >
                    <span className="mr-1">{showAssumptions ? 'Sembunyikan' : 'Tampilkan'} detail</span>
                    <span>{showAssumptions ? '−' : '+'}</span>
                  </button>
                  
                  {showAssumptions && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs uppercase bg-slate-700/50 text-slate-300">
                          <tr>
                            <th className="py-2 px-3 rounded-tl-lg">Deposit/User</th>
                            <th className="py-2 px-3">Target Users</th>
                            <th className="py-2 px-3">Price/Min</th>
                            <th className="py-2 px-3">Est. Minutes</th>
                            <th className="py-2 px-3">Biaya Layanan</th>
                            <th className="py-2 px-3 rounded-tr-lg">Net Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-slate-800/30">
                            <td className="py-2 px-3 font-medium">{formatCurrency(results.b2cResult.depositAmount)}</td>
                            <td className="py-2 px-3">{formatNumber(results.b2cResult.targetUsers)}</td>
                            <td className="py-2 px-3">{formatCurrency(results.b2cResult.pricePerMinute)}</td>
                            <td className="py-2 px-3">{formatNumber(Math.round(results.b2cResult.estimatedMinutes))} menit</td>
                            <td className="py-2 px-3">{formatCurrency(results.b2cResult.costToServe)}</td>
                            <td className="py-2 px-3 font-medium text-green-400">{formatCurrency(results.b2cResult.netRevenue)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Operational Cost:</div>
                <div className="text-white font-medium">{results ? formatCurrency(results.operationalCost) : '-'}</div>
              </div>
            </div>
          </motion.div>

          {/* Revenue Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
          >
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <ChartLine className="mr-2" size={20} />
              Ringkasan Pendapatan
            </h2>

            {results && (
              <div className="space-y-6">
                {/* Metrik Keuangan Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Kartu Rincian Pendapatan */}
                  <div className="bg-slate-700/30 rounded-lg p-5">
                    <h3 className="text-white text-md font-medium mb-3">Rincian Keuangan</h3>
                    
                    
                    <div className="space-y-3">
                      {/* Total Deposit with percentage bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm text-slate-300">Total Deposit:</div>
                          <div className="text-sm font-medium text-white">{formatCurrency(results.totalGrossRevenue)}</div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <div className="text-xs text-slate-400 text-right mt-1">
                          Total uang deposit x {results.b2cResult.targetUsers} = {formatCurrency(results.b2cResult.depositAmount * results.b2cResult.targetUsers)}
                        </div>
                      </div>
                      
                      {/* Biaya Layanan with percentage bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm text-slate-300">Biaya Layanan:</div>
                          <div className="text-sm font-medium text-white">{formatCurrency(results.totalCostToServe)}</div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(results.totalCostToServe / results.totalGrossRevenue) * 100}%` }}></div>
                        </div>
                        <div className="text-xs text-slate-400 text-right mt-1">
                          {((results.totalCostToServe / results.totalGrossRevenue) * 100).toFixed(1)}% dari total deposit
                        </div>
                        
                      </div>
                      
                      {/* Operational Cost with percentage bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm text-slate-300">Biaya Operasional:</div>
                        <div className="text-sm font-medium text-white">{formatCurrency(results.operationalCost)}</div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(results.operationalCost / results.totalGrossRevenue) * 100}%` }}></div>
                        </div>
                        <div className="text-xs text-slate-400 text-right mt-1">
                          {((results.operationalCost / results.totalGrossRevenue) * 100).toFixed(1)}% dari total deposit
                        </div>
                      </div>
                      

                    </div>
                  </div>
                  
                  {/* Kartu Pendapatan Bersih dan ROI */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur border border-blue-500/30 rounded-lg p-5">
                    <h3 className="text-blue-300 text-md font-medium mb-4">Hasil Akhir</h3>
                    
                    <div className="space-y-6">
                      {/* Pendapatan Bersih */}
                      <div>
                        <div className="text-blue-300 text-sm mb-1">Pendapatan Bersih</div>
                        <div className="text-white text-3xl font-semibold">
                          {formatCurrency(results.totalNetRevenue)}
                        </div>
                        <div className="text-blue-200 text-sm mt-2">
                          {((results.totalNetRevenue / results.totalGrossRevenue) * 100).toFixed(1)}% dari total deposit
                        </div>
                      </div>
                      
                      {/* ROI dengan indikator visual */}
                      <div>
                        <div className="text-blue-300 text-sm mb-1">Tingkat Pengembalian Investasi (ROI)</div>
                        <div className="text-white text-3xl font-semibold">
                          {`${results.roi.toFixed(1)}%`}
                        </div>
                        <div className="mt-2 w-full bg-slate-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${results.roi < 0 ? 'bg-red-500' : results.roi < 50 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(Math.max(results.roi, 0), 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-blue-200 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}