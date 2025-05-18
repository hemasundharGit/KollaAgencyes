import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaShieldAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const testimonials = [
    { name: 'John Doe', text: 'Excellent service and quality products. Highly recommended!', role: 'Regular Customer' },
    { name: 'Jane Smith', text: 'The best agency for all our needs. Great customer support!', role: 'Business Owner' },
    { name: 'Mike Johnson', text: 'Professional team and reliable service every time.', role: 'Retailer' }
  ];

  return (
    <Layout>
      <div className="flex-grow">
        {/* Hero Section with Gradient */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                Welcome to
                <span className="block text-yellow-300">Kolla Agencies</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-gray-100">
                Your trusted partner for quality products and exceptional service.
                Discover our wide range of products and experience seamless billing.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <motion.div 
                  className="rounded-md shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                  >
                    Get Started
                  </Link>
                </motion.div>
                <motion.div 
                  className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/products"
                    className="w-full flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-600 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                  >
                    View Products
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              {...fadeInUp}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Choose Us</h2>
              <p className="mt-4 text-lg text-gray-500">We provide the best service with guaranteed satisfaction</p>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div 
                className="bg-white rounded-lg shadow-lg p-6 text-center"
                {...fadeInUp}
              >
                <div className="text-blue-600 mx-auto">
                  <FaCheckCircle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Best Quality</h3>
                <p className="mt-2 text-gray-500">We ensure top-quality products that meet your expectations</p>
              </motion.div>

              <motion.div 
                className="bg-white rounded-lg shadow-lg p-6 text-center"
                {...fadeInUp}
              >
                <div className="text-blue-600 mx-auto">
                  <FaShieldAlt className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Secure Payments</h3>
                <p className="mt-2 text-gray-500">Your transactions are protected with secure payment methods</p>
              </motion.div>

              <motion.div 
                className="bg-white rounded-lg shadow-lg p-6 text-center"
                {...fadeInUp}
              >
                <div className="text-blue-600 mx-auto">
                  <FaClock className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">24/7 Support</h3>
                <p className="mt-2 text-gray-500">Our team is always ready to assist you anytime</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              {...fadeInUp}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">What Our Customers Say</h2>
              <p className="mt-4 text-lg text-gray-500">Don't just take our word for it</p>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <p className="text-gray-600 italic">{testimonial.text}</p>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/919502386466"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaWhatsapp className="h-6 w-6" />
        </motion.a>
      </div>
    </Layout>
  );
};

export default Home;