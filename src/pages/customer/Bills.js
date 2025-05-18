import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';

const Bills = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, [user]);

  const fetchBills = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (!userData.id) {
        console.error('User data not found');
        return;
      }
      const billsRef = collection(db, 'bills');
      const q = query(billsRef, where('customerId', '==', userData.id));
      const querySnapshot = await getDocs(q);
      const billsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBills(billsList);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout requireAuth>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">My Bills</h1>
          
          <div className="mt-6">
            {bills.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bills</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any bills yet.</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {bills.map((bill) => (
                    <li key={bill.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-600 truncate">
                              Bill #{bill.id.slice(0, 8)}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Issue Date: {bill.issueDate}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Due Date: {bill.dueDate ? bill.dueDate : 'Invalid Date'}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {bill.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          {bill.items && bill.items.map((item, idx) => (
                            <div key={idx} className="mb-2">
                              <p className="text-sm font-medium text-gray-800 capitalize">
                                {item.product}
                              </p>
                              <div className="ml-4 text-sm text-gray-600">
                                <p>Quantity: {item.boxes} boxes, {item.quantity} kg</p>
                                <p>Price: ₹{item.cost} per kg</p>
                                <p className="text-gray-700">Total: {item.quantity} × ₹{item.cost} = ₹{item.total}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Total Amount: ₹{bill.grandTotal || bill.total}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <button
                              onClick={() => window.print()}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Download Bill
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bills;