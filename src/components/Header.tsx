import React, { useState, useEffect, useRef } from 'react';
import { List, X, Calculator, Headset, Robot, Brain, Briefcase, CaretDown, ChartLine } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle desktop dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      
      // Handle mobile dropdown
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        const mobileDropdown = document.getElementById('mobile-investor-dropdown');
        if (mobileDropdown) {
          mobileDropdown.classList.add('hidden');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Calculator weight="light" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-light tracking-tight text-white">
                Revenue <span className="font-medium">Calculator</span>
              </h1>
            </motion.div>

            <div className="hidden md:flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${activeSection === 'combined' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                onClick={() => onSectionChange('combined')}
              >
                <Calculator size={20} />
                <span>Telemarketing</span>
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${activeSection === 'liveaudio' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                onClick={() => onSectionChange('liveaudio')}
              >
                <Headset size={20} />
                <span>Live Audio</span>
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${activeSection === 'lokalai' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                onClick={() => onSectionChange('lokalai')}
              >
                <Brain size={20} />
                <span>LokalAI</span>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${activeSection.startsWith('investor') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Briefcase size={20} />
                  <span>Investor</span>
                  <CaretDown size={16} className="ml-1" />
                </button>
                <div className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 ${isDropdownOpen ? '' : 'hidden'}`}>
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {/* <button
                      className={`block w-full text-left px-4 py-2 text-sm ${activeSection === 'investor' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300 hover:bg-slate-700'}`}
                      onClick={() => onSectionChange('investor')}
                    >
                      <span className="flex items-center">
                        <ChartLine weight="light" size={16} className="mr-2" />
                        Combined Projection
                      </span>
                    </button> */}
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${activeSection === 'investor-telemarketing' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300 hover:bg-slate-700'}`}
                      onClick={() => onSectionChange('investor-telemarketing')}
                    >
                      <span className="flex items-center">
                        <Calculator weight="light" size={16} className="mr-2" />
                        Telemarketing
                      </span>
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${activeSection === 'investor-liveaudio' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-300 hover:bg-slate-700'}`}
                      onClick={() => onSectionChange('investor-liveaudio')}
                    >
                      <span className="flex items-center">
                        <Headset weight="light" size={16} className="mr-2" />
                        Live Audio
                      </span>
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${activeSection === 'investor-lokalai' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-700'}`}
                      onClick={() => onSectionChange('investor-lokalai')}
                    >
                      <span className="flex items-center">
                        <Brain weight="light" size={16} className="mr-2" />
                        LokalAI
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-400 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-slate-900 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-2 space-y-1">
              <div
                onClick={() => {
                  onSectionChange('combined');
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${activeSection === 'combined' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <span className="flex items-center">
                  <Calculator weight="light" size={16} className="mr-1" />
                  Telemarketing Calculator
                </span>
              </div>
              <div
                onClick={() => {
                  onSectionChange('liveaudio');
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${activeSection === 'liveaudio' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <span className="flex items-center">
                  <Headset weight="light" size={16} className="mr-1" />
                  Live Audio Calculator
                </span>
              </div>
              <div
                onClick={() => {
                  onSectionChange('lokalai');
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${activeSection === 'lokalai' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <span className="flex items-center">
                  <Brain weight="light" size={16} className="mr-1" />
                  LokalAI Calculator
                </span>
              </div>
              <div className="relative" ref={mobileDropdownRef}>
                <div
                  onClick={() => {
                    const dropdown = document.getElementById('mobile-investor-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${activeSection.startsWith('investor') ? 'bg-green-500/20 text-green-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <span className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase weight="light" size={16} className="mr-1" />
                      Investor
                    </div>
                    <CaretDown size={16} />
                  </span>
                </div>
                <div id="mobile-investor-dropdown" className="pl-4 space-y-1 mt-1 hidden">
                  <div
                    onClick={() => {
                      onSectionChange('investor');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${activeSection === 'investor' ? 'bg-green-500/20 text-green-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <span className="flex items-center">
                      <ChartLine weight="light" size={16} className="mr-1" />
                      Combined Projection
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      onSectionChange('investor-telemarketing');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${activeSection === 'investor-telemarketing' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <span className="flex items-center">
                      <Calculator weight="light" size={16} className="mr-1" />
                      Telemarketing
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      onSectionChange('investor-liveaudio');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${activeSection === 'investor-liveaudio' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <span className="flex items-center">
                      <Headset weight="light" size={16} className="mr-1" />
                      Live Audio
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      onSectionChange('investor-lokalai');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${activeSection === 'investor-lokalai' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    <span className="flex items-center">
                      <Brain weight="light" size={16} className="mr-1" />
                      LokalAI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  );
}