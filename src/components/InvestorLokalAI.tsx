import React from 'react';
import { motion } from 'framer-motion';
import { CurrencyCircleDollar, Briefcase, Target, Calculator, Robot, Medal, DownloadSimple } from '@phosphor-icons/react';
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

export default function InvestorLokalAI() {
  // Handler untuk download PDF
  const handleDownloadPDF = async () => {
    const result = await generatePDF('investor-lokalai', 'Laporan_Investor_LokalAI');
    if (result) {
      console.log('PDF berhasil diunduh');
    } else {
      console.error('Gagal mengunduh PDF');
    }
  };
  // Data LokalAI berdasarkan input pengguna
  const data = {
    title: 'LokalAI Solution',
    packages: [
      {
        name: 'Bronze',
        color: '⚪',
        softwarePrice: 14000000, // Harga paket software per pengguna/tahun
        bundlingPrice: 26000000, // Harga paket bundling per pengguna (sudah termasuk software)
        targetUsers: 7 // Target pengguna
      },
      {
        name: 'Silver',
        color: '🟡',
        softwarePrice: 18000000, // Harga paket software per pengguna/tahun
        bundlingPrice: 38000000, // Harga paket bundling per pengguna (sudah termasuk software)
        targetUsers: 4 // Target pengguna
      },
      {
        name: 'Gold',
        color: '🟡',
        softwarePrice: 24000000, // Harga paket software per pengguna/tahun
        bundlingPrice: 70000000, // Harga paket bundling per pengguna (sudah termasuk software)
        targetUsers: 8 // Target pengguna
      }
    ],
    softwareRevenue: {
      year1: 362000000, // Total revenue tahun 1
      year2: 362000000, // Total revenue tahun 2
      year3: 362000000, // Total revenue tahun 3
      total: 1086000000 // Total revenue 3 tahun
    },
    bundlingRevenue: {
      year1: 894000000, // Total revenue tahun 1 (26M*7 + 38M*4 + 70M*8 = 182M + 152M + 560M = 894M)
      year2: 362000000, // Total revenue tahun 2 (hanya software - 14M*7 + 18M*4 + 24M*8 = 98M + 72M + 192M = 362M)
      year3: 362000000, // Total revenue tahun 3 (hanya software - sama dengan tahun 2)
      total: 1618000000 // Total revenue 3 tahun (894M + 362M + 362M = 1618M)
    },
    operationalCost: 120000000, // Biaya operasional tahunan (asumsi)
    developmentCost: 250000000 // Biaya pengembangan awal (asumsi)
  };

  // Menghitung total pengguna
  const totalUsers = data.packages.reduce((sum, pkg) => sum + pkg.targetUsers, 0);

  // Menghitung revenue per paket untuk tahun 1
  const packageRevenue = data.packages.map(pkg => ({
    ...pkg,
    softwareRevenueYear1: pkg.softwarePrice * pkg.targetUsers,
    bundlingRevenueYear1: pkg.bundlingPrice * pkg.targetUsers
  }));

  return (
    <div id="investor-lokalai">
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            LokalAI <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Investor Projection</span>
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Proyeksi pendapatan dan profitabilitas dari LokalAI untuk presentasi investor.
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
          <Target weight="light" size={20} className="mr-2 text-cyan-400" />
          Asumsi Proyeksi LokalAI
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          Proyeksi LokalAI didasarkan pada 3 tier paket (Bronze, Silver, Gold) dengan total target 19 pengguna. 
          Tersedia dalam model Software Only dan Bundling (Software + Hardware). Total pendapatan 3 tahun mencapai Rp 1,08 M untuk Software Only dan 
          Rp 1,61 M untuk Bundling (tahun ke-2 dan ke-3 hanya membayar software).
        </p>
      </motion.div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-cyan-600/20 to-cyan-700/20 backdrop-blur border border-cyan-500/20 rounded-xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
              <CurrencyCircleDollar size={24} className="text-cyan-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Software Revenue</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{formatCurrency(data.softwareRevenue.total)}</p>
          <p className="text-sm text-slate-400">Total pendapatan software (3 tahun)</p>
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
            <h3 className="text-lg font-medium text-slate-200">Bundling Revenue</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{formatCurrency(data.bundlingRevenue.total)}</p>
          <p className="text-sm text-slate-400">Total pendapatan bundling (3 tahun)</p>
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
            <h3 className="text-lg font-medium text-slate-200">Total Users</h3>
          </div>
          <p className="text-3xl font-light text-white mb-2">{totalUsers}</p>
          <p className="text-sm text-slate-400">Jumlah pengguna dari semua paket</p>
        </motion.div>
      </div>

      {/* Paket dan Harga */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg mb-8 md:mb-12"
      >
        <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4">
          <Medal weight="light" size={20} className="mr-2 text-cyan-400" />
          Paket dan Harga
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 text-slate-400 font-medium">Paket</th>
                <th className="text-right py-3 text-slate-400 font-medium">Harga Software</th>
                <th className="text-right py-3 text-slate-400 font-medium">Harga Bundling</th>
                <th className="text-right py-3 text-slate-400 font-medium">Target Users</th>
                <th className="text-right py-3 text-slate-400 font-medium">Revenue Software</th>
                <th className="text-right py-3 text-slate-400 font-medium">Revenue Bundling</th>
              </tr>
            </thead>
            <tbody>
              {packageRevenue.map((pkg, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="py-3 text-slate-300">
                    <div className="flex items-center">
                      <span className="mr-2">{pkg.color}</span>
                      <span>{pkg.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300 text-right">{formatCurrency(pkg.softwarePrice)}</td>
                  <td className="py-3 text-slate-300 text-right">{formatCurrency(pkg.bundlingPrice)}</td>
                  <td className="py-3 text-slate-300 text-right">{pkg.targetUsers}</td>
                  <td className="py-3 text-slate-300 text-right">{formatCurrency(pkg.softwareRevenueYear1)}</td>
                  <td className="py-3 text-slate-300 text-right">{formatCurrency(pkg.bundlingRevenueYear1)}</td>
                </tr>
              ))}
              <tr className="bg-slate-800/30">
                <td className="py-3 text-slate-200 font-medium">Total</td>
                <td className="py-3 text-slate-200 font-medium text-right">-</td>
                <td className="py-3 text-slate-200 font-medium text-right">-</td>
                <td className="py-3 text-slate-200 font-medium text-right">{totalUsers}</td>
                <td className="py-3 text-slate-200 font-medium text-right">{formatCurrency(data.softwareRevenue.year1)}</td>
                <td className="py-3 text-slate-200 font-medium text-right">{formatCurrency(data.bundlingRevenue.year1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Proyeksi 3 Tahun */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4">
            <Robot weight="light" size={20} className="mr-2 text-cyan-400" />
            Proyeksi Software Only
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Tahun 1</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.softwareRevenue.year1)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Tahun 2</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.softwareRevenue.year2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Tahun 3</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.softwareRevenue.year3)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-300 font-medium">Total 3 Tahun</span>
              <span className="text-white font-medium">{formatCurrency(data.softwareRevenue.total)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4">
            <Briefcase weight="light" size={20} className="mr-2 text-cyan-400" />
            Proyeksi Bundling
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Tahun 1</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.bundlingRevenue.year1)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Tahun 2</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.bundlingRevenue.year2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Tahun 3</span>
              <span className="text-slate-200 font-medium">{formatCurrency(data.bundlingRevenue.year3)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-300 font-medium">Total 3 Tahun</span>
              <span className="text-white font-medium">{formatCurrency(data.bundlingRevenue.total)}</span>
            </div>
          </div>
        </motion.div>
      </div>



      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 backdrop-blur rounded-xl p-6 md:p-8 border border-cyan-500/30 shadow-lg text-center"
      >
        <h2 className="text-xl md:text-2xl font-medium text-white mb-4">Kesimpulan</h2>
        <p className="text-slate-300 mb-6 max-w-3xl mx-auto">
          Solusi LokalAI dengan total {totalUsers} pengguna menawarkan pendapatan yang menjanjikan.
          Dengan total pendapatan 3 tahun mencapai Rp {formatCurrencyCompact(data.softwareRevenue.total)} untuk Software Only dan 
          Rp {formatCurrencyCompact(data.bundlingRevenue.total)} untuk Bundling, LokalAI merupakan solusi yang sangat potensial.
          Model bisnis multi-tier dengan paket Bronze, Silver, dan Gold memungkinkan penetrasi pasar yang lebih luas dan fleksibel.
          Proyeksi pertumbuhan pengguna sebesar 30% per tahun akan meningkatkan pendapatan hingga Rp {formatCurrencyCompact(data.softwareRevenue.year3)} pada tahun ketiga untuk model Software Only.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => generatePDF('investor-lokalai', 'Laporan_Investor_LokalAI')} 
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
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