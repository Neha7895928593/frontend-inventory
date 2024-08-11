import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ViewPerformance = () => {
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch brands from backend API
  const fetchBrands = async () => {
    try {
      const response = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/brands', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dealerToken')}`,
        },
      });
      console.log(response.data)
      setBrands(response.data); // Assuming the response contains an array of brands
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };
 

  // Fetch categories based on selected brand
  const fetchCategories = async (brandName) => {
    try {
      const response = await axios.get(`https://inventorysystem-a14x.onrender.com/api/var/dealers/brands/${brandName}/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dealerToken')}`,
        },
      });
      console.log(response.data)
      setCategories(response.data); // Assuming the response contains an array of categories
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }

  };
 
  // Fetch performance data from backend API
  const fetchPerformanceData = async () => {
    try {
      const data = JSON.stringify({
        filter: "lastMonth", // Modify this value based on your filters
      });

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://inventorysystem-a14x.onrender.com/api/var/dealers/performance',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('dealerToken')}`, 
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await axios.request(config);
      setPerformanceData(response.data); // Update state with fetched data
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    }
  };

  // Fetch brands and performance data on component mount
  useEffect(() => {
    fetchBrands();
    fetchPerformanceData();
  }, []);

  // Fetch categories whenever a brand is selected
  useEffect(() => {
    if (brandFilter) {
      fetchCategories(brandFilter);
    }
  }, [brandFilter]);

  // Sort data by stock sold in descending order
  const sortedData = performanceData.sort((a, b) => b.totalQty - a.totalQty);

  // Data for the bar chart
  const data = {
    labels: sortedData.map(item => item.category), // Adjust the key based on your data structure
    datasets: [
      {
        label: 'Stock Sold',
        data: sortedData.map(item => item.totalQty),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center mt-16">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">View Performance</h1>

        {/* Filters */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Search Input */}
            <div className="flex items-center border border-teal-500 rounded-md">
              <MagnifyingGlassIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border-0 focus:outline-none"
              />
            </div>

            {/* Brand Filter */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Brand</label>
              <div className="flex items-center border border-teal-500 rounded-md">
                <FunnelIcon className="w-6 h-6 text-teal-500 mx-3" />
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="p-2 border-0 focus:outline-none w-full"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Category</label>
              <div className="flex items-center border border-teal-500 rounded-md">
                <FunnelIcon className="w-6 h-6 text-teal-500 mx-3" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 border-0 focus:outline-none w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.modelNo}>
                      {category.modelNo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex gap-4">
              <div className="flex flex-col w-full sm:w-1/2 relative">
                <label className="text-gray-700 mb-2">Start Date</label>
                <div className="relative">
                  <CalendarIcon className="w-6 h-6 text-teal-500 absolute top-1/2 transform -translate-y-1/2 left-3" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border border-teal-500 rounded-md pl-12"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full sm:w-1/2 relative">
                <label className="text-gray-700 mb-2">End Date</label>
                <div className="relative">
                  <CalendarIcon className="w-6 h-6 text-teal-500 absolute top-1/2 transform -translate-y-1/2 left-3" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border border-teal-500 rounded-md pl-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Selling Brands</h2>
          <div className="w-full">
            <Bar data={data} options={options} />
          </div>
        </div>

        {/* Performance Table */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Performance Table</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-teal-500 text-white">
                <th className="py-2 px-4">Brand</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Stock Sold</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.category} className="text-center">
                  <td className="py-2 px-4 border">{item.brand}</td>
                  <td className="py-2 px-4 border">{item.category}</td>
                  <td className="py-2 px-4 border">{item.totalQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default ViewPerformance;
