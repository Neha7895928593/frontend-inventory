import React, { useState } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, PlusCircleIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav';  
import BottomNav from '../components/BottomNav';  
import { toast } from 'react-toastify';

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState('');

  const handleAddBrand = () => {
    if (brandName.trim()) {
      const data = JSON.stringify({
        name: brandName.trim()
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://inventorysystem-a14x.onrender.com/api/var/dealers/brands',
        headers: { 
          'Authorization': localStorage.getItem('dealerToken'), 
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          setBrands([...brands, response.data.name]);
          setBrandName(''); // Clear the input field
          toast.success('Brand added successfully');
        })
        .catch((error) => {
          console.error(error);
          toast.error('Failed to add brand');
        });
    }
  };



  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center mt-16">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Brands</h1>

        {/* Add Brand Form in a Card */}
        <div className="w-full max-w-md mb-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New Brand</h2>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <DocumentTextIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter Brand Name"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
              />
              <button
                onClick={handleAddBrand}
                className="ml-2 bg-teal-600 text-white p-2 rounded-md flex items-center hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              >
                <PlusCircleIcon className="w-5 h-5 mr-1" />
                Add
              </button>
            </div>
          </div>
        </div>

    
        <BottomNav className="mt-16" />
      </div>
    </>
  );
};

export default ManageBrands;
