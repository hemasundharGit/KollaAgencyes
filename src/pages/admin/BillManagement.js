import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';

const BillManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [newBillItem, setNewBillItem] = useState({
    productId: '',
    quantityBoxes: '',
    quantityKg: '',
    costPerKg: 0,
    total: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchStockItems();
    fetchBills();
  }, []);

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

  const fetchStockItems = async () => {
    try {
      const stockRef = collection(db, 'stock');
      const querySnapshot = await getDocs(stockRef);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStockItems(items);
    } catch (error) {
      setError('Error fetching stock items');
    }
  };

  const fetchBills = async () => {
    try {
      const billsRef = collection(db, 'bills');
      const querySnapshot = await getDocs(billsRef);
      const billsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBills(billsList);
    } catch (error) {
      setError('Error fetching bills');
    }
  };

  const handleProductSelect = (productId) => {
    const selectedProduct = stockItems.find(item => item.id === productId);
    setNewBillItem(prev => ({
      ...prev,
      productId,
      costPerKg: selectedProduct.pricePerKg,
      total: selectedProduct.pricePerKg * (prev.quantityKg || 0)
    }));
  };

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    const quantity = parseFloat(value) || 0;
    const costPerKg = newBillItem.costPerKg;
    
    setNewBillItem(prev => ({
      ...prev,
      [name]: value,
      total: name === 'quantityKg' ? quantity * costPerKg : prev.total
    }));
  };

  const handleAddBillItem = () => {
    if (!newBillItem.productId || !newBillItem.quantityKg) {
      setError('Please fill in all required fields');
      return;
    }

    const selectedProduct = stockItems.find(item => item.id === newBillItem.productId);
    setBillItems(prev => [...prev, {
      ...newBillItem,
      productName: selectedProduct.name,
      quantityKg: parseFloat(newBillItem.quantityKg),
      quantityBoxes: parseFloat(newBillItem.quantityBoxes),
      costPerKg: parseFloat(newBillItem.costPerKg),
      total: parseFloat(newBillItem.total)
    }]);

    setNewBillItem({
      productId: '',
      quantityBoxes: '',
      quantityKg: '',
      costPerKg: 0,
      total: 0
    });
  };

  const handleCreateBill = async () => {
    if (!selectedCustomer || billItems.length === 0) {
      setError('Please select a customer and add bill items');
      return;
    }

    try {
      const grandTotal = billItems.reduce((sum, item) => sum + item.total, 0);
      
      await addDoc(collection(db, 'bills'), {
        customerId: selectedCustomer,
        items: billItems,
        grandTotal,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      setSuccess('Bill created successfully');
      setSelectedCustomer('');
      setBillItems([]);
      fetchBills();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateBillStatus = async (billId, newStatus) => {
    try {
      await updateDoc(doc(db, 'bills', billId), {
        status: newStatus
      });
      setSuccess('Bill status updated successfully');
      fetchBills();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Bill</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new bill for a customer.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="space-y-6">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Customer
                  </label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Bill Item Form */}
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Product
                    </label>
                    <select
                      value={newBillItem.productId}
                      onChange={(e) => handleProductSelect(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select a product</option>
                      {stockItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - ₹{item.pricePerKg}/kg
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity (Boxes)
                    </label>
                    <input
                      type="number"
                      name="quantityBoxes"
                      value={newBillItem.quantityBoxes}
                      onChange={handleQuantityChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      min="0"
                      step="1"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity (KG)
                    </label>
                    <input
                      type="number"
                      name="quantityKg"
                      value={newBillItem.quantityKg}
                      onChange={handleQuantityChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Cost per KG
                    </label>
                    <input
                      type="number"
                      value={newBillItem.costPerKg}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      disabled
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Total
                    </label>
                    <input
                      type="number"
                      value={newBillItem.total}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddBillItem}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Item
                </button>
              </div>

              {/* Bill Items List */}
              {billItems.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900">Bill Items</h4>
                  <table className="min-w-full divide-y divide-gray-200 mt-2">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity (Boxes)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity (KG)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost per KG
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {billItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantityBoxes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantityKg}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{item.costPerKg}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{item.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {error && (
                <div className="mt-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-2 text-sm text-green-600">
                  {success}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleCreateBill}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Bill
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.map((bill) => {
                const customer = customers.find(c => c.id === bill.customerId);
                return (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer?.name || 'Unknown Customer'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        ₹{bill.grandTotal}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUpdateBillStatus(bill.id, bill.status === 'paid' ? 'pending' : 'paid')}
                        className={`${
                          bill.status === 'paid' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        Mark as {bill.status === 'paid' ? 'Pending' : 'Paid'}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default BillManagement; 