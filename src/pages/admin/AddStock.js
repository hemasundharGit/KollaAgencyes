import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const AddStock = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    availableQuantityKgs: '',
    availableQuantityBags: '',
    addedDate: new Date().toISOString().split('T')[0]
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.name || !formData.availableQuantityKgs || !formData.availableQuantityBags || !formData.addedDate) {
        throw new Error('Please fill in all fields');
      }

      // Convert string values to numbers
      const stockData = {
        name: formData.name,
        quantityKgs: parseFloat(formData.availableQuantityKgs), // Total quantity added
        availableQuantityKgs: parseFloat(formData.availableQuantityKgs), // Current available quantity
        availableQuantityBags: parseInt(formData.availableQuantityBags),
        addedDate: formData.addedDate,
        addedTimestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add stock to Firestore
      const stockRef = collection(db, 'stock');
      await addDoc(stockRef, stockData);

      setSuccess('Stock added successfully!');
      // Reset form
      setFormData({
        name: '',
        availableQuantityKgs: '',
        availableQuantityBags: '',
        addedDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding stock:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Add Stock</h1>
      </div>

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
            Product Name
          </label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Quantity (KGs)
          </label>
          <input
            type="number"
            name="availableQuantityKgs"
            value={formData.availableQuantityKgs}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter quantity in KGs"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Bags/Boxes
          </label>
          <input
            type="number"
            name="availableQuantityBags"
            value={formData.availableQuantityBags}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter number of bags/boxes"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Added
          </label>
          <input
            type="date"
            name="addedDate"
            value={formData.addedDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Stock'}
        </button>
      </form>
    </div>
  );
};

export default AddStock;