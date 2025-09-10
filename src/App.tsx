import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import CombinedCalculator from './components/CombinedCalculator';
import LiveAudioCalculator from './components/LiveAudioCalculator';
import LokalAICalculator from './components/LokalAICalculator';
import InvestorProjection from './components/InvestorProjection';
import InvestorTelemarketing from './components/InvestorTelemarketing';
import InvestorLiveAudio from './components/InvestorLiveAudio';
import InvestorLokalAI from './components/InvestorLokalAI';

function App() {
  const [activeSection, setActiveSection] = useState('combined');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      <motion.main
        key={activeSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'combined' && <CombinedCalculator />}
        {activeSection === 'liveaudio' && <LiveAudioCalculator />}
        {activeSection === 'lokalai' && <LokalAICalculator />}
        {activeSection === 'investor' && <InvestorProjection />}
        {activeSection === 'investor-telemarketing' && <InvestorTelemarketing />}
        {activeSection === 'investor-liveaudio' && <InvestorLiveAudio />}
        {activeSection === 'investor-lokalai' && <InvestorLokalAI />}
      </motion.main>
    </div>
  );
}

export default App;