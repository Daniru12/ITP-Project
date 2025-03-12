import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Profile() {
  // State to store user data
  const [userData, setUserData] = useState({
    username: '',
    full_name: '',
    email: '',
    phone_number: '',
    profile_picture: '',
    user_type: ''
  });

  // State for loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        const response = await axios.get(`${backendUrl}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once when component mounts

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h1>
          {userData.profile_picture && (
            <img
              src={userData.profile_picture}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
            />
          )}
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="border-b pb-3">
            <p className="text-gray-600 text-sm">Username</p>
            <p className="text-gray-900 font-medium">{userData.username}</p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-600 text-sm">Full Name</p>
            <p className="text-gray-900 font-medium">{userData.full_name}</p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-gray-900 font-medium">{userData.email}</p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-600 text-sm">Phone Number</p>
            <p className="text-gray-900 font-medium">{userData.phone_number}</p>
          </div>

          <div className="pb-3">
            <p className="text-gray-600 text-sm">Account Type</p>
            <p className="text-gray-900 font-medium capitalize">{userData.user_type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


