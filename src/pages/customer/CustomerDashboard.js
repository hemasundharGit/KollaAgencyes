import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const CustomerDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [billCounts, setBillCounts] = useState({ pending: 0, paid: 0 });

  useEffect(() => {
    if (!loading && !user && !userData.role) {
      navigate('/login');
    } else if (userData.id) {
      fetchBillCounts();
    }
  }, [user, loading, navigate, userData.role, userData.id]);

  const fetchBillCounts = async () => {
    try {
      const billsRef = collection(db, 'bills');
      const q = query(billsRef, where('customerId', '==', userData.id));
      const querySnapshot = await getDocs(q);
      
      const counts = querySnapshot.docs.reduce((acc, doc) => {
        const status = doc.data().status;
        if (status === 'paid') {
          acc.paid += 1;
        } else {
          acc.pending += 1;
        }
        return acc;
      }, { pending: 0, paid: 0 });

      setBillCounts(counts);
    } catch (error) {
      console.error('Error fetching bill counts:', error);
    }
  };

  return (
    <Layout requireAuth>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative min-h-screen flex items-center justify-center">
        <div className="px-4 py-4 sm:px-0 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              Welcome, {userData.name || user?.name || 'mohan'} Garu
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                className="text-4xl md:text-5xl"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl font-medium">
              Manage your bills and payments easily
            </p>
            <div className="flex justify-center gap-8 mt-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20"
              >
                <p className="text-white/60 text-sm">Bills Pending</p>
                <p className="text-3xl font-bold text-white">{billCounts.pending}</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20"
              >
                <p className="text-white/60 text-sm">Bills Paid</p>
                <p className="text-3xl font-bold text-white">{billCounts.paid}</p>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 px-4 sm:px-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/70 backdrop-blur-[10px] overflow-hidden shadow-lg rounded-2xl border border-white/50 relative group hover:bg-white/80 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className="flex-shrink-0 bg-primary-100 p-3 rounded-xl"
                    whileHover={{ rotate: 12 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </motion.div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">My Bills</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">View Bills</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100/20">
                <Link 
                  to="/customer/bills" 
                  className="font-medium text-primary-600 hover:text-primary-700 inline-flex items-center transition-all duration-300 hover:translate-x-2 group/link"
                >
                  <span className="group-hover/link:underline">View all bills</span>
                  <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/70 backdrop-blur-[10px] overflow-hidden shadow-lg rounded-2xl border border-white/50 relative group hover:bg-white/80 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className="flex-shrink-0 bg-primary-100 p-3 rounded-xl"
                    whileHover={{ rotate: 12 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </motion.div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Make Payment</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">Pay Now</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100/20">
                <Link 
                  to="/customer/payment" 
                  className="font-medium text-primary-600 hover:text-primary-700 inline-flex items-center transition-all duration-300 hover:translate-x-2 group/link"
                >
                  <span className="group-hover/link:underline">Go to payment</span>
                  <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;