// src/pages/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from './AdminNav';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken'); // Retrieve the token from local storage

    try {
      const response = await axios.post(
        'http://localhost:5000/api/var/superAdmin/add-dealer',
        { username: name, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      toast.success('Dealer created successfully!');
      // Clear form fields
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error('Error creating dealer. Please try again.');
      console.error('Error in dealer creation:', error);
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="p-6 bg-gradient-to-r from-teal-200 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Add New Dealer</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Dealer Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border border-teal-500 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-teal-500 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border border-teal-500 rounded-md w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 transition-colors duration-300 w-full"
            >
              Add User
            </button>
          </form>
        </div>
      </div>
      <ToastContainer /> {/* Add this to show toast notifications */}
    </div>
  );
};

export default AddUser;
