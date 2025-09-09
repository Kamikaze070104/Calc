import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import CombinedCalculator from './components/CombinedCalculator';

function App() {
  const [activeSection, setActiveSection] = useState('combined');

  return (
    <div className="font-['Inter'] antialiased">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <CombinedCalculator />
      </motion.main>
    </div>
  );
}

export default App;