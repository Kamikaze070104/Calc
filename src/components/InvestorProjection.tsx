import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartLine, TrendUp, CurrencyCircleDollar, Briefcase, Lightbulb, Target, Calculator, DownloadSimple } from '@phosphor-icons/react';
import { generatePDF } from '../utils/pdfGenerator';

// Data simulasi untuk proyeksi investor berdasarkan input pengguna
const projectionData = {
  telemarketing: {
    title: 'Telemarketing Solution',
    targetUsers: 300000, // Target Calls
    productPrice: 450, // Price per Minute
    operationalCost: 1103311440, // Operational Costs per tahun (91942620 * 12)
    onetimeCost: 177000000, // One Time Purchase
    yearlyRevenue: [4860000000, 7290000000, 10935000000], // Gross Revenue per tahun (405000000 * 12) dengan pertumbuhan 50% YoY
    yearlyProfit: [2644057380, 3966086070, 5949129105], // Net Revenue per tahun (220338115 * 12) dengan pertumbuhan 50% YoY
    roi: 106.2, // ROI dari data input
    breakEvenMonths: 1 // Completion 26 days dibulatkan ke 1 bulan
  },
  liveAudio: {
    title: 'Live Audio Solution',
    targetUsers: 10000, // Target User Tahun 1
    productPrice: 300, // Harga Per Menit
    operationalCost: 60000000, // Biaya Operasional Tahunan
    onetimeCost: 60000000, // Estimasi biaya pengembangan awal
    yearlyRevenue: [1080000000, 1620000000, 2430000000], // Total Pendapatan Kotor sesuai data baru
    yearlyProfit: [1020000000, 1836000000, 3060000000], // Total Pendapatan Bersih sesuai data baru
    roi: 102.0, // Tingkat Pengembalian Investasi (ROI) Tahun 1
    breakEvenMonths: 5 // Estimasi berdasarkan ROI
  },
  lokalAI: {
    title: 'LokalAI Solution',
    targetUsers: 19, // Total target pengguna (7+4+8)
    productPrice: 18666667, // Rata-rata harga paket software ((7*14000000 + 4*18000000 + 8*24000000)/19)
    operationalCost: 60000000, // Estimasi biaya operasional tahunan
    onetimeCost: 100000000, // Estimasi biaya pengembangan awal
    yearlyRevenue: [362000000, 362000000, 362000000], // Total Revenue per tahun sesuai data baru
    yearlyProfit: [202000000, 202000000, 202000000], // Estimasi profit (Revenue - Operational Cost)
    roi: 102.0, // Estimasi ROI berdasarkan profit tahun pertama
    breakEvenMonths: 6, // Estimasi berdasarkan ROI
    softwareOnly: {
      year1: 362000000,
      year2: 362000000,
      year3: 362000000,
      total: 1086000000
    },
    bundling: {
      year1: 894000000,
      year2: 362000000,
      year3: 362000000,
      total: 1618000000
    }
  },
  combined: {
    title: 'Combined Solutions',
    targetUsers: 310019, // Total target pengguna dari semua solusi (300000 + 10000 + 19)
    productPrice: 4000000, // Estimasi harga paket bundling
    operationalCost: 1223311440, // Total biaya operasional dari semua solusi (1103311440 + 60000000 + 60000000)
    onetimeCost: 337000000, // Total biaya satu kali dari semua solusi (177000000 + 60000000 + 100000000)
    yearlyRevenue: [6302000000, 9272000000, 13727000000], // Total revenue tahun 1 dari semua solusi (4860000000 + 1080000000 + 362000000)
    yearlyProfit: [3866057380, 6004086070, 9211129105], // Total profit tahun 1 dari semua solusi (2644057380 + 1020000000 + 202000000)
    roi: 120.4, // Rata-rata ROI dari semua solusi tanpa efek sinergi
    breakEvenMonths: 6 // Estimasi berdasarkan ROI gabungan tanpa efek sinergi
  }
};

// Data untuk chart perbandingan berdasarkan data yang diperbarui
const comparisonData = [
  { name: 'Telemarketing', revenue: 4860000000, profit: 2644057380, roi: 106.2 },
  { name: 'Live Audio', revenue: 1080000000, profit: 1020000000, roi: 102.0 },
  { name: 'LokalAI', revenue: 362000000, profit: 202000000, roi: 102.0 },
  { name: 'Combined', revenue: 6302000000, profit: 3866057380, roi: 120.4 }
];

// Data untuk chart proyeksi 3 tahun berdasarkan data yang diperbarui
const yearlyData = [
  { name: 'Tahun 1', telemarketing: 4860000000, liveAudio: 1080000000, lokalAI: 362000000, combined: 6302000000 },
  { name: 'Tahun 2', telemarketing: 7290000000, liveAudio: 1620000000, lokalAI: 362000000, combined: 9272000000 },
  { name: 'Tahun 3', telemarketing: 10935000000, liveAudio: 2430000000, lokalAI: 362000000, combined: 13727000000 }
];

// Data untuk pie chart distribusi pendapatan berdasarkan data yang diperbarui
const revenueDistribution = [
  { name: 'Telemarketing', value: 4860000000, color: '#3B82F6' },
  { name: 'Live Audio', value: 1080000000, color: '#8B5CF6' },
  { name: 'LokalAI', value: 362000000, color: '#F59E0B' },
];

// Warna untuk charts
const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

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

export default function InvestorProjection() {
  // Handler untuk download PDF
  const handleDownloadPDF = async () => {
    const result = await generatePDF('investor-projection', 'Laporan_Investor_Projection');
    if (result) {
      console.log('PDF berhasil diunduh');
    } else {
      console.error('Gagal mengunduh PDF');
    }
  };
  const [selectedProduct, setSelectedProduct] = React.useState('all');
  
  // Filter data berdasarkan produk yang dipilih
  const getFilteredData = () => {
    if (selectedProduct === 'all') {
      return projectionData.combined;
    } else if (selectedProduct === 'telemarketing') {
      return projectionData.telemarketing;
    } else if (selectedProduct === 'liveaudio') {
      return projectionData.liveAudio;
    } else if (selectedProduct === 'lokalai') {
      return projectionData.lokalAI;
    }
    return projectionData.combined;
  };
  
  const filteredData = getFilteredData();
  
  // Asumsi dasar untuk proyeksi
  const getAssumptionText = () => {
    if (selectedProduct === 'all') {
      return {
        title: 'Asumsi Proyeksi Keseluruhan',
        description: 'Proyeksi ini didasarkan pada penggabungan semua solusi produk dengan menjumlahkan target pengguna, pendapatan, dan keuntungan dari masing-masing produk tanpa efek sinergi.'
      };
    } else if (selectedProduct === 'telemarketing') {
      return {
        title: 'Asumsi Proyeksi Telemarketing',
        description: 'Proyeksi Telemarketing didasarkan pada penetrasi pasar awal 500 pengguna dengan pertumbuhan 30% per tahun. Asumsi ini mempertimbangkan kebutuhan tinggi untuk otomatisasi telemarketing di industri jasa keuangan dan retail.'
      };
    } else if (selectedProduct === 'liveaudio') {
      return {
        title: 'Asumsi Proyeksi Live Audio',
        description: 'Proyeksi Live Audio didasarkan pada adopsi awal 1.200 pengguna dengan pertumbuhan 30% per tahun. Asumsi ini mempertimbangkan tren peningkatan penggunaan audio streaming untuk kampanye dan komunikasi publik.'
      };
    } else if (selectedProduct === 'lokalai') {
      return {
        title: 'Asumsi Proyeksi LokalAI',
        description: 'Proyeksi LokalAI didasarkan pada adopsi awal 800 pengguna dengan pertumbuhan 30% per tahun. Asumsi ini mempertimbangkan kebutuhan pasar untuk solusi AI yang disesuaikan dengan konteks lokal dan bahasa daerah.'
      };
    }
    return {
      title: 'Asumsi Proyeksi',
      description: 'Proyeksi ini didasarkan pada analisis pasar dan tren industri terkini.'
    };
  };
  
  const assumptionText = getAssumptionText();
  return (
    <div id="investor-projection">
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-light mb-3">
          <span className="text-blue-400 font-medium">Investor</span> Projection
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm md:text-base mb-6">
          Proyeksi pendapatan dan profitabilitas dari solusi-solusi kami untuk presentasi investor.
        </p>
        
        {/* Filter Produk */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedProduct('all')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${selectedProduct === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Keseluruhan Produk
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedProduct('telemarketing')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${selectedProduct === 'telemarketing' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Telemarketing
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedProduct('liveaudio')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${selectedProduct === 'liveaudio' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Live Audio
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedProduct('lokalai')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${selectedProduct === 'lokalai' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            LokalAI
          </motion.button>
        </div>
      </motion.div>
      
      {/* Asumsi Dasar Proyeksi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg mb-8 md:mb-10"
      >
        <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-3">
          <Lightbulb weight="light" size={20} className="mr-2 text-yellow-400" />
          {assumptionText.title}
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          {assumptionText.description}
        </p>
      </motion.div>

      {/* Highlight Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur border border-blue-500/30 rounded-xl p-6">
          <div className="text-blue-300 text-sm font-medium mb-2 flex items-center">
            <CurrencyCircleDollar size={18} className="mr-2" />
            Total Proyeksi Revenue (3 Tahun)
          </div>
          <div className="text-white text-3xl font-semibold mb-1">
            {formatCurrency(filteredData.yearlyRevenue.reduce((a, b) => a + b, 0))}
          </div>
          <div className="text-blue-200 text-xs">
            Dari semua solusi yang ditawarkan
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur border border-emerald-500/30 rounded-xl p-6">
          <div className="text-emerald-300 text-sm font-medium mb-2 flex items-center">
            <TrendUp size={18} className="mr-2" />
            Total Proyeksi Profit (3 Tahun)
          </div>
          <div className="text-white text-3xl font-semibold mb-1">
            {formatCurrency(filteredData.yearlyProfit.reduce((a, b) => a + b, 0))}
          </div>
          <div className="text-emerald-200 text-xs">
            Margin profit rata-rata {Math.round((filteredData.yearlyProfit.reduce((a, b) => a + b, 0) / filteredData.yearlyRevenue.reduce((a, b) => a + b, 0)) * 100)}%
          </div>
        </div>

        {/* ROI Card */}
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur border border-amber-500/30 rounded-xl p-6">
          <div className="text-amber-300 text-sm font-medium mb-2 flex items-center">
            <Target size={18} className="mr-2" />
            ROI
          </div>
          <div className="text-white text-3xl font-semibold mb-1">
            {filteredData.roi}%
          </div>
          <div className="text-amber-200 text-xs">
            {selectedProduct === 'all' ? 'Dari solusi bundling semua produk' : `Dari solusi ${selectedProduct === 'telemarketing' ? 'Telemarketing' : selectedProduct === 'liveaudio' ? 'Live Audio' : 'LokalAI'}`}
          </div>
        </div>

        {/* Break Even Card */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur border border-purple-500/30 rounded-xl p-6">
          <div className="text-purple-300 text-sm font-medium mb-2 flex items-center">
            <Calculator size={18} className="mr-2" />
            Break Even Point
          </div>
          <div className="text-white text-3xl font-semibold mb-1">
            {filteredData.breakEvenMonths} Bulan
          </div>
          <div className="text-purple-200 text-xs">
            {selectedProduct === 'all' ? 'Untuk solusi bundling semua produk' : `Untuk solusi ${selectedProduct === 'telemarketing' ? 'Telemarketing' : selectedProduct === 'liveaudio' ? 'Live Audio' : 'LokalAI'}`}
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
        {/* Revenue Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4 md:mb-6">
            <ChartLine weight="light" size={20} className="mr-2 text-blue-400" />
            {selectedProduct === 'all' ? 'Perbandingan Revenue (3 Tahun)' : `Revenue ${selectedProduct === 'telemarketing' ? 'Telemarketing' : selectedProduct === 'liveaudio' ? 'Live Audio' : 'LokalAI'} (3 Tahun)`}
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedProduct === 'all' ? comparisonData : [
              { name: 'Tahun 1', revenue: filteredData.yearlyRevenue[0] },
              { name: 'Tahun 2', revenue: filteredData.yearlyRevenue[1] },
              { name: 'Tahun 3', revenue: filteredData.yearlyRevenue[2] }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={formatCurrencyCompact} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ROI Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4 md:mb-6">
            <TrendUp weight="light" size={20} className="mr-2 text-emerald-400" />
            {selectedProduct === 'all' ? 'Perbandingan ROI' : `ROI ${selectedProduct === 'telemarketing' ? 'Telemarketing' : selectedProduct === 'liveaudio' ? 'Live Audio' : 'LokalAI'}`}
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedProduct === 'all' ? comparisonData : [
              { name: selectedProduct === 'telemarketing' ? 'Telemarketing' : selectedProduct === 'liveaudio' ? 'Live Audio' : 'LokalAI', roi: filteredData.roi }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `${value}%`} />
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

      {/* Yearly Projection Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-6 border border-slate-700/50 shadow-lg mb-12"
      >
        <h2 className="text-xl font-medium text-slate-200 flex items-center mb-6">
          <ChartLine weight="light" size={20} className="mr-2 text-blue-400" />
          {selectedProduct === 'all' ? 'Proyeksi Revenue per Tahun' : `Proyeksi Revenue ${selectedProduct === 'telemarketing' ? 'Telemarketing' : selectedProduct === 'liveaudio' ? 'Live Audio' : 'LokalAI'} per Tahun`}
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={selectedProduct === 'all' ? yearlyData : [
            { name: 'Tahun 1', telemarketing: selectedProduct === 'telemarketing' ? filteredData.yearlyRevenue[0] : 0, liveAudio: selectedProduct === 'liveaudio' ? filteredData.yearlyRevenue[0] : 0, lokalAI: selectedProduct === 'lokalai' ? filteredData.yearlyRevenue[0] : 0 },
            { name: 'Tahun 2', telemarketing: selectedProduct === 'telemarketing' ? filteredData.yearlyRevenue[1] : 0, liveAudio: selectedProduct === 'liveaudio' ? filteredData.yearlyRevenue[1] : 0, lokalAI: selectedProduct === 'lokalai' ? filteredData.yearlyRevenue[1] : 0 },
            { name: 'Tahun 3', telemarketing: selectedProduct === 'telemarketing' ? filteredData.yearlyRevenue[2] : 0, liveAudio: selectedProduct === 'liveaudio' ? filteredData.yearlyRevenue[2] : 0, lokalAI: selectedProduct === 'lokalai' ? filteredData.yearlyRevenue[2] : 0 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={formatCurrencyCompact} />
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
            <Bar dataKey="telemarketing" name="Telemarketing" fill="#3B82F6" stackId="a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="liveAudio" name="Live Audio" fill="#8B5CF6" stackId="a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lokalAI" name="LokalAI" fill="#F59E0B" stackId="a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="combined" name="Combined (Additional)" fill="#10B981" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-12">
        {/* Revenue Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg"
        >
          <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-4 md:mb-6">
            <CurrencyCircleDollar weight="light" size={20} className="mr-2 text-blue-400" />
            {selectedProduct === 'all' ? 'Distribusi Revenue per Produk' : `Detail Revenue ${selectedProduct === 'telemarketing' ? 'Telemarketing' : selectedProduct === 'liveaudio' ? 'Live Audio' : 'LokalAI'}`}
          </h2>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={selectedProduct === 'all' ? revenueDistribution : [
                    { name: 'Tahun 1', value: filteredData.yearlyRevenue[0], color: '#3B82F6' },
                    { name: 'Tahun 2', value: filteredData.yearlyRevenue[1], color: '#8B5CF6' },
                    { name: 'Tahun 3', value: filteredData.yearlyRevenue[2], color: '#F59E0B' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(selectedProduct === 'all' ? revenueDistribution : [
                    { name: 'Tahun 1', value: filteredData.yearlyRevenue[0], color: '#3B82F6' },
                    { name: 'Tahun 2', value: filteredData.yearlyRevenue[1], color: '#8B5CF6' },
                    { name: 'Tahun 3', value: filteredData.yearlyRevenue[2], color: '#F59E0B' }
                  ]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
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

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-6 border border-slate-700/50 shadow-lg"
        >
          <h2 className="text-xl font-medium text-slate-200 flex items-center mb-6">
            <Briefcase weight="light" size={20} className="mr-2 text-amber-400" />
            Detail Produk & Biaya
          </h2>

          <div className="space-y-6">
            {selectedProduct === 'all' ? (
              // Tampilkan semua produk jika 'all' dipilih
              Object.entries(projectionData).map(([key, product]) => (
                <div key={key} className="border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-lg font-medium text-white mb-2">{product.title}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Target Pengguna:</p>
                      <p className="text-base text-white">{product.targetUsers.toLocaleString()} users</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Harga Produk:</p>
                      <p className="text-base text-white">{formatCurrency(product.productPrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Biaya Operasional:</p>
                      <p className="text-base text-white">{formatCurrency(product.operationalCost)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Biaya Satu Kali:</p>
                      <p className="text-base text-white">{formatCurrency(product.onetimeCost)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Tampilkan hanya produk yang dipilih
              <div className="border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
                <h3 className="text-lg font-medium text-white mb-2">{filteredData.title}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Target Pengguna:</p>
                    <p className="text-base text-white">{filteredData.targetUsers.toLocaleString()} users</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Harga Produk:</p>
                    <p className="text-base text-white">{formatCurrency(filteredData.productPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Biaya Operasional:</p>
                    <p className="text-base text-white">{formatCurrency(filteredData.operationalCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Biaya Satu Kali:</p>
                    <p className="text-base text-white">{formatCurrency(filteredData.onetimeCost)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Assumptions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-4 md:p-6 border border-slate-700/50 shadow-lg"
      >
        <h2 className="text-lg md:text-xl font-medium text-slate-200 flex items-center mb-3 md:mb-4">
          <Lightbulb weight="light" size={20} className="mr-2 text-yellow-400" />
          {selectedProduct === 'all' ? 'Asumsi Proyeksi' : `Asumsi Proyeksi ${selectedProduct === 'telemarketing' ? 'Telemarketing' : selectedProduct === 'liveaudio' ? 'Live Audio' : 'LokalAI'}`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <h3 className="font-medium text-white text-sm md:text-base mb-2">Asumsi Pertumbuhan</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs md:text-sm">
              <li>Pertumbuhan revenue YoY sebesar 50%</li>
              <li>Peningkatan jumlah pengguna 30% per tahun</li>
              <li>Retensi pelanggan 85% per tahun</li>
              <li>Peningkatan ARPU 15% per tahun</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <h3 className="font-medium text-white text-sm md:text-base mb-2">Asumsi Biaya</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs md:text-sm">
              <li>Biaya operasional meningkat 20% per tahun</li>
              <li>Biaya akuisisi pelanggan menurun 10% per tahun</li>
              <li>Biaya infrastruktur tetap untuk 3 tahun pertama</li>
              <li>Biaya satu kali hanya di tahun pertama</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <h3 className="font-medium text-white text-sm md:text-base mb-2">Asumsi Pasar</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs md:text-sm">
              <li>Penetrasi pasar 15% di tahun pertama</li>
              <li>Pertumbuhan pasar 25% per tahun</li>
              <li>Tidak ada perubahan signifikan pada kompetisi</li>
              <li>Tidak ada perubahan regulasi yang berdampak</li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      {/* Download Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex justify-center mt-8 mb-12"
      >
        <button 
          onClick={() => generatePDF('investor-projection', 'Laporan_Investor_Projection')} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <DownloadSimple size={20} />
          Download Laporan Investor (PDF)
        </button>
      </motion.div>
    </div>
    </div>
  );
}