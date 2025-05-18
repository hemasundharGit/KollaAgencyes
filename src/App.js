import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import SetupAdmin from './pages/admin/SetupAdmin';
import UploadBill from './pages/admin/UploadBill';
import BillManagement from './pages/admin/BillManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import AddStock from './pages/admin/AddStock';
import CreateProduct from './pages/admin/CreateProduct';
import StockReport from './pages/admin/StockReport';
import AdminLayout from './components/AdminLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Bills from './pages/customer/Bills';
import Payment from './pages/customer/Payment';
import Layout from './components/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup-admin" element={<SetupAdmin />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><CustomerManagement /></AdminLayout>} />

        <Route path="/admin/upload-bill" element={<AdminLayout><UploadBill /></AdminLayout>} />
        <Route path="/admin/bills" element={<AdminLayout><BillManagement /></AdminLayout>} />
        <Route path="/admin/add-stock" element={<AdminLayout><AddStock /></AdminLayout>} />
          <Route path="/admin/create-product" element={<AdminLayout><CreateProduct /></AdminLayout>} />
        <Route path="/admin/stock-report" element={<AdminLayout><StockReport /></AdminLayout>} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<Layout requireAuth><CustomerDashboard /></Layout>} />
        <Route path="/customer/bills" element={<Layout requireAuth><Bills /></Layout>} />
        <Route path="/customer/payment" element={<Layout requireAuth><Payment /></Layout>} />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;