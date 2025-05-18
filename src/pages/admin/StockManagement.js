import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';

const StockManagement = () => {
  const [stockItems, setStockItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    pricePerKg: '',
    quantityBags: '',
    quantityKgs: '',
    arrivalDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchStockItems();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await addDoc(collection(db, 'stock'), {
        ...newItem,
        pricePerKg: parseFloat(newItem.pricePerKg),
        quantityBags: parseInt(newItem.quantityBags),
        quantityKgs: parseFloat(newItem.quantityKgs),
        availableQuantityBags: parseInt(newItem.quantityBags),
        availableQuantityKgs: parseFloat(newItem.quantityKgs),
        arrivalDate: newItem.arrivalDate,
        createdAt: new Date().toISOString()
      });

      setSuccess('Stock item added successfully');
      setNewItem({
        name: '',
        pricePerKg: '',
        quantityBags: '',
        quantityKgs: '',
        arrivalDate: new Date().toISOString().split('T')[0]
      });
      fetchStockItems();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateItem = async (itemId, updatedData) => {
    try {
      const itemRef = doc(db, 'stock', itemId);
      await updateDoc(itemRef, {
        ...updatedData,
        pricePerKg: parseFloat(updatedData.pricePerKg),
        currentStock: parseFloat(updatedData.currentStock)
      });
      setSuccess('Stock item updated successfully');
      setEditingItem(null);
      fetchStockItems();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'stock', itemId));
        setSuccess('Stock item deleted successfully');
        fetchStockItems();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Stock Item</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new item to your stock inventory.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleAddItem}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="pricePerKg" className="block text-sm font-medium text-gray-700">
                      Price per KG
                    </label>
                    <input
                      type="number"
                      name="pricePerKg"
                      id="pricePerKg"
                      value={newItem.pricePerKg}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                      step="0.01"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700">
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      name="arrivalDate"
                      id="arrivalDate"
                      value={newItem.arrivalDate}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="quantityBags" className="block text-sm font-medium text-gray-700">
                      Quantity (Bags)
                    </label>
                    <input
                      type="number"
                      name="quantityBags"
                      id="quantityBags"
                      value={newItem.quantityBags}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="quantityKgs" className="block text-sm font-medium text-gray-700">
                      Quantity (KGs)
                    </label>
                    <input
                      type="number"
                      name="quantityKgs"
                      id="quantityKgs"
                      value={newItem.quantityKgs}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                      step="0.01"
                    />
                  </div>
                </div>

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
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Stock Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Stock Items List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per KG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arrival Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Bags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available KGs
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
              {stockItems.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">₹{item.pricePerKg}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(item.arrivalDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.availableQuantityBags}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.availableQuantityKgs}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.availableQuantityKgs > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.availableQuantityKgs > 0 ? 'In Stock' : `${item.name} stock is completed`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Edit Stock Item</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateItem(editingItem.id, editingItem);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price per KG</label>
                    <input
                      type="number"
                      value={editingItem.pricePerKg}
                      onChange={(e) => setEditingItem({ ...editingItem, pricePerKg: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Stock (KG)</label>
                    <input
                      type="number"
                      value={editingItem.currentStock}
                      onChange={(e) => setEditingItem({ ...editingItem, currentStock: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StockManagement;