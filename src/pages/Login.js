import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    const data = JSON.stringify({
      email: email,
      password: password
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://inventorysystem-a14x.onrender.com/api/var/dealers/login',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      const { token, dealer } = response.data; // Assuming the token and dealer are returned in the response
      localStorage.setItem('dealerToken', token);
      localStorage.setItem('dealer', JSON.stringify(dealer)); // Save dealer as a JSON string
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please check your credentials and try again.');
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-teal-200 to-gray-100 pt-16">
        <div className="relative w-full max-w-md p-8 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-transparent to-gray-100 opacity-80"></div>
          <h2 className="text-3xl font-extrabold mb-6 text-center text-teal-600">Login Here</h2>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <UserIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="text"
                id="email"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <LockClosedIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <br />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-md shadow-md hover:bg-teal-600 hover:shadow-lg transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
