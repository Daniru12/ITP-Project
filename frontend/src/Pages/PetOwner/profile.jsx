import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import HamsterLoader from '../../components/HamsterLoader';

export default function Profile() {
  // State to store user data
  const [userData, setUserData] = useState({
    username: '',
    full_name: '',
    email: '',
    phone_number: '',
    profile_picture: '',
    user_type: '',
    loyalty_points: 0
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
      <HamsterLoader />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            {/* Profile Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-accent)' }}>My Profile</h1>
              {userData.profile_picture && (
                <div className="relative inline-block">
                  <img
                    src={userData.profile_picture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    style={{ borderColor: 'var(--color-secondary)', borderWidth: '4px' }}
                  />
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p className="text-sm" style={{ color: 'var(--color-accent)' }}>Username</p>
                <p className="font-medium text-gray-900">{userData.username}</p>
              </div>

              <div className="border-b pb-3">
                <p className="text-sm" style={{ color: 'var(--color-accent)' }}>Full Name</p>
                <p className="font-medium text-gray-900">{userData.full_name}</p>
              </div>

              <div className="border-b pb-3">
                <p className="text-sm" style={{ color: 'var(--color-accent)' }}>Email</p>
                <p className="font-medium text-gray-900">{userData.email}</p>
              </div>

              <div className="border-b pb-3">
                <p className="text-sm" style={{ color: 'var(--color-accent)' }}>Phone Number</p>
                <p className="font-medium text-gray-900">{userData.phone_number}</p>
              </div>

              <div className="pb-3">
                <p className="text-sm" style={{ color: 'var(--color-accent)' }}>Account Type</p>
                <p className="font-medium text-gray-900 capitalize">{userData.user_type}</p>
              </div>

              {/* Loyalty Points Display */}
              <div className="pt-4 border-t">
                <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--color-accent)' }}>Loyalty Points</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>{userData.loyalty_points || 0}</p>
                  <p className="text-xs mt-1 text-gray-600">Points earned from your bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pets Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>My Pets</h2>
              <Link 
                to="/register-pet" 
                className="px-4 py-2 rounded-md text-white transition duration-300"
                style={{ backgroundColor: 'var(--color-primary)', hover: { backgroundColor: 'var(--color-primary-light)' } }}
              >
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
                  <div key={pet._id} className="rounded-lg p-4 transition-shadow hover:shadow-lg border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={pet.pet_image || "https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg"}
                          alt={pet.name}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{pet.name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium" style={{ color: 'var(--color-secondary)' }}>Species:</span> {pet.species}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium" style={{ color: 'var(--color-secondary)' }}>Breed:</span> {pet.breed}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium" style={{ color: 'var(--color-secondary)' }}>Age:</span> {pet.age}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium" style={{ color: 'var(--color-secondary)' }}>Gender:</span> {pet.gender}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Link 
                        to={`/edit-pet/${pet._id}`} 
                        className="text-sm font-medium transition-colors duration-300"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeletePet(pet._id)} 
                        className="text-sm font-medium transition-colors duration-300"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>My Appointments</h2>
            <Link 
              to="/Appointment"
              className="flex items-center px-4 py-2 rounded-md text-white transition duration-300"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <FaCalendarAlt className="mr-2" />
              View My Appointments
            </Link>
          </div>
          <div className="text-center py-6">
            <p className="text-gray-600 mb-2">Track and manage all your pet grooming appointments</p>
            <p className="text-sm text-gray-500">View appointment status, history, and upcoming bookings</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>My Products</h2>
            <Link 
              to="/ownerOrders"
              className="flex items-center px-4 py-2 rounded-md text-white transition duration-300"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <FaCalendarAlt className="mr-2" />
              View My Products
            </Link>
          </div>
          <div className="text-center py-6">
            <p className="text-gray-600 mb-2">Track and manage all your pet grooming products</p>
            <p className="text-sm text-gray-500">View product status, history, and upcoming bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
