import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';

const UploadBill = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ product: '', boxes: '', quantity: '', cost: '', total: 0 }]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableStock, setAvailableStock] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchAvailableStock();
  }, []);

  const fetchAvailableStock = async () => {
    try {
      // First fetch active products
      const productsRef = collection(db, 'products');
      const productsSnapshot = await getDocs(productsRef);
      const activeProducts = new Set(productsSnapshot.docs.map(doc => doc.data().name));

      // Then fetch stock data and filter by active products
      const stockRef = collection(db, 'stock');
      const querySnapshot = await getDocs(stockRef);
      const stockItems = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(item => activeProducts.has(item.name)); // Only include active products
      setAvailableStock(stockItems);
    } catch (error) {
      console.error('Error fetching stock:', error);
      setError('Error loading available stock');
    }
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
      console.error('Error fetching customers:', error);
      setError('Error loading customers');
    }
  };

  const handleAddItem = () => {
    setItems([...items, { product: '', boxes: '', quantity: '', cost: '', total: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total if quantity and cost are present
    if (field === 'quantity' || field === 'cost') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const cost = parseFloat(newItems[index].cost) || 0;
      newItems[index].total = quantity * cost;
    }
    
    setItems(newItems);
    
    // Calculate grand total
    const total = newItems.reduce((sum, item) => sum + (item.total || 0), 0);
    setGrandTotal(total);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    
    // Recalculate grand total
    const total = newItems.reduce((sum, item) => sum + (item.total || 0), 0);
    setGrandTotal(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!selectedCustomer) {
        throw new Error('Please select a customer');
      }

      if (items.length === 0) {
        throw new Error('Please add at least one item');
      }

      // Validate all items have required fields
      const invalidItems = items.filter(item => !item.product || !item.boxes || !item.quantity || !item.cost);
      if (invalidItems.length > 0) {
        throw new Error('Please fill in all fields for all items');
      }

      // Validate stock availability
      for (const item of items) {
        const stockItem = availableStock.find(stock => stock.name === item.product);
        if (!stockItem) {
          throw new Error(`${item.product} is not available in stock`);
        }
        if (stockItem.availableQuantityKgs < parseFloat(item.quantity)) {
          throw new Error(`Insufficient stock for ${item.product}. Available: ${stockItem.availableQuantityKgs} KGs`);
        }
      }

      // Create bill document
      const billData = {
        customerId: selectedCustomer,
        items: items.map(item => ({
          product: item.product,
          boxes: parseInt(item.boxes),
          quantity: parseFloat(item.quantity),
          cost: parseFloat(item.cost),
          total: parseFloat(item.total)
        })),
        grandTotal: grandTotal,
        createdAt: new Date().toISOString(),
        issueDate: new Date().toISOString(),
        status: 'pending'
      };

      // Update stock quantities and create stock logs
      for (const item of items) {
        const stockItem = availableStock.find(stock => stock.name === item.product);
        const stockRef = doc(db, 'stock', stockItem.id);
        
        // Update stock quantities
        await updateDoc(stockRef, {
          availableQuantityKgs: increment(-parseFloat(item.quantity)),
          availableQuantityBags: increment(-parseInt(item.boxes))
        });

        // Get customer details
        const customerDoc = customers.find(c => c.id === selectedCustomer);
        const customerName = customerDoc ? customerDoc.name : 'Unknown';

        // Create stock log entry
        const logsRef = collection(db, 'stockLogs');
        await addDoc(logsRef, {
          productId: stockItem.id,
          productName: item.product,
          customerName: customerName,
          action: 'sold',
          quantity: parseFloat(item.quantity),
          bags: parseInt(item.boxes),
          cost: parseFloat(item.cost),
          timestamp: new Date(),
          referenceId: 'BILL-' + selectedCustomer,
          remarks: `Sold ${item.quantity} KG (${item.boxes} bags) at ₹${item.cost} per KG`
        });
      }

      // Add bill to Firestore
      const billsRef = collection(db, 'bills');
      const newBillRef = await addDoc(billsRef, billData);

      // Update customer's total bills
      const customerRef = doc(db, 'users', selectedCustomer);
      await updateDoc(customerRef, {
        totalBills: increment(1)
      });

      setSuccess('Bill uploaded successfully!');
      setItems([{ product: '', boxes: '', quantity: '', cost: '', total: 0 }]);
      setGrandTotal(0);
      setSelectedCustomer('');
    } catch (error) {
      console.error('Error uploading bill:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Bill</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Customer
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => {
                const displayName = `${customer.name} ${customer.phone ? `(${customer.phone})` : ''}`;
                return (
                  <option key={customer.id} value={customer.id}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product
                  </label>
                  <select
                    value={item.product}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select product</option>
                    {availableStock
                      .filter(stock => stock.availableQuantityKgs > 0)
                      .map(stock => (
                        <option key={stock.id} value={stock.name}>
                          {stock.name.charAt(0).toUpperCase() + stock.name.slice(1)}
                          {' '}
                          ({stock.availableQuantityKgs} KGs available)
                        </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boxes/Bags
                  </label>
                  <input
                    type="number"
                    value={item.boxes}
                    onChange={(e) => handleItemChange(index, 'boxes', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost
                  </label>
                  <input
                    type="number"
                    value={item.cost}
                    onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total
                  </label>
                  <input
                    type="number"
                    value={item.total}
                    className="w-full p-2 border rounded-md bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Item
            </button>

            <div className="text-xl font-bold">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? 'Uploading...' : 'Upload Bill'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default UploadBill;