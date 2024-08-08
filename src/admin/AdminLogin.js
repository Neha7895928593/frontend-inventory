import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = JSON.stringify({
        username,
        password,
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://inventorysystem-a14x.onrender.com/api/var/superAdmin/superAdminLogin',
        headers: { 
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.success) { // Assuming the API responds with a 'success' field
        const token = response.data.token; // Assuming the token is in 'response.data.token'
        localStorage.setItem('authToken', token); // Store the token in localStorage
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/admin/dashboard');
      } else {
        setError('Invalid login credentials');
        toast.error('Invalid login credentials!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      toast.error('An error occurred during login. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full mb-4"
        />
        <button
          onClick={handleLogin}
          className="bg-teal-600 text-white p-2 rounded-md w-full"
        >
          Login
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
