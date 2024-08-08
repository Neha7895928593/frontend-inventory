import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserPlusIcon, UserGroupIcon, Cog8ToothIcon } from '@heroicons/react/24/solid';

const AdminNav = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, path: '/admin/dashboard' },
    { name: 'Add Dealer', icon: <UserPlusIcon className="w-6 h-6" />, path: '/admin/addusers' },
    { name: 'View Users', icon: <UserGroupIcon className="w-6 h-6" />, path: '/admin/viewuser' },
    { name: 'Settings', icon: <Cog8ToothIcon className="w-6 h-6" />, path: '/admin/settings' },
  ];

  return (
    <div className="bg-teal-800 text-white p-4 fixed top-0 left-0 w-full shadow-lg flex justify-between items-center">
      {/* Logo and System Name */}
      <div className="flex items-center">
        <span className="text-lg font-bold">Inventory Management System</span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        {navItems.map(({ name, icon, path }) => (
          <Link
            key={name}
            to={path}
            className={`flex items-center group transition-transform transform ${location.pathname === path ? 'scale-110 text-teal-200' : 'hover:scale-110'}`}
          >
            {React.cloneElement(icon, { className: `w-6 h-6 ${location.pathname === path ? 'text-teal-200' : 'text-white'} group-hover:text-teal-200 transition-colors duration-300` })}
            <span className={`ml-2 ${location.pathname === path ? 'text-teal-200' : 'group-hover:text-teal-200'} transition-colors duration-300`}>
              {name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminNav;
