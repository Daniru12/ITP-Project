import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
  // State to store user pets
  const [userPets, setUserPets] = useState([]);

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

    const fetchUserPets = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const response = await axios.get(`${backendUrl}/api/users/pets`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserPets(response.data.pets || []);
        console.log(response.data.pets);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user pets:', error);
        toast.error('Failed to load pets');
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchUserPets();
  }, []); // Empty dependency array means this runs once when component mounts

  function handleDeletePet(id) {
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    axios.delete(`${backendUrl}/api/users/deletePet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      toast.success('Pet deleted successfully');
      setUserPets(userPets.filter(pet => pet._id !== id));
    })
    .catch((err) => {
      console.error('Error deleting pet:', err);
      toast.error('Failed to delete pet');
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
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

        {/* Pets Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Pets</h2>
              <Link to="/register-pet" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Add New Pet
              </Link>
            </div>

            {userPets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't added any pets yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userPets.map((pet) => (
                  <div key={pet._id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={pet.pet_image || "https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg"}
                          alt={pet.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Species:</span> {pet.species}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Breed:</span> {pet.breed}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Age:</span> {pet.age}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Gender:</span> {pet.gender}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Link to={`/edit-pet/${pet._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit
                      </Link>
                      <button onClick={() => handleDeletePet(pet._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
