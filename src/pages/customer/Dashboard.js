import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import logo from '../../assets/logo.png';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    fetchCustomerBills();
  }, []);

  const fetchCustomerBills = async () => {
    try {
      const billsRef = collection(db, 'bills');
      const q = query(billsRef, where('customerId', '==', userData.id));
      const querySnapshot = await getDocs(q);
      
      const billsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt).toLocaleDateString()
      }));
      
      setBills(billsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError('Error loading bills');
      setLoading(false);
    }
  };

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
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src={logo} alt="Kolla Agencies Logo" className="h-12 w-auto mr-4" />
              <h1 className="text-xl font-bold text-gray-800">Customer Portal</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {userData.phone}</span>
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
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-6">Your Bills</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center">Loading bills...</div>
          ) : bills.length === 0 ? (
            <div className="text-center text-gray-500">No bills found</div>
          ) : (
            <div className="space-y-6">
              {bills.map((bill) => (
                <div key={bill.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold">Bill #{bill.id.slice(-6)}</div>
                    <div className="text-sm text-gray-500">{bill.createdAt}</div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Boxes/Bags</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity (kg)</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Cost per kg</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bill.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900 capitalize">{item.product}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.boxes}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">₹{item.cost}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">₹{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="px-4 py-2 text-right font-semibold">Grand Total:</td>
                          <td className="px-4 py-2 text-lg font-bold text-gray-900">₹{bill.grandTotal}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    Status: <span className="capitalize">{bill.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard; 