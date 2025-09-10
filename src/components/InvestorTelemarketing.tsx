import React from 'react';
import { motion } from 'framer-motion';
import { ChartLine, TrendUp, CurrencyCircleDollar, Briefcase, Target, Calculator, DownloadSimple } from '@phosphor-icons/react';
import { generatePDF } from '../utils/pdfGenerator';

// Formatter untuk angka currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Formatter untuk angka currency yang lebih ringkas
const formatCurrencyCompact = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)} M`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} Jt`;
  }
  return formatCurrency(value);
};

export default function InvestorTelemarketing() {
  // Handler untuk download PDF
  const handleDownloadPDF = async () => {
    const result = await generatePDF('investor-telemarketing', 'Laporan_Investor_Telemarketing');
    if (result) {
      console.log('PDF berhasil diunduh');
    } else {
      console.error('Gagal mengunduh PDF');
    }
  };
  // Data telemarketing berdasarkan input pengguna
  const data = {
    title: 'Telemarketing Solution',
    targetUsers: 500000, // Target pengguna
    callDuration: 3, // Durasi panggilan dalam menit
    pricePerMinute: 450, // Harga per menit
    hoursPerDay: 12, // Jam per hari
    channels: 72, // Jumlah channel
    onetimeCost: 215500000, // Biaya satu kali
    operationalCost: 91942620, // Biaya operasional
    taxRate: 11, // Persentase pajak
    grossRevenue: 675000000, // Pendapatan kotor
    netRevenue: 451838115, // Pendapatan bersih
    completion: 29, // Hari penyelesaian
    roi: 180.2, // ROI dalam persentase
    taxAmount: 49702193, // Jumlah pajak
    afterTaxRevenue: 402135922 // Pendapatan setelah pajak
  };

  return (
    <div id="investor-telemarketing">
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Telemarketing <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Investor Projection</span>
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Proyeksi pendapatan dan profitabilitas dari Telemarketing untuk presentasi investor.
          </p>
        </motion.div>
      
      {/* Asumsi Dasar Proyeksi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg mb-8 md:mb-10"
      >
        <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-3">
          <Target weight="light" size={20} className="mr-2 text-yellow-400" />
          Asumsi Proyeksi Telemarketing
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          Proyeksi Telemarketing didasarkan pada target 500.000 pengguna dengan durasi panggilan rata-rata 3 menit. 
          Dengan harga per menit Rp 450, operasional 12 jam per hari, dan 48 channel, proyeksi ini menghasilkan ROI 106,2% 
          dengan waktu penyelesaian 26 hari.
        </p>
      </motion.div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur border border-blue-500/20 rounded-xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
              <CurrencyCircleDollar size={24} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Gross Revenue</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{formatCurrency(data.grossRevenue)}</p>
          <p className="text-sm text-slate-400">Pendapatan kotor dari seluruh panggilan</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 backdrop-blur border border-emerald-500/20 rounded-xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
              <CurrencyCircleDollar size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Net Revenue</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{formatCurrency(data.netRevenue)}</p>
          <p className="text-sm text-slate-400">Pendapatan bersih setelah biaya operasional</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur border border-purple-500/20 rounded-xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
              <TrendUp size={24} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">ROI</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{data.roi}%</p>
          <p className="text-sm text-slate-400">Return on Investment</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 backdrop-blur border border-amber-500/20 rounded-xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
              <Calculator size={24} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Completion</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{data.completion} Hari</p>
          <p className="text-sm text-slate-400">Waktu penyelesaian target</p>
        </motion.div>
      </div>

      {/* Detail Finansial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4">
            <Briefcase weight="light" size={20} className="mr-2 text-blue-400" />
            Parameter Bisnis
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Target Calls</span>
              <span className="text-slate-200 font-medium">{data.targetUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Call Duration</span>
              <span className="text-slate-200 font-medium">{data.callDuration} menit</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Price per Minute</span>
              <span className="text-slate-200 font-medium">Rp {data.pricePerMinute.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Hours/Day</span>
              <span className="text-slate-200 font-medium">{data.hoursPerDay} jam</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Channels</span>
              <span className="text-slate-200 font-medium">{data.channels}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">One Time Purchase</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.onetimeCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Operational Costs</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.operationalCost)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4">
            <ChartLine weight="light" size={20} className="mr-2 text-green-400" />
            Hasil Finansial
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Gross Revenue</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.grossRevenue)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Net Revenue</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.netRevenue)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Tax Rate</span>
              <span className="text-slate-200 font-medium">{data.taxRate}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Tax Amount</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.taxAmount)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">After Tax Revenue</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.afterTaxRevenue)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">ROI</span>
              <span className="text-slate-200 font-medium">{data.roi}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Completion Time</span>
              <span className="text-slate-200 font-medium">{data.completion} hari</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Proyeksi Bulan Kedua */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="bg-gradient-to-br from-indigo-600/30 to-indigo-800/30 backdrop-blur rounded-xl p-6 md:p-8 border border-indigo-500/30 shadow-lg mb-8 md:mb-12"
      >
        <h2 className="text-xl md:text-2xl font-medium text-white mb-4 flex items-center">
          <ChartLine weight="light" size={24} className="mr-3 text-indigo-400" />
          Proyeksi Bulan Kedua (Tanpa One Time Purchase)
        </h2>
        <p className="text-slate-300 mb-6">
          Pada bulan kedua dan selanjutnya, tanpa biaya one time purchase, proyeksi finansial akan meningkat signifikan:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur rounded-xl p-4 border border-slate-700/30 shadow-lg">
            <h3 className="text-lg font-medium text-indigo-300 mb-2">Gross Revenue</h3>
            <p className="text-2xl font-light text-white mb-1">{formatCurrency(data.grossRevenue)}</p>
            <p className="text-sm text-slate-400">Pendapatan kotor bulanan</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur rounded-xl p-4 border border-slate-700/30 shadow-lg">
            <h3 className="text-lg font-medium text-indigo-300 mb-2">Net Revenue</h3>
            <p className="text-2xl font-light text-white mb-1">{formatCurrency(data.grossRevenue - data.operationalCost)}</p>
            <p className="text-sm text-slate-400">Pendapatan bersih tanpa biaya one time</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur rounded-xl p-4 border border-slate-700/30 shadow-lg">
            <h3 className="text-lg font-medium text-indigo-300 mb-2">ROI</h3>
            <p className="text-2xl font-light text-white mb-1">{((data.grossRevenue - data.operationalCost) / data.operationalCost * 100).toFixed(1)}%</p>
            <p className="text-sm text-slate-400">Return on Investment bulanan</p>
          </div>
        </div>
        
        <p className="text-slate-300 text-center">
          Tanpa biaya one time purchase sebesar {formatCurrency(data.onetimeCost)}, ROI bulanan meningkat signifikan menjadi {((data.grossRevenue - data.operationalCost) / data.operationalCost * 100).toFixed(1)}%.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 backdrop-blur rounded-xl p-6 md:p-8 border border-blue-500/30 shadow-lg text-center"
      >
        <h2 className="text-xl md:text-2xl font-medium text-white mb-4">Kesimpulan Investasi</h2>
        <p className="text-slate-300 mb-6 max-w-3xl mx-auto">
          Solusi Telemarketing menawarkan ROI yang sangat menarik sebesar {data.roi}% dengan waktu penyelesaian hanya {data.completion} hari.
          Dengan investasi awal Rp {formatCurrencyCompact(data.onetimeCost)} dan biaya operasional Rp {formatCurrencyCompact(data.operationalCost)} per bulan, 
          proyeksi pendapatan bersih mencapai Rp {formatCurrencyCompact(data.netRevenue)} sebelum pajak dan Rp {formatCurrencyCompact(data.afterTaxRevenue)} setelah pajak.
          Margin keuntungan mencapai {((data.netRevenue / data.grossRevenue) * 100).toFixed(1)}% dari total pendapatan kotor.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => generatePDF('investor-telemarketing', 'Laporan_Investor_Telemarketing')} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <DownloadSimple size={20} />
            Download Laporan Investor (PDF)
          </button>
        </div>
      </motion.div>
    </div>
    </div>
  );
}