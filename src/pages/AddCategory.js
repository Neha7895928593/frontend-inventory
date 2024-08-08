import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, PlusIcon, TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { toast } from 'react-toastify';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ brand: '', modelName: '', price: '' });
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem('dealerToken');
        const response = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/brands', {
          headers: { 'Authorization': token },
        });
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('Failed to fetch brands');
      }
    };
  
    fetchBrands();
  }, []);

  const handleAddCategory = async () => {
    if (category.brand && category.modelName && category.price) {
      try {
        const token = localStorage.getItem('dealerToken');
        const data = JSON.stringify({
          brand: category.brand,
          modelNo: category.modelName,
          amount: category.price
        });

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://inventorysystem-a14x.onrender.com/api/var/dealers/categories',
          headers: { 
            'Authorization': token, 
            'Content-Type': 'application/json'
          },
          data: data
        };

        const response = await axios.request(config);
        console.log(response.data);
        toast.success('Category added successfully');

        // Optionally update the UI with the new category
        setCategories([...categories, category]);
        setCategory({ brand: '', modelName: '', price: '' }); 
    
        // Clear the input fields
      } catch (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleEditCategory = (index) => {
    const selectedCategory = categories[index];
    const newBrand = prompt('Edit Brand:', selectedCategory.brand);
    const newModelName = prompt('Edit Category Name (Model No.):', selectedCategory.modelName);
    const newPrice = prompt('Edit Price:', selectedCategory.price);

    if (newBrand && newModelName && newPrice) {
      const updatedCategories = categories.map((cat, i) =>
        i === index ? { brand: newBrand, modelName: newModelName, price: newPrice } : cat
      );
      setCategories(updatedCategories);
    }
  };

  const handleDeleteCategory = (index) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter((_, i) => i !== index);
      setCategories(updatedCategories);
    }
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-16">Add Categories</h1>

        {/* Add Category Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-md">
          <div className="flex flex-col space-y-4">
            <div className="relative flex items-center border border-teal-500 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <TagIcon className="absolute left-3 w-6 h-6 text-teal-500" />
              <select
                value={category.brand}
                onChange={(e) => setCategory({ ...category, brand: e.target.value })}
                className="w-full px-12 py-3 border-0 focus:outline-none placeholder-gray-500"
              >
                <option value="">Choose Brand</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div className="relative flex items-center border border-teal-500 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <PencilIcon className="absolute left-3 w-6 h-6 text-teal-500" />
              <input
                type="text"
                value={category.modelName}
                onChange={(e) => setCategory({ ...category, modelName: e.target.value })}
                placeholder="Enter Category Name (Model No.)"
                className="w-full px-12 py-3 border-0 focus:outline-none placeholder-gray-500"
              />
            </div>
            <div className="relative flex items-center border border-teal-500 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <CurrencyDollarIcon className="absolute left-3 w-6 h-6 text-teal-500" />
              <input
                type="number"
                value={category.price}
                onChange={(e) => setCategory({ ...category, price: e.target.value })}
                placeholder="Enter Price"
                className="w-full px-12 py-3 border-0 focus:outline-none placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleAddCategory}
              className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-md flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              Add Category
            </button>
          </div>
        </div>

        {/* Display Categories in Cards */}
       
      </div>
      <BottomNav />
    </>
  );
};

export default ManageCategories;
