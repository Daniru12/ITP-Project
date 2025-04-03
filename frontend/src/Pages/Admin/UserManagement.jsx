import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiUserPlus, FiSearch, FiFilter, FiAlertCircle, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import HamsterLoader from '../../components/HamsterLoader';
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const navigate = useNavigate();

  // Format user type for display
  const formatUserType = (userType) => {
    switch(userType) {
      case 'pet_owner':
        return 'Pet Owner';
      case 'service_provider':
        return 'Service Provider';
      case 'admin':
        return 'Admin';
      default:
        return userType;
    }
  };

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Redirect to login page
  const redirectToLogin = () => {
    toast.error('Please login to continue');
    localStorage.removeItem('token'); // Clear invalid token
    navigate('/login');
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      
      if (!token) {
        redirectToLogin();
        return;
      }
      
      // Get the correct API URL
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const response = await axios.get(`${apiUrl}/api/users/all-users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Check if response has data
      if (!response.data) {
        throw new Error('Empty response from server');
      }
      
      // Handle different response formats
      let usersData = [];
      if (response.data.users) {
        usersData = response.data.users;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      } else {
        console.warn('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      // Transform user data to match our component's expected format
      const formattedUsers = usersData.map(user => ({
        id: user._id,
        name: user.full_name || 'Unknown',
        username: user.username || 'unknown',
        email: user.email || 'unknown@example.com',
        phone: user.phone_number || 'N/A',
        role: formatUserType(user.user_type),
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
        lastLogin: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never',
        profilePicture: user.profile_picture || '',
        loyaltyPoints: user.loyalty_points || 0,
        isActive: user.isActive ?? true // Default to true if not set
      }));
      
      setUsers(formattedUsers);
      
    } catch (err) {
      console.error('Error fetching users:', err);
      // More detailed error logging
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('Request made but no response received:', err.request);
      }
      
      let errorMessage = 'Failed to fetch users';
      
      if (err.response?.status === 403) {
        errorMessage = 'You are not authorized to view users. Please login as an admin.';
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please login again.';
        setTimeout(() => {
          redirectToLogin();
        }, 3000);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = async (userId) => {
    try {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to delete user');
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/users/update/${userId}`);
  };

  const roles = ['All', 'Admin', 'Pet Owner', 'Service Provider'];
  const statuses = ['All', 'Active', 'Inactive', 'Pending'];

  // Add new function to handle account deactivation
  const handleToggleAccountStatus = async (userId, currentStatus) => {
    try {
      const token = getToken();
      if (!token) {
        redirectToLogin();
        return;
      }

      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await axios.put(
        `${apiUrl}/api/users/deactivate-account/${userId}`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        // Update the users list with the new status
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ));
        toast.success(`Account ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (err) {
      console.error('Error toggling account status:', err);
      toast.error(err.response?.data?.message || 'Failed to update account status');
    }
  };

  if (loading) {
    return (
      <HamsterLoader />
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center">
          <FiAlertCircle className="text-red-500 mr-3 text-xl" />
          <div>
            <h3 className="font-medium">Error Loading Users</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Users Management</h2>
        <button 
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <FiUserPlus className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email"
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role} Role</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status} Status</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.profilePicture} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleAccountStatus(user.id, user.isActive)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <FiToggleRight className="text-green-500" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <FiToggleLeft className="text-red-500" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FiEdit className="inline-block" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - simplified version */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{users.length}</span> users
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  3
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal - simplified version */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New User</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="pet_owner">Pet Owner</option>
                  <option value="service_provider">Service Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 