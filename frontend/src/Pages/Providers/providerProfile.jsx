import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaStar, FaEdit, FaTrash, FaCalendarAlt, FaUser, FaCut, FaBox } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProviderProfile = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerInfo, setProviderInfo] = useState(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        // Fetch provider profile information
        const profileResponse = await axios.get(`${backendUrl}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProviderInfo(profileResponse.data);
        
        // Fetch provider services
        const servicesResponse = await axios.get(`${backendUrl}/api/grooming/provider`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setServices(servicesResponse.data.services || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching provider data:', error);
        setError('Failed to load provider data');
        toast.error('Failed to load provider data');
        setLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  // Function to format price display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

function handleDeleteService(serviceId) {
  console.log(serviceId);
  try {
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    axios.delete(`${backendUrl}/api/users/service/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    toast.success('Service deleted successfully');
    setServices(services.filter(service => service._id !== serviceId));
    window.location.reload();
  } catch (error) {
    console.error('Error deleting service:', error);
    toast.error('Failed to delete service');
  }
}

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                {providerInfo?.profile_picture ? (
                  <img
                    src={providerInfo.profile_picture}
                    alt="Profile"
                    className="w-36 h-36 rounded-full mx-auto mb-6 object-cover ring-4 ring-offset-4"
                    style={{ borderColor: 'var(--color-accent)' }}
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full mx-auto mb-6 bg-gray-100 flex items-center justify-center">
                    <FaUser className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>{providerInfo?.full_name || "Service Provider"}</h1>
              <p className="text-gray-500">Professional Groomer</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900 break-all text-sm">{providerInfo?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{providerInfo?.phone_number}</p>
                  </div>
                </div>
              </div>

              <Link 
                to="/edit-profile" 
                className="block text-center px-6 py-2.5 rounded-full text-white transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Services Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <FaCut className="w-6 h-6 mr-3" style={{ color: 'var(--color-accent)' }} />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>My Services</h2>
              </div>
              <Link 
                to="/add-service"
                className="px-6 py-2.5 rounded-full text-white transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Add New Service
              </Link>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12">
                <FaCut className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No services added yet</p>
                <p className="text-sm text-gray-400 mt-2">Start by adding your first service!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div key={service._id} className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>{service.service_name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full capitalize">
                        {service.service_category.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      {service.packages && Object.entries(service.packages).map(([tier, details]) => (
                        <div key={tier} className="flex justify-between items-center bg-white rounded-lg p-3">
                          <div>
                            <span className="capitalize font-medium text-sm">{tier}</span>
                            <p className="text-xs text-gray-500">{details.duration} mins</p>
                          </div>
                          <span className="font-semibold text-sm">{formatPrice(details.price)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        service.is_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.is_available ? 'Available' : 'Unavailable'}
                      </span>
                      <div className="flex space-x-3">
                        <Link 
                          to={`/update-service/${service._id}`} 
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteService(service._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appointments Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <FaCalendarAlt className="w-6 h-6 mr-3" style={{ color: 'var(--color-accent)' }} />
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>Appointments</h2>
              </div>
              <p className="text-gray-600 mb-6">Manage your upcoming appointments and bookings</p>
              <Link 
                to="/AppointmentLIST"
                className="inline-flex items-center px-6 py-2.5 rounded-full text-white transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                View Appointments
              </Link>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <FaBox className="w-6 h-6 mr-3" style={{ color: 'var(--color-accent)' }} />
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>Products</h2>
              </div>
              <p className="text-gray-600 mb-6">Manage your product inventory and listings</p>
              <Link 
                to="/delete-product"
                className="inline-flex items-center px-6 py-2.5 rounded-full text-white transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;

