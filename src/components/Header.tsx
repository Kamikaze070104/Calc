import React, { useState, useEffect } from 'react';
import { List, X, Calculator } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

            <div className="hidden md:block">
              <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-300">
                <span className="font-light text-sm tracking-wide">Live Calculator & Projections</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}