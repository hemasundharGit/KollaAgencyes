import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, requireAuth }) => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('userData');

    if (requireAuth) {
      if (!loading) {
        if (user || (userRole === 'customer' && userData)) {
          setIsAuthenticated(true);
        } else {
          navigate('/login');
        }
      }
    } else {
      setIsAuthenticated(true);
    }
  }, [user, loading, navigate, requireAuth]);

  const path = window.location.pathname;
  const isCustomerDashboard = path.startsWith('/customer/');
  const isAdminDashboard = path.startsWith('/admin/');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Static background for customer dashboard */}
      {isCustomerDashboard && (
        <div className="fixed inset-0 z-0 bg-[#fafafa]"></div>
      )}
      
      {/* Navigation */}
      {!isAdminDashboard && (isCustomerDashboard && requireAuth ? (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md shadow-lg border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                  <span className="ml-3 text-xl font-bold text-gray-800">
                    Kolla Agencies
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-white/80 hover:bg-white/90 text-primary-600 hover:text-primary-700 border border-primary-100 px-6 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-300 ease-in-out"
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </nav>
        </header>
      ) : (
        <Navbar />
      ))}
      
      {/* Main content */}
      <main className="flex-grow relative z-10 pb-[400px] sm:pb-[300px]">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      
      {/* Footer - only shown on non-dashboard pages */}
      {!isCustomerDashboard && !isAdminDashboard && <Footer />}
    </div>
  );
};

export default Layout;