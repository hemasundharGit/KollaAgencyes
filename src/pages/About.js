import React from 'react';
import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">ABOUT US</h1>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Kolla Agencies</h2>
            <p className="text-xl text-gray-600 mb-12">Your trusted partner in business excellence since 2020.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide high-quality products and exceptional service to our customers while
                maintaining the highest standards of business ethics.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the leading provider in our industry, known for innovation, reliability,
                and customer satisfaction.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Integrity in all our dealings</li>
                <li>Excellence in service delivery</li>
                <li>Customer satisfaction</li>
                <li>Innovation and continuous improvement</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h3>
              <p className="text-gray-600">
                We are committed to providing the best possible service to our customers and
                maintaining long-lasting relationships based on trust and mutual respect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About; 