import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dealerId, setDealerId] = useState(null);
  const navigate = useNavigate();

  // Fetch dealer information on component mount
  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const response = await axios.get('https://inventorysystem-a14x.onrender.com/api/var/superAdmin/dealers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dealerToken')}`
          }
        });
        // Assuming the API returns an array and we're interested in the first dealer
        const dealer = response.data[0]; 
        setDealerId(dealer._id);
      } catch (error) {
        toast.error('Failed to fetch dealer information.');
        console.error(error);
      }
    };

    fetchDealer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const data = JSON.stringify({
      oldPassword: currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword
    });

    const config = {
      method: 'put',
      url: `http://localhost:5000/api/var/dealers/change-password/${dealerId}`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('dealerToken')}`,
        'Content-Type': 'application/json'
      },
      data
    };

    try {
      const response = await axios.request(config);
      toast.success('Password changed successfully!');
      navigate('/settings'); // Redirect to settings or desired page
    } catch (error) {
      toast.error('Error changing password!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-16">Change Password</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
        >
          {error && <p className="text-red-600 mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current-password">
              Current Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <LockClosedIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
              New Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <LockClosedIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <LockClosedIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className={`bg-teal-600 text-white p-2 rounded-md w-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
      <BottomNav />
      <ToastContainer />
    </>
  );
};

export default ChangePassword;
