import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import react-toastify for notifications

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const token = localStorage.getItem('dealerToken'); // Get token from local storage

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedCategories = response.data.categories; // Adjust according to your API response
        setCategories(fetchedCategories);
        setBrands([...new Set(fetchedCategories.map(cat => cat.brand)), 'All']);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories'); // Notify user of error
      }
    };

    fetchCategories();
  }, [token]);

  const handleEditCategory = async (index) => {
    const newPrice = prompt('Enter new price:', categories[index].amount);
    if (newPrice) {
      try {
        const categoryId = categories[index]._id;
        await axios.put(
          `https://inventorysystem-a14x.onrender.com/api/var/dealers/categories/${categoryId}/price`,
          { newAmount: newPrice },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const updatedCategories = categories.map((cat, i) =>
          i === index ? { ...cat, amount: newPrice } : cat
        );
        setCategories(updatedCategories);
        toast.success('Category price updated successfully'); // Notify user of success
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category price'); // Notify user of error
      }
    }
  };

  const handleDeleteCategory = async (index) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const categoryId = categories[index]._id;
        await axios.delete(`https://inventorysystem-a14x.onrender.com/api/var/dealers/categories/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedCategories = categories.filter((_, i) => i !== index);
        setCategories(updatedCategories);
        
        toast.success('Category deleted successfully'); // Notify user of success
                
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category'); // Notify user of error
      }
    }
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
  };

  const filteredCategories = selectedBrand === 'All'
    ? categories
    : categories.filter(cat => cat.brand === selectedBrand);

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-16">View Categories</h1>

        {/* Brand Filter Dropdown */}
        <div className="mb-6 w-full max-w-md">
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full bg-white focus:border-teal-500 focus:outline-none"
          >
            {brands.map((brand, index) => (
              <option
                key={index}
                value={brand}
                className={`${
                  selectedBrand === brand ? 'bg-teal-500 text-white' : 'bg-white text-gray-800'
                }`}
              >
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Display Categories in Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {filteredCategories.map((cat, index) => (
            <div
              key={cat._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4"
            >
              <span className="text-xl font-semibold text-gray-700">Brand: {cat.brand}</span>
              <span className="text-xl font-semibold text-gray-700">Model No: {cat.modelNo}</span>
              <span className="text-xl font-semibold text-gray-700">Price: ₹{cat.amount}</span>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEditCategory(index)}
                  className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-teal-600 bg-white hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                >
                  <PencilIcon className="w-6 h-6" />
                  <span className="ml-1">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(index)}
                  className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-red-600 bg-white hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                >
                  <TrashIcon className="w-6 h-6" />
                  <span className="ml-1">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br/><br/><br/>
      <BottomNav />
    </>
  );
};

export default ViewCategory;
