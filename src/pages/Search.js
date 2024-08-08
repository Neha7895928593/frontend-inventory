import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav'; // Adjust the path as needed
import BottomNav from '../components/BottomNav'; // Adjust the path as needed
import axios from 'axios';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);

  // Fetch sales or purchases data when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch the sales and purchases data
        const salesResponse = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/sales');
        const purchasesResponse = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/purchases');

        // Combine sales and purchases data (if needed)
        const combinedItems = [...salesResponse.data, ...purchasesResponse.data];

        setItems(combinedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on the search query
  const filteredItems = items.filter(item =>
    item.category.modelNo.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 p-6 flex-col">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Search Page</h1>
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center border border-gray-300 rounded-md bg-white shadow-sm">
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 ml-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Model No"
                className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Model No: {item.category.modelNo}</h2>
                    <div className="mb-2">
                      <p className="text-gray-700 font-medium">Quantity:</p>
                      <p className="text-gray-800">{item.quantity}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-gray-700 font-medium">Amount:</p>
                      <p className="text-gray-800">₹{item.category.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Brand:</p>
                      <p className="text-gray-800">{item.brand.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-4 text-center text-gray-500">
                  No results found
                </div>
              )}
            </div>
          </div>
        </div>
        <BottomNav className="w-full" />
      </div>
    </>
  );
};

export default SearchPage;
