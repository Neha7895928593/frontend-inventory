import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { ArrowTrendingUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [totalStockQuantity, setTotalStockQuantity] = useState(0);
  const [totalStockAmount, setTotalStockAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const dealerData = JSON.parse(localStorage.getItem('dealer'));
    if (dealerData) {
      setUsername(dealerData.username);
      setTotalStockQuantity(dealerData.totalStockQuantity);
      setTotalStockAmount(dealerData.totalStockAmount);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddSales = () => {
    navigate('/add-sales');
  };

  const handleAddPurchase = () => {
    navigate('/add-purchase');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 z-40 md:w-80 lg:w-96`} // Ensure sidebar is responsive
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64 md:ml-80 lg:ml-96' : ''
        } flex flex-col`}
      >
        <TopNav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} username={username} />
        <main className="flex-1 p-6 space-y-6 mt-16">

          {/* Top Brand of the Week Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
            <div className="p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Top Brand of the Week</h3>
              <p className="text-2xl font-bold text-teal-600">BrandName</p>
              <p className="text-sm text-gray-500 mt-1">Top-selling brand this week based on sales data.</p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Stock Quantity Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex items-center transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Stock Quantity</h3>
                <p className="text-3xl font-bold text-teal-600">{totalStockQuantity}</p>
              </div>
              <ArrowTrendingUpIcon className="w-16 h-16 text-teal-500 mr-4" /> {/* Icon for quantity */}
            </div>

            {/* Total Stock Amount Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex items-center transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Stock Amount</h3>
                <p className="text-3xl font-bold text-teal-600">₹ {totalStockAmount}</p>
              </div>
              <CurrencyDollarIcon className="w-16 h-16 text-teal-500 mr-4" /> {/* Icon for amount */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-teal-700 transition-all duration-300 ease-in-out flex items-center space-x-2 transform hover:scale-105"
              onClick={handleAddSales}
            >
              <ArrowTrendingUpIcon className="w-5 h-5" />
              <span>Add Sales</span>
            </button>
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-teal-700 transition-all duration-300 ease-in-out flex items-center space-x-2 transform hover:scale-105"
              onClick={handleAddPurchase}
            >
              <CurrencyDollarIcon className="w-5 h-5" />
              <span>Add Purchase</span>
            </button>
          </div>

        </main>
        <BottomNav /> {/* Add BottomNav component */}
      </div>
    </div>
  );
};

export default Dashboard;
