import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LogoReveal = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if logo has been shown in this session
    const hasShownLogo = sessionStorage.getItem('hasShownLogo');
    if (hasShownLogo) {
      setShow(false);
      return;
    }

    // Hide logo after animation
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('hasShownLogo', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const svgVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      transition: { duration: 0.5, ease: 'easeIn' }
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={svgVariants}
        >
          <motion.svg
            width="200"
            height="200"
            viewBox="0 0 100 100"
            className="text-primary-600"
          >
            {/* K letter */}
            <motion.path
              d="M20 20 L20 80 M20 50 L50 20 M20 50 L50 80"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              variants={pathVariants}
            />
            {/* A letter */}
            <motion.path
              d="M60 80 L75 20 L90 80 M65 60 L85 60"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              variants={pathVariants}
            />
            {/* Decorative grain elements */}
            <motion.circle
              cx="35"
              cy="35"
              r="3"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2, duration: 0.3 }}
            />
            <motion.circle
              cx="75"
              cy="35"
              r="3"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.2, duration: 0.3 }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoReveal;