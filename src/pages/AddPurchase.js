import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { ArrowTrendingUpIcon, CurrencyDollarIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/solid';

const AddSales = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [brand, setBrand] = useState(''); // Store the brand name
  const [quantity, setQuantity] = useState('');
  const [model, setModel] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem('dealerToken');
        const response = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/dealers/brands', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBrands(response.data || []);
      } catch (error) {
        toast.error('Error fetching brands!');
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (brand) {
      const fetchModels = async () => {
        try {
          const response = await axios.get(`https://inventorysystem-a14x.onrender.com/api/var/dealers/brands/${brand}/categories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('dealerToken')}` }
          });
          setModels(response.data || []);
        } catch (error) {
          toast.error('Error fetching models!');
          console.error('Error fetching models:', error);
          setModels([]);
        }
      };

      fetchModels();
    } else {
      setModels([]);
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('dealerToken');

    const data = {
      brand,
      category: model,
      quantity: parseInt(quantity),
      date
    };

    try {
      const response = await axios.post('https://inventorysystem-a14x.onrender.com/api/var/dealers/purchases', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      toast.success('Sale added successfully!');
      console.log('Sale added successfully:', response.data);

      setBrand('');
      setQuantity('');
      setModel('');
      setDate('');
    } catch (error) {
      toast.error('Error adding sale!');
      console.error('Error adding sale:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
      <TopNav />

      <main className="flex-1 flex justify-center items-center p-4 mt-0">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Sale</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Brand Dropdown */}
              <div className="flex flex-col">
                <label htmlFor="brand" className="text-gray-700 mb-2 font-medium">
                  Choose Brand
                </label>
                <div className="relative">
                  <select
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-3 border border-teal-600 rounded-lg shadow-sm focus:ring-teal-400 focus:border-teal-600 transition duration-300 appearance-none"
                    required
                  >
                    <option value="">Select a brand</option>
                    {brands.map((b) => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <ArrowTrendingUpIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-teal-600 pointer-events-none" />
                </div>
              </div>

              {/* Quantity Input */}
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
                <CurrencyDollarIcon className="w-6 h-6 text-teal-600 mx-3" />
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                  placeholder="Enter Quantity"
                  required
                />
              </div>

              {/* Model Dropdown */}
              <div className="flex flex-col">
                <label htmlFor="model" className="text-gray-700 mb-2 font-medium">
                  Choose Model
                </label>
                <div className="relative">
                  <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-3 border border-teal-600 rounded-lg shadow-sm focus:ring-teal-400 focus:border-teal-600 transition duration-300 appearance-none"
                    required
                  >
                    <option value="">Select a model</option>
                    {models.length > 0 ? models.map((m) => (
                      <option key={m._id} value={m.modelNo}>{m.modelNo}</option>
                    )) : <option disabled>No models available</option>}
                  </select>
                  <TagIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-teal-600 pointer-events-none" />
                </div>
              </div>

              {/* Date Input */}
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
                <CalendarIcon className="w-6 h-6 text-teal-600 mx-3" />
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300 ease-in-out"
              >
                Add Sale
              </button>
            </form>
          </div>
        </div>
      </main>

      <BottomNav />
      <ToastContainer />
    </div>
  );
};

export default AddSales;
