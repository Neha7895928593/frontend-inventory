// src/pages/ViewUsers.js
import React, { useState, useEffect } from 'react';
import AdminNav from './AdminNav';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API or database
    // For demo purposes, using static data
    const fetchedUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      // Add more users as needed
    ];
    setUsers(fetchedUsers);
  }, []);

  const handleDelete = (id) => {
    // Implement delete logic here
    // Example: send a delete request to the API
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div>
      <AdminNav />
      <div className="p-6 bg-gradient-to-r from-teal-200 to-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 mt-16">View All Users</h1>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-teal-500 text-white">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 flex space-x-2">
                  <Link to={`/admin/edit-user/${user.id}`} className="text-teal-600 hover:text-teal-800">
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsers;
