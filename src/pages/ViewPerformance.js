import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdjustmentsHorizontalIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';

const PerformanceDisplay = () => {
  const [selectedViewBy, setSelectedViewBy] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      const token = localStorage.getItem('dealerToken');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      let apiUrl = 'https://inventorysystem-a14x.onrender.com/api/var/dealers/performance';

      // Construct URL with query parameters based on selectedViewBy and dates
      if (selectedViewBy === 'Custom' && startDate && endDate) {
        apiUrl += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      } else if (selectedViewBy) {
        apiUrl += `?viewBy=${selectedViewBy}`;
      }

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setPerformanceData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        toast.error('Failed to fetch performance data');
      }
    };

    fetchPerformanceData();
  }, [selectedViewBy, startDate, endDate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <TopNav />
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
        <div className="flex-1 mt-16 px-6">
          <h1 className="text-2xl font-bold mb-6 mt-8 text-gray-800">Performance Report</h1>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
              <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-500 ml-2" />
              <select
                value={selectedViewBy}
                onChange={(e) => setSelectedViewBy(e.target.value)}
                className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full md:w-60"
              >
                <option value="">View By</option>
                <option value="Last Week">Last Week</option>
                <option value="Last Month">Last Month</option>
                <option value="Last Quarter">Last Quarter</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last Year">Last Year</option>
                <option value="Lifetime">Lifetime</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {selectedViewBy === 'Custom' && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
                  <CalendarIcon className="w-6 h-6 text-gray-500 ml-2" />
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full md:w-40"
                  />
                </div>
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
                  <CalendarIcon className="w-6 h-6 text-gray-500 ml-2" />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                    className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full md:w-40"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto mb-20">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-4 text-left">Brand</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Total Quantity</th>
                  <th className="p-4 text-left">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.length > 0 ? (
                  performanceData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                      <td className="p-4">{item.brand}</td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4">{item.totalQuantity}</td>
                      <td className="p-4">{item.totalAmount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <BottomNav className="fixed bottom-0 left-0 w-full" />
      </div>
    </>
  );
};

export default PerformanceDisplay;
















// import React, { useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
// import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon } from '@heroicons/react/24/outline';
// import TopNav from '../components/TopNav';
// import BottomNav from '../components/BottomNav';

// // Register Chart.js components
// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// const ViewPerformance = () => {
//   const [brandFilter, setBrandFilter] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // Sample data for performance
//   const performanceData = [
//     { brand: 'ABC', stockSold: 783, amount: 741258 },
//     { brand: 'QWE', stockSold: 683, amount: 123456 },
//     { brand: 'ZXC', stockSold: 583, amount: 987654 },
//     { brand: 'POI', stockSold: 483, amount: 963852 },
//     { brand: 'MNB', stockSold: 383, amount: 852963 },
//   ];

//   // Sort data by stock sold in descending order
//   const sortedData = performanceData.sort((a, b) => b.stockSold - a.stockSold);

//   // Data for the bar chart
//   const data = {
//     labels: sortedData.map(item => item.brand),
//     datasets: [
//       {
//         label: 'Stock Sold',
//         data: sortedData.map(item => item.stockSold),
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             return `${context.dataset.label}: ${context.raw}`;
//           },
//         },
//       },
//     },
//   };

//   return (
//     <>
//       <TopNav />
//       <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center mt-16">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">View Performance</h1>

//         {/* Filters */}
//         <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//             {/* Search Input */}
//             <div className="flex items-center border border-teal-500 rounded-md">
//               <MagnifyingGlassIcon className="w-6 h-6 text-teal-500 mx-3" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="w-full px-4 py-2 border-0 focus:outline-none"
//               />
//             </div>

//             {/* Brand Filter */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 mb-2">Brand</label>
//               <div className="flex items-center border border-teal-500 rounded-md">
//                 <FunnelIcon className="w-6 h-6 text-teal-500 mx-3" />
//                 <select
//                   value={brandFilter}
//                   onChange={(e) => setBrandFilter(e.target.value)}
//                   className="p-2 border-0 focus:outline-none w-full"
//                 >
//                   <option value="">Select Brand</option>
//                   <option value="ABC">Brand ABC</option>
//                   <option value="QWE">Brand QWE</option>
//                   <option value="ZXC">Brand ZXC</option>
//                   {/* Add more options as needed */}
//                 </select>
//               </div>
//             </div>

//             {/* Category Filter */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 mb-2">Category</label>
//               <div className="flex items-center border border-teal-500 rounded-md">
//                 <FunnelIcon className="w-6 h-6 text-teal-500 mx-3" />
//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                   className="p-2 border-0 focus:outline-none w-full"
//                 >
//                   <option value="">Select Category</option>
//                   <option value="Cat1">Category 1</option>
//                   <option value="Cat2">Category 2</option>
//                   <option value="Cat3">Category 3</option>
//                   {/* Add more options as needed */}
//                 </select>
//               </div>
//             </div>

//             {/* Date Range */}
//             <div className="flex gap-4">
//               <div className="flex flex-col w-full sm:w-1/2 relative">
//                 <label className="text-gray-700 mb-2">Start Date</label>
//                 <div className="relative">
//                   <CalendarIcon className="w-6 h-6 text-teal-500 absolute top-1/2 transform -translate-y-1/2 left-3" />
//                   <input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="p-2 border border-teal-500 rounded-md pl-12"
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col w-full sm:w-1/2 relative">
//                 <label className="text-gray-700 mb-2">End Date</label>
//                 <div className="relative">
//                   <CalendarIcon className="w-6 h-6 text-teal-500 absolute top-1/2 transform -translate-y-1/2 left-3" />
//                   <input
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="p-2 border border-teal-500 rounded-md pl-12"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bar Chart Card */}
//         <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Selling Brands</h2>
//           <div className="w-full">
//             <Bar data={data} options={options} />
//           </div>
//         </div>

//         {/* Performance Table */}
//         <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Performance Table</h2>
//           <table className="w-full table-auto border-collapse">
//             <thead>
//               <tr className="bg-teal-600 text-white">
//                 <th className="px-4 py-2">Rank</th>
//                 <th className="px-4 py-2">Brand</th>
//                 <th className="px-4 py-2">Stock Sold</th>
//                 <th className="px-4 py-2">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedData.map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="px-4 py-2 text-center">{index + 1}</td>
//                   <td className="px-4 py-2">{item.brand}</td>
//                   <td className="px-4 py-2 text-center">{item.stockSold}</td>
//                   <td className="px-4 py-2 text-center">{item.amount.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <BottomNav />
//     </>
//   );
// };

// export default ViewPerformance;
