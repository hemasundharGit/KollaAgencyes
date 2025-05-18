import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

const CreateProduct = () => {
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!productName.trim()) {
        throw new Error('Please enter a product name');
      }

      const productData = {
        name: productName.trim(),
        createdAt: new Date().toISOString(),
      };

      const productsRef = collection(db, 'products');
      await addDoc(productsRef, productData);
      
      // Refresh products list after adding
      fetchProducts();
      setSuccess('Product added successfully!');
      setProductName('');
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'products', productId));
      fetchProducts(); // Refresh the list after deletion
      setSuccess('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex items-center mb-6">
            <Link to="/admin" className="text-primary-600 hover:text-primary-900 mr-4">
              <FaArrowLeft className="inline-block" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Create Product</h1>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
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
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>

          {/* Products Grid */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={deleteLoading}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Added on: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;