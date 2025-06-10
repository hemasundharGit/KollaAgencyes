import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoAssembler from './LogoAssembler';

const KAIntroScreen = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      handleComplete();
      return;
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleComplete = () => {
    setShow(false);
    localStorage.setItem('hasSeenIntro', 'true');
    setTimeout(() => onComplete(), 500);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cGF0aCBkPSJNMzAgNjBMMCA2MCAwIDAgNjAgMCA2MCA2MCAzMCA2MCAzMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>

          <motion.div 
            className="relative flex flex-col items-center justify-center p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              <LogoAssembler progress={1} />
            </motion.div>
            
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-gray-800 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Welcome to Kolla Agencies
            </motion.h1>
            
            <motion.p
              className="mt-4 text-lg text-gray-600 text-center max-w-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Your trusted partner for quality products
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KAIntroScreen;