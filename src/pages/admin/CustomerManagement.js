import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState({});
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    setError('');
    setSuccess('');
    setLoading(prev => ({ ...prev, [customerId]: true }));

    try {
      // Check if customer has any bills
      const billsRef = collection(db, 'bills');
      const billsQuery = query(billsRef, where('customerId', '==', customerId));
      const billsSnapshot = await getDocs(billsQuery);

      // Check if all bills are paid
      const hasUnpaidBills = billsSnapshot.docs.some(doc => {
        const billData = doc.data();
        return billData.status === 'pending';
      });

      if (hasUnpaidBills) {
        setError('Cannot delete customer: There are pending bills');
        return;
      }

      // Delete all bills first
      for (const billDoc of billsSnapshot.docs) {
        await deleteDoc(doc(db, 'bills', billDoc.id));
      }

      // Delete the customer
      await deleteDoc(doc(db, 'users', customerId));
      
      // Update local state
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      setSuccess('Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Error deleting customer: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, [customerId]: false }));
    }
  };

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers...');
      const customersRef = collection(db, 'users');
      const q = query(customersRef, where('role', '==', 'customer'));
      const querySnapshot = await getDocs(q);
      const customersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched customers:', customersList);
      setCustomers(customersList);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Error fetching customers. Please try again.');
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Check for existing customer with same name or phone
      const usersRef = collection(db, 'users');
      const nameQuery = query(usersRef, where('name', '==', newCustomer.name), where('role', '==', 'customer'));
      const phoneQuery = query(usersRef, where('phone', '==', newCustomer.phone), where('role', '==', 'customer'));
      
      const [nameSnapshot, phoneSnapshot] = await Promise.all([
        getDocs(nameQuery),
        getDocs(phoneQuery)
      ]);

      if (!nameSnapshot.empty) {
        setError('A customer with this name already exists');
        return;
      }

      if (!phoneSnapshot.empty) {
        setError('A customer with this phone number already exists');
        return;
      }

      console.log('Adding new customer:', newCustomer);
      const docRef = await addDoc(collection(db, 'users'), {
        ...newCustomer,
        role: 'customer',
        createdAt: new Date()
      });
      console.log('Customer added successfully with ID:', docRef.id);
      
      // Add the new customer to the state
      const newCustomerWithId = { 
        id: docRef.id, 
        ...newCustomer, 
        role: 'customer',
        createdAt: new Date() 
      };
      setCustomers([...customers, newCustomerWithId]);
      
      // Reset the form
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      setSuccess('Customer added successfully!');
    } catch (error) {
      console.error('Error adding customer:', error);
      setError('Error adding customer: ' + error.message);
    }
  };

  return (
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
            {success}
          </div>
        )}

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Customer</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new customer to the system.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleAddCustomer}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Customer List</h3>
            <div className="mt-5">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Address
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {customers.map((customer) => (
                            <tr key={customer.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {customer.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {customer.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {customer.phone}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {customer.address}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  disabled={loading[customer.id]}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                  {loading[customer.id] ? 'Checking...' : 'Delete'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CustomerManagement;