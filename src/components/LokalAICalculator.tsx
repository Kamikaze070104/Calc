import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, Robot, CurrencyCircleDollar, Users, ChartLine, Lightbulb, DeviceMobile, DeviceTablet, Info, CaretDown, CaretUp } from '@phosphor-icons/react';

interface PackageData {
  price: number;
  bundlingPrice: number;
  targetUsers: number;
}

interface LokalAIData {
  bronze: PackageData;
  silver: PackageData;
  gold: PackageData;
}

interface PackageDetails {
  price: number;
  targetUsers: number;
}

interface PackageResult {
  packageDetails: PackageDetails;
  revenue: {
    softwareOnly: number[];
    bundling: number[];
  };
}

interface Results {
  packages: {
    bronze: PackageResult;
    silver: PackageResult;
    gold: PackageResult;
  };
}

export default function LokalAICalculator() {
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  
  const [data, setData] = useState<LokalAIData>({
    bronze: {
      price: 14000000, // Harga software per pengguna per tahun
      bundlingPrice: 26000000, // Harga bundling per pengguna (sudah termasuk software)
      targetUsers: 7,
    },
    silver: {
      price: 18000000, // Harga software per pengguna per tahun
      bundlingPrice: 38000000, // Harga bundling per pengguna (sudah termasuk software)
      targetUsers: 4,
    },
    gold: {
      price: 24000000, // Harga software per pengguna per tahun
      bundlingPrice: 70000000, // Harga bundling per pengguna (sudah termasuk software)
      targetUsers: 8,
    },
  });

  const [results, setResults] = useState<Results>({
    packages: {
      bronze: {
        packageDetails: {
          price: 0,
          targetUsers: 0,
        },
        revenue: {
          softwareOnly: [0, 0, 0],
          bundling: [0, 0, 0],
        },
      },
      silver: {
        packageDetails: {
          price: 0,
          targetUsers: 0,
        },
        revenue: {
          softwareOnly: [0, 0, 0],
          bundling: [0, 0, 0],
        },
      },
      gold: {
        packageDetails: {
          price: 0,
          targetUsers: 0,
        },
        revenue: {
          softwareOnly: [0, 0, 0],
          bundling: [0, 0, 0],
        },
      },
    },
  });

  useEffect(() => {
    calculateResults();
  }, [data]);

  const calculateResults = () => {
    // Bronze package calculations
    const bronzePackageDetails = {
      price: data.bronze.price,
      targetUsers: data.bronze.targetUsers,
    };
    
    const bronzeSoftwareOnlyYearOne = data.bronze.price * data.bronze.targetUsers;
    const bronzeBundlingYearOne = data.bronze.bundlingPrice * data.bronze.targetUsers;
    
    // Proyeksi 3 tahun untuk Bronze
    const bronzeSoftwareOnly = [bronzeSoftwareOnlyYearOne, bronzeSoftwareOnlyYearOne, bronzeSoftwareOnlyYearOne];
    // Tahun ke-2 dan ke-3 hanya membayar software saja
    const bronzeBundling = [bronzeBundlingYearOne, bronzeSoftwareOnlyYearOne, bronzeSoftwareOnlyYearOne];

    // Silver package calculations
    const silverPackageDetails = {
      price: data.silver.price,
      targetUsers: data.silver.targetUsers,
    };
    
    const silverSoftwareOnlyYearOne = data.silver.price * data.silver.targetUsers;
    const silverBundlingYearOne = data.silver.bundlingPrice * data.silver.targetUsers;
    
    // Proyeksi 3 tahun untuk Silver
    const silverSoftwareOnly = [silverSoftwareOnlyYearOne, silverSoftwareOnlyYearOne, silverSoftwareOnlyYearOne];
    // Tahun ke-2 dan ke-3 hanya membayar software saja
    const silverBundling = [silverBundlingYearOne, silverSoftwareOnlyYearOne, silverSoftwareOnlyYearOne];

    // Gold package calculations
    const goldPackageDetails = {
      price: data.gold.price,
      targetUsers: data.gold.targetUsers,
    };
    
    const goldSoftwareOnlyYearOne = data.gold.price * data.gold.targetUsers;
    const goldBundlingYearOne = data.gold.bundlingPrice * data.gold.targetUsers;
    
    // Proyeksi 3 tahun untuk Gold
    const goldSoftwareOnly = [goldSoftwareOnlyYearOne, goldSoftwareOnlyYearOne, goldSoftwareOnlyYearOne];
    // Tahun ke-2 dan ke-3 hanya membayar software saja
    const goldBundling = [goldBundlingYearOne, goldSoftwareOnlyYearOne, goldSoftwareOnlyYearOne];

    setResults({
      packages: {
        bronze: {
          packageDetails: bronzePackageDetails,
          revenue: {
            softwareOnly: bronzeSoftwareOnly,
            bundling: bronzeBundling,
          },
        },
        silver: {
          packageDetails: silverPackageDetails,
          revenue: {
            softwareOnly: silverSoftwareOnly,
            bundling: silverBundling,
          },
        },
        gold: {
          packageDetails: goldPackageDetails,
          revenue: {
            softwareOnly: goldSoftwareOnly,
            bundling: goldBundling,
          },
        },
      },
    });
  };

  const handleInputChange = (package_: string, field: string, value: number) => {
    setData((prevData) => ({
      ...prevData,
      [package_]: {
        ...prevData[package_ as keyof LokalAIData],
        [field]: value,
      },
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            LokalAI <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Revenue Calculator</span>
          </h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Real-time revenue calculations with instant projection updates. Analyze your LokalAI's financial performance dynamically.
          </p>
        </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bronze Package */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-5 border border-slate-700/50 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center mr-3 border border-amber-800/30">
              <span className="text-xl">🟤</span>
            </div>
            <h2 className="text-xl font-medium text-amber-600">Bronze</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Harga Paket Software (per pengguna/tahun)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={data.bronze.price}
                    onChange={(e) =>
                      handleInputChange('bronze', 'price', parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Harga Paket Bundling (sudah termasuk software)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={data.bronze.bundlingPrice}
                    onChange={(e) =>
                      handleInputChange('bronze', 'bundlingPrice', parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Target Pengguna
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Users size={16} />
                </span>
                <input
                  type="number"
                  value={data.bronze.targetUsers}
                  onChange={(e) =>
                    handleInputChange('bronze', 'targetUsers', parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Silver Package */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-5 border border-slate-700/50 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-300/10 flex items-center justify-center mr-3 border border-slate-300/20">
              <span className="text-xl">⚪</span>
            </div>
            <h2 className="text-xl font-medium text-slate-300">Silver</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Harga Paket Software (per pengguna/tahun)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={data.silver.price}
                    onChange={(e) =>
                      handleInputChange('silver', 'price', parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Harga Paket Bundling (sudah termasuk software)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={data.silver.bundlingPrice}
                    onChange={(e) =>
                      handleInputChange('silver', 'bundlingPrice', parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Target Pengguna
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Users size={16} />
                </span>
                <input
                  type="number"
                  value={data.silver.targetUsers}
                  onChange={(e) =>
                    handleInputChange('silver', 'targetUsers', parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gold Package */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-5 border border-slate-700/50 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3 border border-yellow-500/20">
              <span className="text-xl">🟡</span>
            </div>
            <h2 className="text-xl font-medium text-yellow-500">Gold</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Harga Paket Software (per pengguna/tahun)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={data.gold.price}
                    onChange={(e) =>
                      handleInputChange('gold', 'price', parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Harga Paket Bundling (sudah termasuk software)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={data.gold.bundlingPrice}
                    onChange={(e) =>
                      handleInputChange('gold', 'bundlingPrice', parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Target Pengguna
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Users size={16} />
                </span>
                <input
                  type="number"
                  value={data.gold.targetUsers}
                  onChange={(e) =>
                    handleInputChange('gold', 'targetUsers', parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-6 border border-slate-700/50 shadow-lg mb-6"
      >
        <h2 className="text-xl font-medium text-slate-200 flex items-center mb-4">
          <ChartLine weight="light" size={20} className="mr-2 text-emerald-400" />
          Hasil Simulasi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Software Only Results */}
          <motion.div
            className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur border border-emerald-500/20 rounded-lg p-5"
          >
            <h3 className="text-emerald-300 text-md font-medium mb-4 flex items-center">
              <DeviceMobile weight="light" size={18} className="mr-2" />
              Software Only
            </h3>
            
            <div className="space-y-4">
              {/* Revenue per Package */}
              <div>
                <div className="text-emerald-300 text-sm mb-2">Revenue per Paket (Tahun 1)</div>
                <div className="space-y-2">
                  {['bronze', 'silver', 'gold'].map((pkg) => (
                    <div key={`software-${pkg}`} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-emerald-500/50 mr-2"></span>
                        <span className="text-slate-300 text-sm capitalize">{pkg}</span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {formatCurrency(results.packages[pkg].revenue.softwareOnly[0])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Total Revenue */}
              <div className="pt-3 border-t border-emerald-500/20">
                <div className="text-emerald-300 text-sm mb-2">Total Revenue (3 Tahun)</div>
                <div className="text-white text-xl font-semibold">
                  {formatCurrency(
                    results.packages.bronze.revenue.softwareOnly.reduce((a, b) => a + b, 0) +
                    results.packages.silver.revenue.softwareOnly.reduce((a, b) => a + b, 0) +
                    results.packages.gold.revenue.softwareOnly.reduce((a, b) => a + b, 0)
                  )}
                </div>
                <div className="text-emerald-200/70 text-xs mt-1">
                  Proyeksi pendapatan dari lisensi software selama 3 tahun
                </div>
                
                {/* Detail Proyeksi Per Tahun */}
                <div className="mt-12 pt-3 border-t border-emerald-500/20">
                  <div className="text-emerald-300 text-sm font-medium mb-3">Detail Proyeksi Per Tahun</div>
                  <div className="space-y-4">
                    {[0, 1, 2].map((yearIndex) => {
                      const bronzeRevenue = results.packages.bronze.revenue.softwareOnly[yearIndex];
                      const silverRevenue = results.packages.silver.revenue.softwareOnly[yearIndex];
                      const goldRevenue = results.packages.gold.revenue.softwareOnly[yearIndex];
                      const total = bronzeRevenue + silverRevenue + goldRevenue;
                      
                      return (
                        <div key={`detail-software-${yearIndex}`} className="bg-slate-800/50 rounded-lg p-3 border border-emerald-500/20">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-medium">Tahun {yearIndex + 1}</h3>
                            <p className="text-emerald-400 font-semibold">{formatCurrency(total)}</p>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Bronze</span>
                              <span className="text-slate-300">{formatCurrency(bronzeRevenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Silver</span>
                              <span className="text-slate-300">{formatCurrency(silverRevenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Gold</span>
                              <span className="text-slate-300">{formatCurrency(goldRevenue)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Bundling Results */}
          <motion.div
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur border border-blue-500/20 rounded-lg p-5"
          >
            <h3 className="text-blue-300 text-md font-medium mb-4 flex items-center">
              <DeviceTablet weight="light" size={18} className="mr-2" />
              Bundling (Software + Hardware)
            </h3>
            
            <div className="space-y-4">
              {/* Revenue per Package */}
              <div>
                <div className="text-blue-300 text-sm mb-2">Revenue per Paket (Tahun 1)</div>
                <div className="space-y-2">
                  {['bronze', 'silver', 'gold'].map((pkg) => (
                    <div key={`bundling-${pkg}`} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-blue-500/50 mr-2"></span>
                        <span className="text-slate-300 text-sm capitalize">{pkg}</span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {formatCurrency(results.packages[pkg].revenue.bundling[0])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Total Revenue */}
              <div className="pt-3 border-t border-blue-500/20">
                <div className="text-blue-300 text-sm mb-2">Total Revenue (3 Tahun)</div>
                <div className="text-white text-xl font-semibold">
                  {formatCurrency(
                    results.packages.bronze.revenue.bundling.reduce((a, b) => a + b, 0) +
                    results.packages.silver.revenue.bundling.reduce((a, b) => a + b, 0) +
                    results.packages.gold.revenue.bundling.reduce((a, b) => a + b, 0)
                  )}
                </div>
                <div className="text-blue-200/70 text-xs mt-1">
                  Proyeksi pendapatan dari bundling software dan hardware selama 3 tahun
                </div>
                {/* Detail Proyeksi Per Tahun */}
                <div className="mt-12 pt-3 border-t border-blue-500/20">
                  <div className="text-blue-300 text-sm font-medium mb-3">Detail Proyeksi Per Tahun</div>
                  <div className="space-y-4">
                    {[0, 1, 2].map((yearIndex) => {
                      const bronzeRevenue = results.packages.bronze.revenue.bundling[yearIndex];
                      const silverRevenue = results.packages.silver.revenue.bundling[yearIndex];
                      const goldRevenue = results.packages.gold.revenue.bundling[yearIndex];
                      const total = bronzeRevenue + silverRevenue + goldRevenue;
                      
                      return (
                        <div key={`detail-bundling-${yearIndex}`} className="bg-slate-800/50 rounded-lg p-3 border border-blue-500/20">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-medium">Tahun {yearIndex + 1}</h3>
                            <p className="text-blue-400 font-semibold">{formatCurrency(total)}</p>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Bronze</span>
                              <span className="text-slate-300">{formatCurrency(bronzeRevenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Silver</span>
                              <span className="text-slate-300">{formatCurrency(silverRevenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Gold</span>
                              <span className="text-slate-300">{formatCurrency(goldRevenue)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Assumptions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-xl p-6 border border-slate-700/50 shadow-lg"
      >
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowAssumptions(!showAssumptions)}
        >
          <h2 className="text-xl font-medium text-slate-200 flex items-center">
            <Lightbulb weight="light" size={20} className="mr-2 text-yellow-400" />
            Asumsi Perhitungan
          </h2>
          <div className="text-slate-400">
            {showAssumptions ? (
              <span className="text-sm">▲ Sembunyikan</span>
            ) : (
              <span className="text-sm">▼ Tampilkan</span>
            )}
          </div>
        </div>

        {showAssumptions && (
          <div className="mt-4 text-slate-300 text-sm">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <h3 className="font-medium mb-2">Asumsi Biaya</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                <li>Biaya Software: Harga paket per pengguna per tahun</li>
                <li>Biaya Bundling Hardware Bronze: Rp12.000.000 per pengguna</li>
                <li>Biaya Bundling Hardware Silver: Rp20.000.000 per pengguna</li>
                <li>Biaya Bundling Hardware Gold: Rp46.000.000 per pengguna</li>
              </ul>

              <h3 className="font-medium mt-4 mb-2">Asumsi Revenue</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                <li>Software Only: Hanya biaya lisensi software per tahun</li>
                <li>Bundling: Biaya software + hardware (tahun pertama)</li>
                <li>Tahun kedua dan seterusnya: Hanya biaya software (recurring)</li>
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}