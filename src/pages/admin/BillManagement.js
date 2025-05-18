import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';
import BillSearch from '../../components/BillSearch';
import { useAuth } from '../../hooks/useAuth';

const BillManagement = () => {
  const { user, loading } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [bills, setBills] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillDetails, setShowBillDetails] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchCustomers();
      fetchAllBills();
    }
  }, [user, loading]);

  const fetchAllBills = async () => {
    try {
      const billsRef = collection(db, 'bills');
      const querySnapshot = await getDocs(billsRef);
      const billsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBills(billsList);
      setSearchResults(null);
    } catch (error) {
      setError('Error fetching bills');
    }
  };

  const handleSearchResults = (results) => {
    if (!results) {
      setSearchResults(null);
      setSelectedCustomerId(null);
      return;
    }
    setSearchResults(results);
    setSelectedCustomerId(null);
  };

  const handleCustomerSelect = async (customerId) => {
    setSelectedCustomerId(customerId);
    try {
      const billsRef = collection(db, 'bills');
      const q = query(billsRef, where('customerId', '==', customerId));
      const querySnapshot = await getDocs(q);
      const customerBills = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBills(customerBills);
    } catch (error) {
      setError('Error fetching customer bills');
    }
  };

  const resetToCustomerList = async () => {
    setSelectedCustomerId(null);
    await fetchAllBills();
  };

  const fetchCustomers = async () => {
    try {
      const customersRef = collection(db, 'users');
      const q = query(customersRef, where('role', '==', 'customer'));
      const querySnapshot = await getDocs(q);
      const customersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(customersList);
    } catch (error) {
      setError('Error fetching customers');
    }
  };

  return (
      <div className="space-y-6">
        <BillSearch onBillsFound={handleSearchResults} />

        {/* Customer Cards */}
        {!selectedCustomerId && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {customers.filter(customer => 
              !searchResults || searchResults.bills?.some(bill => bill.customerId === customer.id)
            ).map((customer) => {
              const customerBills = bills.filter(bill => bill.customerId === customer.id);
              const customerBillCount = customerBills.length;
              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCustomerSelect(customer.id)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Total Bills: {customerBillCount}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Selected Customer Bills */}
        {selectedCustomerId && (
          <div className="mt-6">
            <button
              onClick={resetToCustomerList}
              className="mb-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Customers
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bills.map((bill) => {
                const customer = customers.find(c => c.id === bill.customerId);
                return (
                  <motion.div
                    key={bill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedBill(bill);
                      setShowBillDetails(true);
                    }}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {customer?.name || 'Unknown Customer'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Bill #{bill.id.slice(0, 8)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {bill.status}
                          </span>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (updating) return;
                              setUpdating(true);
                              try {
                                const billRef = doc(db, 'bills', bill.id);
                                const newStatus = bill.status === 'paid' ? 'pending' : 'paid';
                                await updateDoc(billRef, {
                                  status: newStatus
                                });
                                // Update local state
                                setBills(prevBills =>
                                  prevBills.map(b =>
                                    b.id === bill.id ? { ...b, status: newStatus } : b
                                  )
                                );
                              } catch (err) {
                                setError('Failed to update bill status');
                                console.error('Error updating bill status:', err);
                              } finally {
                                setUpdating(false);
                              }
                            }}
                            className={`px-2 py-1 text-xs font-medium text-white rounded hover:opacity-90 disabled:opacity-50 ${bill.status === 'paid' ? 'bg-orange-600' : 'bg-indigo-600'}`}
                            disabled={updating}
                          >
                            {bill.status === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Date: {new Date(bill.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-2">
                          ₹{bill.grandTotal}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bill Details Modal */}
        {showBillDetails && selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">Bill Details</h2>
                  <button
                    onClick={() => {
                      setShowBillDetails(false);
                      setSelectedBill(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium">Customer Information</h3>
                    <p className="text-gray-600">{customers.find(c => c.id === selectedBill.customerId)?.name}</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Items</h3>
                    <div className="space-y-2">
                      {selectedBill.items?.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.product} ({item.boxes} boxes) x {item.quantity}</span>
                          <span>₹{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{selectedBill.grandTotal}</span>
                    </div>
                    {selectedBill.tax && (
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{selectedBill.tax}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{selectedBill.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
  );
};

export default BillManagement;