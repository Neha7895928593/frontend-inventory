import React from 'react';
import { CogIcon, TagIcon, PencilIcon, ArrowLeftOnRectangleIcon, ChartBarIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';  // Adjust the path as needed
import BottomNav from '../components/BottomNav';  // Adjust the path as needed

const settingsOptions = [
  { Icon: TagIcon, text: 'Add Brand', path: '/add-brand' },
  { Icon: TagIcon, text: 'Add Category', path: '/add-category' },  // Fixed typo in path
  { Icon: PencilIcon, text: 'View Brand', path: '/view-brand' },
  { Icon: PencilIcon, text: 'View Category', path: '/view-category' },
  { Icon: ChartBarIcon, text: 'View Performance', path: '/view-performance' },
  { Icon: LockClosedIcon, text: 'Change Password', path: '/change-password' },
  { Icon: ArrowLeftOnRectangleIcon, text: 'Log Out', path: '/', isLogout: true }
];

const SettingsPage = () => {
  const navigate = useNavigate();

  // Mock authentication state
  const isAuthenticated = true; // Replace with actual authentication logic

  const handleNavigation = (path, isLogout = false) => {
    if (isLogout) {
      // Implement your log out logic here
      localStorage.removeItem('dealerToken,dealers'); // Remove token or other session data
      console.log("User logged out");

      // Redirect to login page
      navigate('/'); // Adjust the path as needed
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsOptions.map((option, index) => (
              (!option.isLogout || (option.isLogout && isAuthenticated)) && (
                <button
                  key={index}
                  className="bg-gray-100 shadow-lg rounded-lg p-4 flex items-center space-x-4 cursor-pointer hover:bg-teal-700 hover:text-white transition"
                  onClick={() => handleNavigation(option.path, option.isLogout)}
                >
                  <option.Icon className="w-6 h-6 text-teal-600" />
                  <span className="text-lg font-medium text-gray-800">{option.text}</span>
                </button>
              )
            ))}
          </div>
        </div>
        <BottomNav className="mt-16" />
      </div>
    </>
  );
};

export default SettingsPage;
