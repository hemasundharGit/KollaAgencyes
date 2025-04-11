import React from 'react';
import Layout from '../components/Layout';

const Blogs = () => {
  return (
    <Layout>
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">OUR BLOGS</h1>
            <p className="text-xl text-gray-600 mb-12">Stay updated with our latest news and insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Latest Updates</h3>
                <p className="text-gray-600">
                  Stay informed about our newest products and services.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Insights</h3>
                <p className="text-gray-600">
                  Learn about the latest trends and developments in our industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blogs; 