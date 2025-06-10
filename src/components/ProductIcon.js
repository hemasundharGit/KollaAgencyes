import React from 'react';
import { motion } from 'framer-motion';

const ProductIcon = ({ icon, name, onClick, isClicked }) => {
  const iconVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      y: [-5, 0, -5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    click: {
      scale: 0.8,
      opacity: 0,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      className={`cursor-pointer ${isClicked ? 'pointer-events-none' : ''}`}
      variants={iconVariants}
      initial="initial"
      animate={isClicked ? 'click' : 'animate'}
      whileHover={!isClicked && 'hover'}
      onClick={onClick}
    >
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
          {icon}
        </div>
        <p className="text-center mt-2 text-sm font-medium text-gray-700">{name}</p>
      </div>
    </motion.div>
  );
};

export default ProductIcon;