import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaStar, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
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
    <div className="container mx-auto px-4 py-8">
      {/* Provider Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img 
              src={providerInfo?.profile_picture || "https://via.placeholder.com/150"} 
              alt="Provider" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{providerInfo?.full_name || "Service Provider"}</h1>
            <p className="text-gray-600 mb-2">{providerInfo?.email}</p>
            <p className="text-gray-600 mb-4">{providerInfo?.phone_number}</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Services</h2>
          <Link 
            to="/add-service"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Add New Service
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't added any services yet.</p>
            <p className="text-gray-500">Start by adding your first service!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{service.service_name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                      {service.service_category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium mb-2">Packages:</h4>
                  <div className="space-y-3">
                    {service.packages && Object.entries(service.packages).map(([tier, details]) => (
                      <div key={tier} className="flex justify-between items-center">
                        <div>
                          <span className="capitalize font-medium">{tier}</span>
                          <p className="text-sm text-gray-500">{details.duration} mins</p>
                        </div>
                        <span className="font-semibold">{formatPrice(details.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${service.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {service.is_available ? 'Available' : 'Unavailable'}
                  </span>
                  <div className="flex space-x-2">
                    <Link to={`/update-service/${service._id}`} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </Link>
                    <button className="text-red-600 hover:text-red-800" onClick={()=>handleDeleteService(service._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Appointments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Appointments</h2>
          <Link 
            to="/AppointmentLIST"
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
          >
            <FaCalendarAlt className="mr-2" />
            View All Appointments
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Manage all your appointments in one place</p>
          <p className="text-gray-400 text-sm">Click the button above to view, confirm, or cancel appointments</p>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Products</h2>
          <Link 
            to="/#"
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
          >
            <FaCalendarAlt className="mr-2" />
            View All Products
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Manage all your products in one place</p>
          <p className="text-gray-400 text-sm">Click the button above to view, confirm, or cancel products</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;

