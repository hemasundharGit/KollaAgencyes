import React, { useState } from 'react';
import BillSearch from '../../components/BillSearch';
import Layout from '../../components/Layout';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Bills = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleBillsFound = (results) => {
    setSearchResults(results);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex items-center mb-6">
            <Link to="/admin" className="text-primary-600 hover:text-primary-900 mr-4">
              <FaArrowLeft className="inline-block" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Customer Bills</h1>
          </div>

          <BillSearch onBillsFound={handleBillsFound} />

          {searchResults?.bills && searchResults.bills.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bills</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {searchResults.bills.map((bill) => (
                    <li key={bill.id} className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Customer Information</h3>
                        <p className="text-gray-600">{bill.customerInfo?.name}</p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Items</h3>
                        {bill.items && bill.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-gray-800 capitalize">
                                {item.product} ({item.boxes} boxes) x {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-900 font-medium">₹{item.total}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-600">Subtotal</p>
                          <p className="text-gray-900 font-medium">₹{bill.total}</p>
                        </div>
                        <div className="flex justify-between items-center text-lg font-medium">
                          <p className="text-gray-800">Total</p>
                          <p className="text-gray-900">₹{bill.grandTotal || bill.total}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-gray-600">Bill #{bill.id.slice(0, 8)}</p>
                            <p className="text-gray-600 mt-1">Issue Date: {bill.issueDate}</p>
                            <p className="text-gray-600 mt-1">Due Date: {bill.dueDate || 'Invalid Date'}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              bill.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {bill.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Bills;