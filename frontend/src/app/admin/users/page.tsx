'use client';

import { useState, useEffect } from 'react';
import { localAuthService } from '@/lib/localAuthService';
import { User } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    // Load all users
    const allUsers = localAuthService.getAllUsers();
    setUsers(allUsers);
  }, []);

  const handleResetUsers = () => {
    if (confirm('Are you sure you want to reset all users to default? This will remove all newly registered users.')) {
      localAuthService.resetUsers();
      const allUsers = localAuthService.getAllUsers();
      setUsers(allUsers);
    }
  };

  const handleRefreshUsers = () => {
    const allUsers = localAuthService.getAllUsers();
    setUsers(allUsers);
  };

  // Check if current user is admin
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h1>
          <p className="text-red-600">You need admin privileges to access this page.</p>
          <p className="text-sm text-red-500 mt-2">
            Please login with admin credentials: admin@ecommerce.com / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="space-x-2">
          <button
            onClick={handleRefreshUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={handleResetUsers}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reset to Default
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold">All Registered Users ({users.length})</h2>
          <p className="text-sm text-gray-600">
            This includes both default users and newly registered users stored in localStorage
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={user.id === currentUser.id ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                          {user.id === currentUser.id && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.id.startsWith('local-user-') && parseInt(user.id.split('-')[2]) < 1000000000000
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.id.startsWith('local-user-') && parseInt(user.id.split('-')[2]) < 1000000000000 
                        ? 'Default' 
                        : 'Registered'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Default users</strong> come from the users.json file</li>
          <li>• <strong>Newly registered users</strong> are stored in localStorage</li>
          <li>• Registration data persists across browser sessions</li>
          <li>• Use "Reset to Default" to clear all registered users</li>
        </ul>
      </div>
    </div>
  );
}
