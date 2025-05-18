import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Bar, Pie } from 'react-chartjs-2';
import { Fragment } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Dialog, Transition } from '@headlessui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import Layout from '../../components/Layout';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StockReport = () => {
  const [stockData, setStockData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('month');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSalesLog, setProductSalesLog] = useState([]);

  // Summary statistics
  const [summary, setSummary] = useState({
    totalStockAdded: 0,
    totalStockSold: 0,
    totalStockLeft: 0,
    mostSoldProduct: ''
  });

  useEffect(() => {
    fetchStockData();
    fetchSalesData();
  }, [filterProduct, filterDateRange, customDateRange]);

  const fetchStockData = async () => {
    try {
      const stockRef = collection(db, 'stock');
      const querySnapshot = await getDocs(stockRef);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStockData(items);
      calculateSummary(items);
    } catch (error) {
      setError('Error fetching stock data');
    }
  };

  const fetchSalesData = async () => {
    try {
      const salesRef = collection(db, 'bills');
      let salesQuery = query(salesRef, orderBy('createdAt', 'desc'));

      // Apply date filter
      if (filterDateRange !== 'all') {
        const startDate = getDateRangeStart();
        if (startDate) {
          salesQuery = query(salesRef,
            where('createdAt', '>=', startDate.toISOString()),
            orderBy('createdAt', 'desc')
          );
        }
      }

      const querySnapshot = await getDocs(salesQuery);
      const sales = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          items: data.items ? data.items.map(item => ({
            ...item,
            quantity: parseFloat(item.quantity || 0),
            price: parseFloat(item.price || 0)
          })) : []
        };
      });
      setSalesData(sales);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Error fetching sales data');
      setLoading(false);
    }
  };

  const getDateRangeStart = () => {
    const now = new Date();
    switch (filterDateRange) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'custom':
        return customDateRange.start ? new Date(customDateRange.start) : null;
      default:
        return null;
    }
  };

  const calculateSummary = (items) => {
    const summary = {
      totalStockAdded: 0,
      totalStockSold: 0,
      totalStockLeft: 0,
      mostSoldProduct: ''
    };

    items.forEach(item => {
      // Calculate total stock added from initial quantity
      const stockAdded = item.quantityKgs || 0;
      const stockLeft = item.availableQuantityKgs || 0;
      const stockSold = stockAdded - stockLeft;

      summary.totalStockAdded += stockAdded;
      summary.totalStockLeft += stockLeft;
      summary.totalStockSold += stockSold;
    });

    // Calculate most sold product
    if (items.length > 0) {
      const soldQuantities = items.map(item => ({
        name: item.name,
        soldQuantity: (item.quantityKgs || 0) - (item.availableQuantityKgs || 0)
      }));
      const mostSold = soldQuantities.reduce((prev, current) => 
        (prev.soldQuantity > current.soldQuantity) ? prev : current
      );
      summary.mostSoldProduct = mostSold.name;
    }

    setSummary(summary);
  };

  const getChartData = () => {
    const labels = stockData.map(item => item.name);
    const stockAdded = stockData.map(item => item.quantityKgs || 0);
    const stockSold = stockData.map(item => 
      (item.quantityKgs || 0) - (item.availableQuantityKgs || 0)
    );

    return {
      labels,
      datasets: [
        {
          label: 'Stock Added (KG)',
          data: stockAdded,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Stock Sold (KG)',
          data: stockSold,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    };
  };

  const getPieChartData = () => {
    const labels = stockData.map(item => item.name);
    const currentStock = stockData.map(item => item.availableQuantityKgs || 0);

    return {
      labels,
      datasets: [
        {
          data: currentStock,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <Layout requireAuth requireAdmin>
      <div className="space-y-6 p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Stock Added</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {summary.totalStockAdded.toFixed(2)} KG
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Stock Sold</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {summary.totalStockSold.toFixed(2)} KG
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Stock Left</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {summary.totalStockLeft.toFixed(2)} KG
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Most Sold Product</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {summary.mostSoldProduct}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
              >
                <option value="all">All Products</option>
                {stockData.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {filterDateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow h-[400px]">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Overview</h3>
            <div className="h-[320px]">
              <Bar data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow h-[400px]">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Stock Distribution</h3>
            <div className="h-[320px]">
              <Pie data={getPieChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Stock Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Stock Added (KG)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Stock Sold (KG)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Left (KG)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockData.map((item) => {
                  const stockLeft = item.availableQuantityKgs || 0;
                  const isLowStock = stockLeft < 50;

                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantityKgs?.toFixed(2) || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((item.quantityKgs || 0) - (item.availableQuantityKgs || 0)).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stockLeft.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isLowStock ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            try {
                              setSelectedProduct(item);
                              const productSales = salesData
                                .filter(sale => {
                                  return sale.items && 
                                         Array.isArray(sale.items) && 
                                         sale.items.some(saleItem => saleItem && saleItem.name && saleItem.name.toLowerCase() === item.name.toLowerCase());
                                })
                                .map(sale => {
                                  const saleItem = sale.items.find(saleItem => 
                                    saleItem && saleItem.name && saleItem.name.toLowerCase() === item.name.toLowerCase()
                                  );
                                  return {
                                    date: sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A',
                                    customerName: sale.customerName || 'N/A',
                                    productName: item.name,
                                    bags: saleItem?.bags || 'N/A',
                                    quantity: parseFloat(saleItem?.quantity || 0).toFixed(2),
                                    price: parseFloat(saleItem?.price || 0).toFixed(2),
                                    billNo: sale.billNo || 'N/A'
                                  };
                                })
                                .sort((a, b) => new Date(b.date) - new Date(a.date));
                              setProductSalesLog(productSales);
                              setIsModalOpen(true);
                            } catch (error) {
                              console.error('Error processing sales log:', error);
                              setError('Error loading sales log. Please try again.');
                            }
                          }}
                        >
                          View Sales Log
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Log Modal */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setIsModalOpen(false)}
          >
            <div className="min-h-full px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Sales Log - {selectedProduct?.name}
                  </Dialog.Title>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-gray-700">Sales History</h4>
                      {productSalesLog.length > 0 && (
                        <button
                          onClick={() => {
                            const exportData = productSalesLog.map(log => ({
                              'Date': log.date,
                              'Customer Name': log.customerName,
                              'Product Name': log.productName,
                              'Quantity (KG)': log.quantity,
                              'Bags/Boxes': log.bags,
                              'Price': log.price,
                              'Bill No': log.billNo
                            }));
                            const workbook = XLSX.utils.book_new();
                            const worksheet = XLSX.utils.json_to_sheet(exportData);
                            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Log');
                            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                            saveAs(data, `sales_log_${selectedProduct?.name || 'all'}_${new Date().toLocaleDateString()}.xlsx`);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Export to Excel
                        </button>
                      )}
                    </div>
                    {productSalesLog.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity (KG)</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bags</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill No</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {productSalesLog.map((log, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.bags}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.billNo}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">No sales records found for this product.</p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                    {productSalesLog.length > 0 && (
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          const ws = XLSX.utils.json_to_sheet(productSalesLog);
                          const wb = XLSX.utils.book_new();
                          XLSX.utils.book_append_sheet(wb, ws, 'Sales Log');
                          XLSX.writeFile(wb, `${selectedProduct?.name}_sales_log.xlsx`);
                        }}
                      >
                        Export to Excel
                      </button>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </Layout>
  );
};

export default StockReport;