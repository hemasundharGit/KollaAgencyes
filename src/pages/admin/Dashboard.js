import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import CustomerManagement from './CustomerManagement';
import BillManagement from './BillManagement';
import UploadBill from './UploadBill';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('customers');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname.split('/').pop();
    if (path === 'dashboard' || path === 'admin') {
      setActiveTab('customers');
    } else {
      setActiveTab(path);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Kolla's Admin Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/admin/customers"
                  className={`${
                    activeTab === 'customers'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={() => setActiveTab('customers')}
                >
                  Customers
                </Link>
                <Link
                  to="/admin/bills"
                  className={`${
                    activeTab === 'bills'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={() => setActiveTab('bills')}
                >
                  Bills
                </Link>
                <Link
                  to="/admin/upload-bill"
                  className={`${
                    activeTab === 'upload-bill'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={() => setActiveTab('upload-bill')}
                >
                  Upload Bill
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {userData.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route index element={<CustomerManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="bills" element={<BillManagement />} />
            <Route path="upload-bill" element={<UploadBill />} />
          </Routes>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard; 