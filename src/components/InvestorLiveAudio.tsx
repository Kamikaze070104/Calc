import React from 'react';
import { motion } from 'framer-motion';
import { ChartLine, TrendUp, CurrencyCircleDollar, Briefcase, Target, Calculator, Microphone, DownloadSimple } from '@phosphor-icons/react';
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

export default function InvestorLiveAudio() {
  // Handler untuk download PDF
  const handleDownloadPDF = async () => {
    const result = await generatePDF('investor-liveaudio', 'Laporan_Investor_LiveAudio');
    if (result) {
      console.log('PDF berhasil diunduh');
    } else {
      console.error('Gagal mengunduh PDF');
    }
  };
  // Data Live Audio berdasarkan input pengguna
  const data = {
    title: 'Live Audio Solution',
    targetUsers: 10000, // Target pengguna
    depositAmount: 100000, // Jumlah deposit per user
    pricePerMinute: 300, // Harga per menit
    basePricePerMinute: 200, // Harga dasar per menit
    operationalCost: 5000000, // Biaya operasional bulanan
    avgUsageMinutes: 333.33, // Asumsi penggunaan rata-rata per bulan (menit)
    totalDeposit: 1000000000, // Total deposit dari semua pengguna
    serviceExpense: 666666667, // Biaya layanan (66.7% dari total deposit)
    monthlyRevenue: 83333333, // Pendapatan bulanan
    yearlyRevenue: 1000000000, // Pendapatan tahunan (total deposit)
    yearlyProfit: 328333333, // Profit tahunan
    roi: 6566.7 // ROI dalam persentase
  };

  // Menghitung margin per menit
  const marginPerMinute = data.pricePerMinute - data.basePricePerMinute;
  const marginPercentage = (marginPerMinute / data.basePricePerMinute);

  return (
    <div id="investor-liveaudio">
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-light mb-3">
          <span className="text-purple-400 font-medium">Live Audio</span> Investor Projection
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm md:text-base mb-6">
          Proyeksi pendapatan dan profitabilitas dari solusi Live Audio untuk presentasi investor.
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
          <Target weight="light" size={20} className="mr-2 text-purple-400" />
          Asumsi Proyeksi Live Audio
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          Proyeksi Live Audio didasarkan pada target {data.targetUsers.toLocaleString()} pengguna dengan deposit awal Rp {data.depositAmount.toLocaleString()} per pengguna. 
          Dengan harga jual Rp {data.pricePerMinute} per menit (harga dasar Rp {data.basePricePerMinute}), biaya operasional bulanan Rp {data.operationalCost.toLocaleString()}, 
          total deposit mencapai Rp {data.totalDeposit.toLocaleString()} dengan biaya layanan sebesar Rp {data.serviceExpense.toLocaleString()} (66.7% dari total deposit).
          Proyeksi ini menghasilkan pendapatan bersih Rp {data.yearlyProfit.toLocaleString()} dengan ROI {data.roi.toFixed(1)}%.
        </p>
      </motion.div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur border border-purple-500/20 rounded-xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
              <CurrencyCircleDollar size={24} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Total Deposit</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{formatCurrency(data.totalDeposit)}</p>
          <p className="text-sm text-slate-400">Total deposit dari {data.targetUsers.toLocaleString()} pengguna</p>
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
            <h3 className="text-lg font-medium text-slate-200">Pendapatan Bersih</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{formatCurrency(data.yearlyProfit)}</p>
          <p className="text-sm text-slate-400">Pendapatan bersih setelah biaya layanan dan operasional</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-pink-600/20 to-pink-700/20 backdrop-blur border border-pink-500/20 rounded-xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
              <TrendUp size={24} className="text-pink-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">ROI</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{data.roi.toFixed(1)}%</p>
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
            <h3 className="text-lg font-medium text-slate-200">Target Users</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{data.targetUsers.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Jumlah pengguna yang ditargetkan</p>
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
            <Briefcase weight="light" size={20} className="mr-2 text-purple-400" />
            Parameter Bisnis
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Target Users</span>
              <span className="text-slate-200 font-medium">{data.targetUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Deposit per User</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.depositAmount)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Base Price per Minute</span>
              <span className="text-slate-200 font-medium">Rp {data.basePricePerMinute.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Selling Price per Minute</span>
              <span className="text-slate-200 font-medium">Rp {data.pricePerMinute.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Margin per Minute</span>
              <span className="text-slate-200 font-medium">Rp {marginPerMinute.toLocaleString()} ({marginPercentage.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Avg. Usage per User</span>
              <span className="text-slate-200 font-medium">{data.avgUsageMinutes} menit/bulan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Operational Costs</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.operationalCost)}/bulan</span>
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
              <span className="text-slate-400">Total Deposit</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.totalDeposit)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Biaya Layanan</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.serviceExpense)} (66.7%)</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Biaya Operasional</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.operationalCost)}/bulan</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Estimasi Penggunaan</span>
              <span className="text-slate-200 font-medium">{(data.totalDeposit / data.pricePerMinute).toLocaleString()} menit</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Pendapatan Bersih</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.yearlyProfit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">ROI</span>
              <span className="text-slate-200 font-medium">{data.roi.toFixed(1)}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Proyeksi Pertumbuhan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg mb-8 md:mb-12"
      >
        <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4">
          <Microphone weight="light" size={20} className="mr-2 text-purple-400" />
          Proyeksi Pertumbuhan 3 Tahun
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 text-slate-400 font-medium">Periode</th>
                <th className="text-right py-3 text-slate-400 font-medium">Users</th>
                <th className="text-right py-3 text-slate-400 font-medium">Total Deposit</th>
                <th className="text-right py-3 text-slate-400 font-medium">Pendapatan Bersih</th>
                <th className="text-right py-3 text-slate-400 font-medium">ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 text-slate-300">Tahun 1</td>
                <td className="py-3 text-slate-300 text-right">{data.targetUsers.toLocaleString()}</td>
                <td className="py-3 text-slate-300 text-right">{formatCurrency(data.totalDeposit)}</td>
                <td className="py-3 text-slate-300 text-right">{formatCurrency(data.yearlyProfit)}</td>
                <td className="py-3 text-slate-300 text-right">{data.roi.toFixed(1)}%</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-3 text-slate-300">Tahun 2</td>
                <td className="py-3 text-slate-300 text-right">{Math.round(data.targetUsers * 1.5).toLocaleString()}</td>
                <td className="py-3 text-slate-300 text-right">{formatCurrency(data.totalDeposit * 1.5)}</td>
                <td className="py-3 text-slate-300 text-right">{formatCurrency(data.yearlyProfit * 1.8)}</td>
                <td className="py-3 text-slate-300 text-right">{(data.roi * 1.3).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300">Tahun 3</td>
                <td className="py-3 text-slate-300 text-right">{Math.round(data.targetUsers * 2.25).toLocaleString()}</td>
                <td className="py-3 text-slate-300 text-right">{formatCurrency(data.totalDeposit * 2.25)}</td>
                <td className="py-3 text-slate-300 text-right">{formatCurrency(data.yearlyProfit * 3)}</td>
                <td className="py-3 text-slate-300 text-right">{(data.roi * 1.6).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 backdrop-blur rounded-xl p-6 md:p-8 border border-purple-500/30 shadow-lg text-center"
      >
        <h2 className="text-xl md:text-2xl font-medium text-white mb-4">Kesimpulan Investasi</h2>
        <p className="text-slate-300 mb-6 max-w-3xl mx-auto">
          Solusi Live Audio menawarkan ROI yang sangat menarik sebesar {data.roi.toFixed(1)}% dengan target pengguna sebanyak {data.targetUsers.toLocaleString()}.
          Dengan deposit Rp {data.depositAmount.toLocaleString()} per pengguna, total deposit mencapai Rp {formatCurrencyCompact(data.totalDeposit)}.
          Dengan harga dasar Rp {data.basePricePerMinute} per menit dan harga jual Rp {data.pricePerMinute} per menit, margin keuntungan mencapai {((data.pricePerMinute - data.basePricePerMinute) / data.pricePerMinute * 100).toFixed(1)}%.
          Biaya layanan sebesar Rp {formatCurrencyCompact(data.serviceExpense)} (66.7% dari total deposit) dan biaya operasional bulanan Rp {formatCurrencyCompact(data.operationalCost)},
          menghasilkan pendapatan bersih Rp {formatCurrencyCompact(data.yearlyProfit)}.
          Pertumbuhan pengguna yang diproyeksikan akan meningkatkan ROI hingga {(data.roi * 1.6).toFixed(1)}% pada tahun ketiga.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => generatePDF('investor-liveaudio', 'Laporan_Investor_LiveAudio')} 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
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