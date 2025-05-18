import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';

const BillSearch = ({ onBillsFound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      onBillsFound(null); // Reset search results
      return;
    }

    setLoading(true);
    setError('');

    try {
      const customersRef = collection(db, 'users');
      let customerQuery;

      // Check if search term contains only digits (phone number)
      const isPhoneSearch = /^\d+$/.test(searchTerm);

      if (isPhoneSearch) {
        customerQuery = query(
          customersRef,
          where('role', '==', 'customer'),
          where('phone', '==', searchTerm)
        );
      } else {
        // Get all customers and filter by name manually for case-insensitive search
        customerQuery = query(
          customersRef,
          where('role', '==', 'customer')
        );
      }

      const customerSnapshot = await getDocs(customerQuery);
      let customerDocs = customerSnapshot.docs;
      
      // For name search, filter results manually for case-insensitive partial matches
      if (!isPhoneSearch && searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        customerDocs = customerDocs.filter(doc => {
          const customerData = doc.data();
          return customerData.name && customerData.name.toLowerCase().includes(searchTermLower);
        });
      }

      const customers = customerDocs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (customers.length === 0) {
        setError('No customers found');
        onBillsFound([]);
        return;
      }

      // Get bills for these customers
      const billsRef = collection(db, 'bills');
      const billsQuery = query(billsRef, where('customerId', 'in', customers.map(c => c.id)));
      const billsSnapshot = await getDocs(billsQuery);
      
      const bills = billsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        customerInfo: customers.find(c => c.id === doc.data().customerId)
      }));

      onBillsFound({ bills, customers });
    } catch (error) {
      console.error('Error searching bills:', error);
      setError('Error searching bills');
      onBillsFound([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter customer name or phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>

      {searchTerm && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onBillsFound?.customers?.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p>Phone: {customer.phone}</p>
                <p>Email: {customer.email}</p>
                <p>Address: {customer.address}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  Total Bills: {onBillsFound.bills.filter(b => b.customerId === customer.id).length}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillSearch;