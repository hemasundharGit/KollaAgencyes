import React, { useState } from 'react';
import Layout from '../components/Layout';
import ModelViewer from '../components/ModelViewer';

const Products = () => {
  const [modelOpen, setModelOpen] = useState(false);
  return (
    <Layout>
      <ModelViewer
        modelUrl="/models/Jaggery_Delight_0511180849_texture.glb"
        isOpen={modelOpen}
        onClose={() => setModelOpen(false)}
      />
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">OUR PRODUCTS</h1>
            <p className="text-xl text-gray-600 mb-12">Discover our range of quality products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product cards will go here */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">బెల్లం (Jaggery)</h3>
                <p className="text-gray-600 mb-4">Premium quality natural jaggery made from sugarcane juice using traditional methods.</p>
                <button
                  onClick={() => setModelOpen(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  View Product in 3D
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Product 2</h3>
                <p className="text-gray-600">Description of product 2</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Product 3</h3>
                <p className="text-gray-600">Description of product 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;