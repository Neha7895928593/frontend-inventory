// src/pages/ViewUsers.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/solid';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

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

  const handleDelete = () => {
    // Implement delete logic here
    // Example: send a delete request to the API
    setUsers(users.filter(user => user.id !== userToDelete));
    setShowConfirmDelete(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSaveEdit = () => {
    // Implement save logic here
    setEditingUser(null);
  };

  const handleView = (id) => {
    navigate(`/admin/UserDetails/${id}`);
  };

  return (
    <div>
      <AdminNav />
      <div className="p-6 bg-gradient-to-r from-teal-200 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 p-4 bg-teal-500 text-white rounded-t-lg">View All Users</h1>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-teal-500 text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">
                    {editingUser && editingUser.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="p-2 border border-teal-500 rounded-md w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="p-3">
                    {editingUser && editingUser.id === user.id ? (
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="p-2 border border-teal-500 rounded-md w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="p-3">
                    {editingUser && editingUser.id === user.id ? (
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="p-2 border border-teal-500 rounded-md w-full"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="p-3 flex space-x-2">
                    {editingUser && editingUser.id === user.id ? (
                      <>
                        <button onClick={handleSaveEdit} className="text-teal-600 hover:text-teal-800">
                          Save
                        </button>
                        <button onClick={() => setEditingUser(null)} className="text-red-600 hover:text-red-800">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleView(user.id)} className="text-blue-600 hover:text-blue-800">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleEdit(user)} className="text-teal-600 hover:text-teal-800">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => {
                          setUserToDelete(user.id);
                          setShowConfirmDelete(true);
                        }} className="text-red-600 hover:text-red-800">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Confirmation Dialog */}
          {showConfirmDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this user?</p>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
