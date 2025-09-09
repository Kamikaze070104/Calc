import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { Calculator as CalcIcon, TrendUp, Clock, Coins, ChartLine, Target, Lightbulb } from '@phosphor-icons/react';

interface CalculatorData {
  callPerMinute: number;
  targetCall: number;
  pricePerMinute: number;
  hoursPerDay: number;
  channels: number;
  oneTimePurchase: number;
  operationalCosts: number;
  tax: number;
}

interface Results {
  grossRevenue: number;
  netRevenue: number;
  totalMinutes: number;
  completionDays: number;
  roi: number;
  taxAmount: number;
  afterTaxRevenue: number;
}

const predefinedScenarios = [
  {
    name: "300K Calls",
    data: {
      callPerMinute: 3,
      targetCall: 300000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 48,
      oneTimePurchase: 177000000,
      operationalCosts: 91942620,
      tax: 11,
    },
  },
  {
    name: "500K Calls",
    data: {
      callPerMinute: 3,
      targetCall: 500000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 72,
      oneTimePurchase: 215500000,
      operationalCosts: 91942620,
      tax: 11,
    },
  },
  {
    name: "1.5M Calls",
    data: {
      callPerMinute: 3,
      targetCall: 1500000,
      pricePerMinute: 450,
      hoursPerDay: 12,
      channels: 208,
      oneTimePurchase: 433400000,
      operationalCosts: 91942620,
      tax: 11,
    },
  },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

export default function CombinedCalculator() {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>(
    predefinedScenarios[0].data
  );
  const [results, setResults] = useState<Results | null>(null);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [selectedMonthData, setSelectedMonthData] = useState<any>(null);
  const [dailyRevenueData, setDailyRevenueData] = useState<any[]>([]);

  const calculateResults = (data: CalculatorData): Results => {
    const grossRevenue =
      data.callPerMinute * data.targetCall * data.pricePerMinute;

    // Menghitung total minutes dan completion days
    const totalMinutes = data.callPerMinute * data.targetCall;
    const completionDays =
      totalMinutes / (data.channels * 60 * data.hoursPerDay);

    // Menyesuaikan operational costs berdasarkan completion days
    // Operational costs dihitung berdasarkan berapa bulan yang dibutuhkan untuk menyelesaikan proyek
    const completionMonths = Math.ceil(completionDays / 30);
    const adjustedOperationalCosts =
      (data.operationalCosts / 12) * completionMonths;

    // Net revenue disesuaikan dengan completion days
    const netRevenue =
      grossRevenue - adjustedOperationalCosts - data.oneTimePurchase;

    // Menghitung pajak dari net revenue
    const taxAmount = (netRevenue * data.tax) / 100;

    // Revenue setelah pajak
    const afterTaxRevenue = netRevenue - taxAmount;

    const roi =
      (afterTaxRevenue / (adjustedOperationalCosts + data.oneTimePurchase)) *
      100;

    return {
      grossRevenue,
      netRevenue,
      totalMinutes,
      completionDays,
      roi,
      taxAmount,
      afterTaxRevenue,
    };
  };

  const generateMonthlyProjections = (
    currentData: CalculatorData,
    currentResults: Results
  ) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Mendapatkan bulan saat ini sebagai titik awal
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    // Menghitung jumlah bulan yang diperlukan berdasarkan completion days
    const completionMonths = Math.ceil(currentResults.completionDays / 30);

    // Membuat array bulan untuk satu tahun penuh
    const adjustedMonths = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonthIndex + i) % 12;
      adjustedMonths.push(months[monthIndex]);
    }

    return adjustedMonths.map((month, index) => {
      // Bulan pertama: gross revenue - (one time purchase + operational cost)
      if (index === 0) {
        // Untuk bulan pertama, kurangi dengan one-time purchase dan operational costs
        const monthlyOperationalCosts = Math.round(
          currentData.operationalCosts / completionMonths
        );
        const firstMonthRevenue =
          currentResults.grossRevenue -
          currentData.oneTimePurchase -
          monthlyOperationalCosts;
        // Pastikan nilai tidak negatif
        const adjustedFirstMonthRevenue = Math.max(firstMonthRevenue, 0);
        // Hitung pajak dari revenue bulanan
        const monthlyTax = (adjustedFirstMonthRevenue * currentData.tax) / 100;
        const afterTaxRevenue = adjustedFirstMonthRevenue - monthlyTax;
        return {
          month,
          current: afterTaxRevenue,
          projected: Math.round(afterTaxRevenue), // 15% optimistic projection
          conservative: Math.round(afterTaxRevenue), // 15% conservative projection
        };
      } else {
        // Bulan selanjutnya: gross revenue - operational costs (tanpa one-time purchase)
        const monthlyOperationalCosts = Math.round(
          currentData.operationalCosts / completionMonths
        );
        const monthlyRevenue =
          currentResults.grossRevenue - monthlyOperationalCosts;
        // Pastikan nilai tidak negatif
        const adjustedMonthlyRevenue = Math.max(monthlyRevenue, 0);
        // Hitung pajak dari revenue bulanan
        const monthlyTax = (adjustedMonthlyRevenue * currentData.tax) / 100;
        const afterTaxRevenue = adjustedMonthlyRevenue - monthlyTax;
        return {
          month,
          current: afterTaxRevenue,
          projected: Math.round(afterTaxRevenue * 1.15), // 15% optimistic projection
          conservative: Math.round(afterTaxRevenue * 0.85), // 15% conservative projection
        };
      }
    });
  };

  const generateComparisonData = (
    currentData: CalculatorData,
    currentResults: Results
  ) => {
    return [
      {
        name: "Current Scenario",
        grossRevenue: currentResults.grossRevenue,
        netRevenue: currentResults.afterTaxRevenue,
        roi: currentResults.roi,
        completionDays: currentResults.completionDays,
      },
      ...predefinedScenarios.map((scenario) => {
        const scenarioResults = calculateResults(scenario.data);
        return {
          name: scenario.name,
          grossRevenue: scenarioResults.grossRevenue,
          netRevenue: scenarioResults.afterTaxRevenue,
          roi: scenarioResults.roi,
          completionDays: scenarioResults.completionDays,
        };
      }),
    ];
  };

  useEffect(() => {
    const newResults = calculateResults(calculatorData);
    setResults(newResults);
    setMonthlyData(generateMonthlyProjections(calculatorData, newResults));
    setComparisonData(generateComparisonData(calculatorData, newResults));
  }, [calculatorData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Menampilkan angka penuh, bukan notasi kompak
  const formatCurrencyCompact = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function untuk format currency input dengan titik pemisah ribuan
  const formatCurrencyInput = (value: string) => {
    // Hapus semua karakter non-digit
    const numericValue = value.replace(/\D/g, "");

    // Jika kosong, return string kosong
    if (!numericValue) return "";

    // Format dengan titik pemisah ribuan
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Helper function untuk parse currency input ke number
  const parseCurrencyInput = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  const handleInputChange = (field: keyof CalculatorData, value: number) => {
    setCalculatorData((prev) => ({ ...prev, [field]: value }));
    setSelectedScenario(-1); // Custom input
  };

  // Handler khusus untuk currency input
  const handleCurrencyInputChange = (
    field: keyof CalculatorData,
    value: string
  ) => {
    const numericValue = parseCurrencyInput(value);
    setCalculatorData((prev) => ({ ...prev, [field]: numericValue }));
    setSelectedScenario(-1); // Custom input
  };

  const selectScenario = (index: number) => {
    setSelectedScenario(index);
    setCalculatorData(predefinedScenarios[index].data);
  };

  // Fungsi untuk menghitung break-even days berdasarkan logika baru
  const calculateBreakEvenDays = () => {
    const totalInvestment =
      calculatorData.operationalCosts + calculatorData.oneTimePurchase;
    const monthlyRevenue = results?.grossRevenue || 0;

    if (monthlyRevenue === 0) return 0;

    // Hitung berapa hari untuk mencapai total investment
    const daysToReachTotalInvestment = Math.ceil(
      totalInvestment / (monthlyRevenue / 30)
    );

    return daysToReachTotalInvestment;
  };

  // Fungsi untuk menghitung daily revenue dan status
  const calculateDailyRevenue = (monthData: any, monthIndex: number) => {
    const daysInMonth = 30; // Asumsi 30 hari per bulan
    const dailyRevenue = monthData.current / daysInMonth;
    const dailyCalls =
      calculatorData.targetCall / (results?.completionDays || 1);
    const totalInvestment =
      calculatorData.operationalCosts + calculatorData.oneTimePurchase;

    // Hitung cumulative revenue dari bulan-bulan sebelumnya
    const previousMonthsRevenue = monthlyData
      .slice(0, monthIndex)
      .reduce((sum, data) => sum + data.current, 0);

    const dailyData = [];
    let runningCumulative = previousMonthsRevenue; // Mulai dari cumulative bulan sebelumnya

    for (let day = 1; day <= daysInMonth; day++) {
      runningCumulative += dailyRevenue;

      // Hitung hari total dari awal proyek
      const totalDayFromStart = monthIndex * 30 + day;

      let status = "operating";
      let breakEvenThreshold = 0;

      if (monthIndex === 0) {
        // Bulan pertama: cek terhadap total investment (one time purchase + operational cost)
        breakEvenThreshold = totalInvestment;
      } else {
        // Bulan kedua dan selanjutnya: cek terhadap operational cost saja
        breakEvenThreshold = calculatorData.operationalCosts;
      }

      // Logika status yang lebih tepat
      if (runningCumulative < breakEvenThreshold) {
        status = "loss";
      } else if (runningCumulative === breakEvenThreshold) {
        status = "break-even";
      } else {
        status = "profit";
      }

      dailyData.push({
        day,
        dailyRevenue: Math.round(dailyRevenue),
        dailyCalls: Math.round(dailyCalls),
        cumulativeRevenue: Math.round(runningCumulative),
        status,
        totalDayFromStart,
        breakEvenThreshold: Math.round(breakEvenThreshold),
        monthIndex,
        thresholdType:
          monthIndex === 0 ? "Total Investment" : "Operational Cost",
      });
    }

    return dailyData;
  };

  // Handler untuk membuka modal daily revenue
  const handleShowDailyRevenue = (monthData: any, monthIndex: number) => {
    const dailyData = calculateDailyRevenue(monthData, monthIndex);
    setSelectedMonthData(monthData);
    setDailyRevenueData(dailyData);
    setShowDailyModal(true);
  };

  const assumptions = [
    {
      title: "Market Stability",
      description:
        "Call demand remains consistent with gross revenue per bulan - one time purchase per bulan di bulan pertama, dan gross revenue - operational costs di bulan-bulan berikutnya",
      impact: "Medium",
      color: "blue",
    },
    {
      title: "Operational Efficiency",
      description:
        "95% uptime and consistent call quality maintained across all channels",
      impact: "High",
      color: "emerald",
    },
    {
      title: "Price Stability",
      description: `Per-minute pricing remains at IDR ${calculatorData.pricePerMinute} throughout the period`,
      impact: "Medium",
      color: "yellow",
    },
    {
      title: "Channel Utilization",
      description: `All ${calculatorData.channels} channels operating at optimal capacity during ${calculatorData.hoursPerDay} business hours`,
      impact: "High",
      color: "purple",
    },
  ];

  const pieData = comparisonData.slice(1).map((item, index) => ({
    name: item.name,
    value: item.netRevenue,
    fill: COLORS[index],
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
            Live Revenue{" "}
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Calculator
            </span>
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Real-time revenue calculations with instant projection updates.
            Analyze your call center's financial performance dynamically.
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
                    ? "bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-lg shadow-blue-500/25"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
                style={{
                  boxShadow:
                    selectedScenario === index
                      ? "0 0 30px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                      : "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                }}
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 mb-16">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div
              className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 border border-white/10 sticky top-2 sm:top-4 md:top-8 lg:top-28 max-h-[90vh] sm:max-h-none overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              style={{
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 md:mb-6">
                <CalcIcon
                  weight="light"
                  size={18}
                  className="text-blue-400 sm:w-5 sm:h-5 md:w-6 md:h-6"
                />
                <h3 className="text-base sm:text-lg md:text-xl font-light text-white tracking-tight">
                  Input Parameters
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-300 mb-1 sm:mb-2">
                    Call Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={calculatorData.callPerMinute}
                    onChange={(e) =>
                      handleInputChange("callPerMinute", Number(e.target.value))
                    }
                    className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 bg-white/5 border border-white/10 rounded-md sm:rounded-lg md:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl text-xs sm:text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-300 mb-1 sm:mb-2">
                    Target Calls
                  </label>
                  <input
                    type="number"
                    value={calculatorData.targetCall}
                    onChange={(e) =>
                      handleInputChange("targetCall", Number(e.target.value))
                    }
                    className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 bg-white/5 border border-white/10 rounded-md sm:rounded-lg md:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl text-xs sm:text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-300 mb-1 sm:mb-2">
                    Price per Minute
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 md:pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-xs sm:text-sm">
                        Rp.
                      </span>
                    </div>
                    <input
                      type="text"
                      value={
                        calculatorData.pricePerMinute
                          ? formatCurrencyInput(
                              calculatorData.pricePerMinute.toString()
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handleCurrencyInputChange(
                          "pricePerMinute",
                          e.target.value
                        )
                      }
                      className="w-full pl-8 sm:pl-10 md:pl-12 pr-2 sm:pr-3 md:pr-4 py-1.5 sm:py-2 md:py-3 bg-white/5 border border-white/10 rounded-md sm:rounded-lg md:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl text-xs sm:text-sm md:text-base"
                      placeholder="450"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-light text-slate-300 mb-1 sm:mb-2">
                      Hours/Day
                    </label>
                    <input
                      type="number"
                      value={calculatorData.hoursPerDay}
                      onChange={(e) =>
                        handleInputChange("hoursPerDay", Number(e.target.value))
                      }
                      className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 bg-white/5 border border-white/10 rounded-md sm:rounded-lg md:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl text-xs sm:text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-light text-slate-300 mb-1 sm:mb-2">
                      Channels
                    </label>
                    <input
                      type="number"
                      value={calculatorData.channels}
                      onChange={(e) =>
                        handleInputChange("channels", Number(e.target.value))
                      }
                      className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 bg-white/5 border border-white/10 rounded-md sm:rounded-lg md:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl text-xs sm:text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-300 mb-1 sm:mb-2">
                    One Time Purchase
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 md:pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-xs sm:text-sm">
                        Rp.
                      </span>
                    </div>
                    <input
                      type="text"
                      value={
                        calculatorData.oneTimePurchase
                          ? formatCurrencyInput(
                              calculatorData.oneTimePurchase.toString()
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handleCurrencyInputChange(
                          "oneTimePurchase",
                          e.target.value
                        )
                      }
                      className="w-full pl-8 sm:pl-10 md:pl-12 pr-2 sm:pr-3 md:pr-4 py-1.5 sm:py-2 md:py-3 bg-white/5 border border-white/10 rounded-md sm:rounded-lg md:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl text-xs sm:text-sm md:text-base"
                      placeholder="900.100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-300 mb-1 sm:mb-2">
                    Operational Costs
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 md:pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-xs sm:text-sm">
                        Rp.
                      </span>
                    </div>
                    <input
                      type="text"
                      value={
                        calculatorData.operationalCosts
                          ? formatCurrencyInput(
                              calculatorData.operationalCosts.toString()
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handleCurrencyInputChange(
                          "operationalCosts",
                          e.target.value
                        )
                      }
                      className="w-full pl-8 sm:pl-10 md:pl-12 pr-2 sm:pr-3 md:pr-4 py-1.5 sm:py-2 md:py-3 bg-white/5 border border-white/10 rounded-md sm:rounded-lg md:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl text-xs sm:text-sm md:text-base"
                      placeholder="900.100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-300 mb-1 sm:mb-2">
                    Tax Rate (%)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-sm">%</span>
                    </div>
                    <input
                      type="number"
                      value={calculatorData.tax}
                      onChange={(e) =>
                        handleInputChange("tax", Number(e.target.value))
                      }
                      className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl"
                      placeholder="11"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results and Charts Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 space-y-8 lg:space-y-12"
          >
            {results && (
              <>
                {/* Current Results */}
                <div
                  className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <TrendUp
                      weight="light"
                      size={20}
                      className="text-emerald-400 sm:w-6 sm:h-6"
                    />
                    <h3 className="text-lg sm:text-xl font-light text-white tracking-tight">
                      Live Results
                    </h3>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-lg sm:rounded-xl md:rounded-2xl border border-blue-400/20 overflow-hidden">
                      <p className="text-xs sm:text-sm font-light text-slate-300 mb-1">
                        Gross Revenue
                      </p>
                      <p
                        className="text-lg sm:text-xl font-medium text-white truncate"
                        title={formatCurrencyCompact(results.grossRevenue)}
                      >
                        {formatCurrencyCompact(results.grossRevenue)}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 rounded-2xl border border-emerald-400/20 overflow-hidden">
                      <p className="text-xs sm:text-sm font-light text-slate-300 mb-1">
                        Net Revenue
                      </p>
                      <p
                        className="text-lg sm:text-xl font-medium text-white truncate"
                        title={formatCurrencyCompact(results.netRevenue)}
                      >
                        {formatCurrencyCompact(results.netRevenue)}
                      </p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock
                          weight="light"
                          size={16}
                          className="text-blue-400"
                        />
                        <p className="text-sm font-light text-slate-300">
                          Completion
                        </p>
                      </div>
                      <p className="text-lg font-medium text-white truncate">
                        {Math.round(results.completionDays)} days
                      </p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                      <div className="flex items-center space-x-2 mb-2">
                        <Coins
                          weight="light"
                          size={16}
                          className="text-emerald-400"
                        />
                        <p className="text-sm font-light text-slate-300">ROI</p>
                      </div>
                      <p className="text-lg font-medium text-white truncate">
                        {results.roi.toFixed(1)}%
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl border border-red-400/20 overflow-hidden">
                      <p className="text-xs sm:text-sm font-light text-slate-300 mb-1">
                        Tax Amount
                      </p>
                      <p
                        className="text-lg sm:text-xl font-medium text-white truncate"
                        title={formatCurrencyCompact(results.taxAmount)}
                      >
                        {formatCurrencyCompact(results.taxAmount)}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-2xl border border-green-400/20 overflow-hidden">
                      <p className="text-xs sm:text-sm font-light text-slate-300 mb-1">
                        After Tax Revenue
                      </p>
                      <p
                        className="text-lg sm:text-xl font-medium text-white truncate"
                        title={formatCurrencyCompact(results.afterTaxRevenue)}
                      >
                        {formatCurrencyCompact(results.afterTaxRevenue)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Monthly Projection Chart */}
                <div
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <ChartLine
                        weight="light"
                        size={24}
                        className="text-blue-400"
                      />
                      <h3 className="text-xl font-light text-white tracking-tight">
                        Monthly Revenue Projection
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
                      <Clock
                        weight="light"
                        size={16}
                        className="text-blue-400"
                      />
                      <span className="text-sm font-light text-white">
                        Completion: {Math.round(results.completionDays)} days
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm font-light text-slate-300">
                      Proyeksi dimulai dari bulan {monthlyData[0]?.month} dan
                      menampilkan satu tahun penuh. Bulan pertama mengurangi
                      gross revenue dengan one-time purchase dan operational
                      costs, bulan berikutnya hanya mengurangi operational
                      costs.
                    </p>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                        opacity={0.3}
                      />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                      <YAxis
                        stroke="#94A3B8"
                        fontSize={12}
                        tickFormatter={formatCurrencyCompact}
                        width={120}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Revenue",
                        ]}
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="current"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="Current Scenario"
                      />
                      {/* Reference Line untuk menandai completion days */}
                      <ReferenceLine
                        x={
                          monthlyData[
                            Math.min(
                              Math.ceil(results.completionDays / 30) - 1,
                              monthlyData.length - 1
                            )
                          ]?.month
                        }
                        stroke="#EC4899"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        label={{
                          value: "Completion",
                          fill: "#EC4899",
                          fontSize: 12,
                          position: "insideTopRight",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Yearly Projection Table */}
                <div
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <ChartLine
                        weight="light"
                        size={20}
                        className="text-emerald-400 sm:w-6 sm:h-6"
                      />
                      <h3 className="text-lg sm:text-xl font-light text-white tracking-tight">
                        Yearly Revenue Projection
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                      <Target
                        weight="light"
                        size={16}
                        className="text-emerald-400"
                      />
                      <span className="text-sm font-light text-white">
                        Total:{" "}
                        {formatCurrencyCompact(
                          monthlyData.reduce(
                            (sum, data) => sum + data.current,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm font-light text-slate-300">
                      Proyeksi pendapatan tahunan untuk 12 bulan mulai dari{" "}
                      {monthlyData[0]?.month}. Bulan pertama: gross revenue -
                      (one time purchase + operational costs). Bulan berikutnya:
                      gross revenue - operational costs. Completion days:{" "}
                      {Math.round(results.completionDays)} hari (
                      {Math.ceil(results.completionDays / 30)} bulan).
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[300px] sm:min-w-[400px] lg:min-w-[500px]">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                            Month
                          </th>
                          <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                            Current Scenario
                          </th>
                          <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                            Status
                          </th>
                          <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                            Detail
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((data, index) => {
                          const isCompletionMonth =
                            index ===
                            Math.min(
                              Math.ceil(results.completionDays / 30) - 1,
                              monthlyData.length - 1
                            );
                          return (
                            <tr
                              key={index}
                              className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                                isCompletionMonth ? "bg-pink-500/10" : ""
                              }`}
                            >
                              <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-white font-light text-xs sm:text-sm">
                                {data.month}
                              </td>
                              <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-white font-light overflow-hidden text-xs sm:text-sm">
                                <span
                                  className="inline-block max-w-[120px] sm:max-w-[150px] truncate"
                                  title={formatCurrencyCompact(data.current)}
                                >
                                  {formatCurrencyCompact(data.current)}
                                </span>
                              </td>
                              <td className="py-2 sm:py-3 px-2 sm:px-4 overflow-hidden">
                                {isCompletionMonth ? (
                                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-pink-500/20 text-pink-400 text-xs font-medium">
                                    <Clock
                                      weight="light"
                                      size={10}
                                      className="mr-1 sm:w-3 sm:h-3"
                                    />
                                    <span className="hidden sm:inline">
                                      Completion
                                    </span>
                                    <span className="sm:hidden">Complete</span>
                                  </span>
                                ) : index <
                                  Math.ceil(results.completionDays / 30) - 1 ? (
                                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium">
                                    <span className="hidden sm:inline">
                                      In Progress
                                    </span>
                                    <span className="sm:hidden">Active</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-slate-500/20 text-slate-400 text-xs font-medium">
                                    Future
                                  </span>
                                )}
                              </td>
                              <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 overflow-hidden">
                                <button
                                  onClick={() =>
                                    handleShowDailyRevenue(data, index)
                                  }
                                  className="inline-flex items-center px-1.5 sm:px-2 lg:px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors"
                                >
                                  <ChartLine
                                    weight="light"
                                    size={10}
                                    className="mr-1 sm:w-3 sm:h-3"
                                  />
                                  <span className="hidden sm:inline">
                                    View Daily
                                  </span>
                                  <span className="sm:hidden">View</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-white/5">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white font-medium text-xs sm:text-sm">
                            Total
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white font-medium overflow-hidden text-xs sm:text-sm">
                            <span
                              className="inline-block max-w-[120px] sm:max-w-[150px] truncate"
                              title={formatCurrencyCompact(
                                monthlyData.reduce(
                                  (sum, data) => sum + data.current,
                                  0
                                )
                              )}
                            >
                              {formatCurrencyCompact(
                                monthlyData.reduce(
                                  (sum, data) => sum + data.current,
                                  0
                                )
                              )}
                            </span>
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white font-medium overflow-hidden text-xs sm:text-sm">
                            -
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white font-medium text-xs sm:text-sm">
                            -
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Comparison Charts */}
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* ROI Comparison */}
                  <div
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                    style={{
                      boxShadow:
                        "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <TrendUp
                        weight="light"
                        size={24}
                        className="text-emerald-400"
                      />
                      <h3 className="text-xl font-light text-white tracking-tight">
                        ROI Comparison
                      </h3>
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#334155"
                          opacity={0.3}
                        />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                        <YAxis stroke="#94A3B8" fontSize={12} width={80} />
                        <Tooltip
                          formatter={(value: number) => [
                            `${value.toFixed(1)}%`,
                            "ROI",
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Bar
                          dataKey="roi"
                          fill="#10B981"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue Distribution */}
                  <div
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                    style={{
                      boxShadow:
                        "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Target
                        weight="light"
                        size={24}
                        className="text-yellow-400"
                      />
                      <h3 className="text-xl font-light text-white tracking-tight">
                        Package Comparison
                      </h3>
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
                          label={({ payload, percent }) =>
                            `${payload.name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            formatCurrency(value),
                            "Net Revenue",
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Metrics */}
                <div
                  className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <h3 className="text-base sm:text-lg font-light text-white tracking-tight mb-4 sm:mb-6">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl overflow-hidden">
                      <span className="text-slate-400 font-light text-xs sm:text-sm">
                        Total Minutes
                      </span>
                      <span
                        className="text-white font-medium truncate ml-1 sm:ml-2 text-sm sm:text-base"
                        title={results.totalMinutes.toLocaleString()}
                      >
                        {results.totalMinutes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl overflow-hidden">
                      <span className="text-slate-400 font-light text-xs sm:text-sm">
                        Daily Capacity
                      </span>
                      <span
                        className="text-white font-medium truncate ml-1 sm:ml-2 text-sm sm:text-base"
                        title={`${(
                          calculatorData.channels *
                          60 *
                          calculatorData.hoursPerDay
                        ).toLocaleString()} min`}
                      >
                        {(
                          calculatorData.channels *
                          60 *
                          calculatorData.hoursPerDay
                        ).toLocaleString()}{" "}
                        min
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl overflow-hidden">
                      <span className="text-slate-400 font-light text-xs sm:text-sm">
                        Total Investment
                      </span>
                      <span
                        className="text-white font-medium truncate ml-1 sm:ml-2 text-sm sm:text-base"
                        title={formatCurrencyCompact(
                          calculatorData.operationalCosts +
                            calculatorData.oneTimePurchase
                        )}
                      >
                        {formatCurrencyCompact(
                          calculatorData.operationalCosts +
                            calculatorData.oneTimePurchase
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl overflow-hidden">
                      <span className="text-slate-400 font-light text-xs sm:text-sm">
                        Annual Operational Cost
                      </span>
                      <span
                        className="text-white font-medium truncate ml-1 sm:ml-2 text-sm sm:text-base"
                        title={formatCurrencyCompact(
                          calculatorData.operationalCosts
                        )}
                      >
                        {formatCurrencyCompact(
                          calculatorData.operationalCosts * 12
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Assumptions */}
                <div
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Lightbulb
                      weight="light"
                      size={24}
                      className="text-yellow-400"
                    />
                    <h3 className="text-xl font-light text-white tracking-tight">
                      Live Business Assumptions
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {assumptions.map((assumption, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white/5 rounded-2xl border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-medium text-white">
                            {assumption.title}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-light ${
                              assumption.impact === "High"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            }`}
                          >
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
                    <h4 className="text-lg font-medium text-white mb-3">
                      Live Insights
                    </h4>
                    <ul className="space-y-2 text-slate-300 font-light">
                      <li className="flex">
                        <span className="mr-2">•</span>
                        <span>
                          Current scenario offers {results.roi.toFixed(1)}% ROI
                          over {Math.round(results.completionDays)} days
                        </span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">•</span>
                        <span>
                          Monthly revenue projection shows gross revenue - one
                          time purchase per month in first month, and gross
                          revenue - operational costs in subsequent months, all
                          after tax
                        </span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">•</span>
                        <span>
                          Break-even point estimated at{" "}
                          {calculateBreakEvenDays()} days
                        </span>
                      </li>
                      <li className="flex">
                        <span className="mr-2">•</span>
                        <span
                          className="truncate"
                          title={`Total investment of ${formatCurrencyCompact(
                            calculatorData.operationalCosts +
                              calculatorData.oneTimePurchase
                          )} generates ${formatCurrencyCompact(
                            results.afterTaxRevenue
                          )} after-tax profit`}
                        >
                          Total investment of{" "}
                          {formatCurrencyCompact(
                            calculatorData.operationalCosts +
                              calculatorData.oneTimePurchase
                          )}{" "}
                          generates{" "}
                          {formatCurrencyCompact(results.afterTaxRevenue)}{" "}
                          after-tax profit
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

      {/* Daily Revenue Modal */}
      {showDailyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/10 max-w-4xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
            style={{
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <ChartLine
                  weight="light"
                  size={20}
                  className="text-blue-400 flex-shrink-0 sm:w-6 sm:h-6"
                />
                <h3 className="text-lg sm:text-xl font-light text-white tracking-tight truncate">
                  Daily Revenue - {selectedMonthData?.month}
                </h3>
              </div>
              <button
                onClick={() => setShowDailyModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0 ml-2"
              >
                <span className="text-white text-lg sm:text-xl">×</span>
              </button>
            </div>

            <div className="mb-4 px-3 sm:px-4 py-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
                Daily revenue breakdown for {selectedMonthData?.month}. Status
                indicators: <span className="text-red-400">Loss</span> (below
                threshold),
                <span className="text-yellow-400"> Break-even</span> (at
                threshold),
                <span className="text-green-400"> Profit</span> (above
                threshold).
                <br />
                <span className="text-slate-400 text-xs">
                  Month 1: Total Investment threshold. Month 2+: Operational
                  Cost threshold.
                </span>
              </p>
            </div>

            <div className="overflow-x-auto max-h-[300px] sm:max-h-[400px]">
              <table className="w-full text-left min-w-[500px] sm:min-w-[700px] lg:min-w-[900px]">
                <thead className="sticky top-0 bg-slate-900/50">
                  <tr className="border-b border-white/10">
                    <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                      Day
                    </th>
                    <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm hidden sm:table-cell">
                      Day from Start
                    </th>
                    <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                      Daily Revenue
                    </th>
                    <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                      Daily Calls
                    </th>
                    <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                      Cumulative
                    </th>
                    <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm hidden lg:table-cell">
                      Threshold
                    </th>
                    <th className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-slate-300 font-light text-xs sm:text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRevenueData.map((dayData, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-white font-light text-xs sm:text-sm">
                        Day {dayData.day}
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-white font-light text-xs sm:text-sm hidden sm:table-cell">
                        Day {dayData.totalDayFromStart}
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-white font-light text-xs sm:text-sm">
                        {formatCurrencyCompact(dayData.dailyRevenue)}
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-white font-light text-xs sm:text-sm">
                        {dayData.dailyCalls.toLocaleString()}
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-white font-light text-xs sm:text-sm">
                        {formatCurrencyCompact(dayData.cumulativeRevenue)}
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4 text-white font-light text-xs sm:text-sm hidden lg:table-cell">
                        {formatCurrencyCompact(dayData.breakEvenThreshold)}
                        <br />
                        <span className="text-slate-400 text-xs">
                          ({dayData.thresholdType})
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-2 lg:px-4">
                        <span
                          className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium ${
                            dayData.status === "loss"
                              ? "bg-red-500/20 text-red-400"
                              : dayData.status === "break-even"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {dayData.status === "loss"
                            ? "Loss"
                            : dayData.status === "break-even"
                            ? "Break-even"
                            : "Profit"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}