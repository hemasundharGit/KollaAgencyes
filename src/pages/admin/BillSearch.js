import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const BillSearch = ({ onBillsFound }) => {
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) {
      setError('Please enter a customer name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, find customers with matching names
      const usersRef = collection(db, 'users');
      const userQuery = query(
        usersRef,
        where('role', '==', 'customer'),
        where('name', '>=', searchName.toLowerCase()),
        where('name', '<=', searchName.toLowerCase() + '\uf8ff')
      );
      
      const userSnapshot = await getDocs(userQuery);
      const customerIds = userSnapshot.docs.map(doc => doc.id);

      if (customerIds.length === 0) {
        setError('No customers found with that name');
        onBillsFound([]);
        return;
      }

      // Then, fetch bills for these customers
      const billsRef = collection(db, 'bills');
      const bills = [];

      for (const customerId of customerIds) {
        const billQuery = query(billsRef, where('customerId', '==', customerId));
        const billSnapshot = await getDocs(billQuery);
        
        billSnapshot.docs.forEach(doc => {
          bills.push({
            id: doc.id,
            ...doc.data(),
            customerName: userSnapshot.docs.find(u => u.id === customerId).data().name
          });
        });
      }

      onBillsFound(bills);
      
      if (bills.length === 0) {
        setError('No bills found for this customer');
      }
    } catch (error) {
      console.error('Error searching bills:', error);
      setError('Error searching bills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-1">
            Search Bills by Customer Name
          </label>
          <input
            type="text"
            id="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter customer name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default BillSearch;