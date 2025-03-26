import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UpdateUser = () => {
  // Get the user ID from URL parameters and initialize navigation
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize user state with empty values
  const [user, setUser] = useState({
    username: '',
    full_name: '',
    email: '',
    phone_number: '',
    profile_picture: ''
  });

  // Function to check if user is logged in
  const checkUserLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return null;
    }
    return token;
  };

  // Function to get the backend API URL
  const getApiUrl = () => {
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  };

  // Function to fetch user details from the server
  const fetchUserDetails = async () => {
    try {
      // Check if user is logged in
      const token = checkUserLogin();
      if (!token) return;

      // Make API call to get user data
      const response = await axios.get(
        `${getApiUrl()}/api/users/all-users`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Process the response data
      let userData = null;
      if (response.data.users) {
        // If response has users array
        userData = response.data.users.find(u => u._id === id);
      } else if (Array.isArray(response.data)) {
        // If response is an array
        userData = response.data.find(u => u._id === id);
      }

      // If user is found, update the state
      if (userData) {
        setUser({
          username: userData.username || '',
          full_name: userData.full_name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          profile_picture: userData.profile_picture || ''
        });
      } else {
        // If user is not found, show error and redirect
        toast.error('User not found');
        navigate('/admin/users');
      }
    } catch (error) {
      // Handle any errors that occur
      console.error('Error fetching user:', error);
      toast.error('Failed to load user details');
      navigate('/admin/users');
    }
  };

  // Load user data when component mounts
  useEffect(() => {
    fetchUserDetails();
  }, [id, navigate]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if user is logged in
      const token = checkUserLogin();
      if (!token) return;

      // Make API call to update user
      await axios.put(
        `${getApiUrl()}/api/users/update-user/${id}`,
        user,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Show success message and redirect
      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      // Handle any errors that occur
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  // Render the form
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update User Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>

        {/* Full Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={user.full_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_number"
            value={user.phone_number}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>

        {/* Profile Picture URL Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture URL
          </label>
          <input
            type="url"
            name="profile_picture"
            value={user.profile_picture}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        {/* Form Buttons */}
        <div className="flex gap-4 pt-4">
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser; 