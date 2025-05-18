import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import Breadcrumb from './Breadcrumb';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!loading) {
      if (!user && !userData.role) {
        navigate('/login');
      } else if (user && user.role !== 'admin' && userData.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const location = useLocation();
  const [activeTab, setActiveTab] = useState('customers');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin') {
      navigate('/admin/dashboard');
    } else if (path !== 'dashboard') {
      setActiveTab(path);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100">
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
                  Manage Customers
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
                <Link
                  to="/admin/add-stock"
                  className={`${
                    activeTab === 'add-stock'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={() => setActiveTab('add-stock')}
                >
                  Stock Management
                </Link>
                <Link
                  to="/admin/create-product"
                  className={`${
                    activeTab === 'create-product'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={() => setActiveTab('create-product')}
                >
                  Create Product
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Breadcrumb />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;