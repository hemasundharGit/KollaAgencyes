import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isCustomer = userData.role === 'customer';

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                Kolla Agencies
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600">
                Home
              </Link>
              <Link to="/about" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600">
                About
              </Link>
              <Link to="/products" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600">
                Products
              </Link>
              <Link to="/blogs" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary-600">
                Blogs
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!window.location.pathname.includes('/login') && (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;