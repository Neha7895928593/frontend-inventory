import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      const token = localStorage.getItem('dealerToken');

      try {
        const response = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/brands', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Log the full response to understand its structure
        console.log('API Response:', response.data);

        // Directly use the response data as it is an array of brands
        if (Array.isArray(response.data)) {
          setBrands(response.data);
          toast.success('Brands fetched successfully!');
        } else {
          throw new Error('Unexpected API response structure');
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('Failed to fetch brands.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleEditBrand = async (index) => {
    const newBrandName = prompt('Enter new brand name:', brands[index].name);
    if (newBrandName) {
      const brandId = brands[index]._id; // Assuming each brand has an `_id` field
      const token = localStorage.getItem('dealerToken');

      try {
        await axios.put(`https://inventorysystem-a14x.onrender.com/api/var/dealers/brands/${brandId}`, 
          { newName: newBrandName }, // Changed to match API request structure
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const updatedBrands = brands.map((brand, i) =>
          i === index ? { ...brand, name: newBrandName } : brand
        );
        setBrands(updatedBrands);
        toast.success('Brand updated successfully!');
      } catch (error) {
        console.error('Error updating brand:', error);
        toast.error('Failed to update brand.');
      }
    }
  };

  const handleDeleteBrand = async (index) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      const brandId = brands[index]._id; // Assuming each brand has an `_id` field
      const token = localStorage.getItem('dealerToken');

      try {
        await axios.delete(`https://inventorysystem-a14x.onrender.com/api/var/dealers/brands/${brandId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const updatedBrands = brands.filter((_, i) => i !== index);
        setBrands(updatedBrands);
        toast.success('Brand deleted successfully!');
      } catch (error) {
        console.error('Error deleting brand:', error);
        toast.error('Failed to delete brand.');
      }
    }
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-16">View Brands</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            {brands.map((brand, index) => (
              <div
                key={brand._id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4"
              >
                <span className="text-xl font-semibold text-gray-700">{brand.name}</span>
                <div className="flex space-x-4">
                  <button onClick={() => handleEditBrand(index)} className="flex items-center">
                    <PencilIcon className="w-6 h-6 text-teal-600" />
                    <span className="ml-1">Edit</span>
                  </button>
                  <button onClick={() => handleDeleteBrand(index)} className="flex items-center">
                    <TrashIcon className="w-6 h-6 text-red-600" />
                    <span className="ml-1">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
      <ToastContainer />
    </>
  );
};

export default ViewBrand;
