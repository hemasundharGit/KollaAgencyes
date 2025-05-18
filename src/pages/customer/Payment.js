import React from 'react';
import Layout from '../../components/Layout';

const Payment = () => {
  return (
    <Layout requireAuth>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Make Payment</h1>
          
          <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Scan PhonePe QR Code to Pay</h3>
                <div className="bg-purple-50 p-6 rounded-lg inline-block">
                  <img
                    src="/qr-code.svg"
                    alt="PhonePe QR Code"
                    className="mx-auto w-64 h-64"
                  />
                </div>
                <div className="mt-6 space-y-4 max-w-lg mx-auto">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Payment Instructions:</h4>
                    <ol className="text-sm text-blue-800 list-decimal list-inside space-y-2">
                      <li>Open your PhonePe app</li>
                      <li>Click on 'Scan & Pay'</li>
                      <li>Scan the QR code above</li>
                      <li>Enter the amount as per your bill</li>
                      <li>Complete the payment</li>
                    </ol>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">After Payment:</h4>
                    <p className="text-sm text-green-800">
                      Please take a screenshot of your payment confirmation and send it to our
                      support team through WhatsApp at <span className="font-medium">+91 XXXXX XXXXX</span> for
                      quick verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;