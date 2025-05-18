import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUsers, FaFileInvoiceDollar, FaFileUpload, FaChartBar, FaBoxOpen } from 'react-icons/fa';

const Dashboard = () => {
  const cards = [
    {
      title: 'Create Product',
      description: 'Add new products to inventory',
      icon: <FaBoxOpen className="w-8 h-8 text-orange-500" />,
      link: '/admin/create-product',
      color: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      title: 'Manage Customers',
      description: 'View and manage existing customers',
      icon: <FaUsers className="w-8 h-8 text-indigo-500" />,
      link: '/admin/customers',
      color: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      title: 'Bills',
      description: 'View and manage customer bills',
      icon: <FaFileInvoiceDollar className="w-8 h-8 text-green-500" />,
      link: '/admin/bills',
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Upload Bill',
      description: 'Create and upload new bills',
      icon: <FaFileUpload className="w-8 h-8 text-purple-500" />,
      link: '/admin/upload-bill',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Stock Report',
      description: 'View and manage stock inventory',
      icon: <FaChartBar className="w-8 h-8 text-blue-500" />,
      link: '/admin/stock-report',
      color: 'bg-blue-50 hover:bg-blue-100'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`${card.color} p-6 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-white shadow-sm">
                {card.icon}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h2>
            <p className="text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;