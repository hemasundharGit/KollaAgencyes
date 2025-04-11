import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import Layout from '../components/Layout';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isCustomer, setIsCustomer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is admin
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email), where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Not an admin user');
        await auth.signOut();
        setLoading(false);
        return;
      }

      const adminData = querySnapshot.docs[0].data();
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userData', JSON.stringify(adminData));

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!phone || phone.trim().length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      const phoneNumber = phone.trim();
      console.log('Attempting login with phone:', phoneNumber);

      // Create a direct reference to users collection
      const usersRef = collection(db, 'users');
      const customerQuery = query(usersRef, 
        where('phone', '==', phoneNumber),
        where('role', '==', 'customer')
      );

      const snapshot = await getDocs(customerQuery);
      
      if (snapshot.empty) {
        throw new Error('No customer found with this phone number');
      }

      const customerDoc = snapshot.docs[0];
      const customerData = customerDoc.data();

      // Store minimal required data
      const userData = {
        id: customerDoc.id,
        phone: phoneNumber,
        name: customerData.name || '',
        role: 'customer'
      };

      // Set session data
      localStorage.setItem('userId', customerDoc.id);
      localStorage.setItem('userRole', 'customer');
      localStorage.setItem('userData', JSON.stringify(userData));

      // Navigate to dashboard
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent! Please check your inbox.');
      setShowResetPassword(false);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Error sending password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${!isCustomer ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setIsCustomer(false);
                  setError('');
                }}
              >
                Admin Login
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${isCustomer ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setIsCustomer(true);
                  setError('');
                }}
              >
                Customer Login
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isCustomer ? (
            <form className="mt-8 space-y-6" onSubmit={handleCustomerLogin}>
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter 10 digit phone number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          ) : (
            <>
              {showResetPassword ? (
                <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
                  <div>
                    <label htmlFor="reset-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Back to login
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              ) : (
                <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Login; 