import React from 'react';
import { motion } from 'framer-motion';

const LogoAssembler = ({ progress }) => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, delay: i * 0.1 },
        opacity: { duration: 0.01 }
      }
    })
  };

  const calculateOpacity = (threshold) => {
    return progress >= threshold ? 1 : 0;
  };

  return (
    <motion.svg
      width="400"
      height="200"
      viewBox="0 0 400 200"
      className="text-primary-600"
      initial="hidden"
      animate="visible"
    >
      {/* K letter */}
      <motion.path
        d="M80 40 L80 160 M80 100 L140 40 M80 100 L140 160"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        custom={0}
        variants={pathVariants}
        style={{ opacity: calculateOpacity(0.4) }}
      />
      {/* A letter */}
      <motion.path
        d="M200 160 L240 40 L280 160 M215 120 L265 120"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        custom={1}
        variants={pathVariants}
        style={{ opacity: calculateOpacity(0.8) }}
      />
      {/* Decorative elements */}
      <motion.circle
        cx="110"
        cy="70"
        r="6"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: progress >= 1 ? 1 : 0 }}
        transition={{ delay: 0.3 }}
      />
      <motion.circle
        cx="240"
        cy="70"
        r="6"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: progress >= 1 ? 1 : 0 }}
        transition={{ delay: 0.4 }}
      />
      {/* Company name reveal */}
      <motion.text
        x="200"
        y="190"
        textAnchor="middle"
        className="text-2xl font-bold"
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress >= 1 ? 1 : 0 }}
        transition={{ delay: 0.5 }}
      >
        Kolla Agencies
      </motion.text>
    </motion.svg>
  );
};

export default LogoAssembler;