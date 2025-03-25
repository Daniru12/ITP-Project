import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UpdateService = () => {
  // Get service ID from URL and initialize navigation
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize service state with empty values
  const [service, setService] = useState({
    service_name: '',
    description: '',
    service_category: '',
    is_available: true,
    packages: {
      basic: { price: '', duration: '', includes: [] },
      premium: { price: '', duration: '', includes: [] },
      luxury: { price: '', duration: '', includes: [] }
    }
  });

  // Helper function to check user login
  const checkUserLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return null;
    }
    return token;
  };

  // Helper function to get API URL
  const getApiUrl = () => {
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  };

  // Function to fetch service details
  const fetchServiceDetails = async () => {
    try {
      const token = checkUserLogin();
      if (!token) return;

      const response = await axios.get(
        `${getApiUrl()}/api/users/services`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Find the specific service
      const serviceData = response.data.services.find(s => s._id === id);
      
      if (serviceData) {
        setService({
          service_name: serviceData.service_name || '',
          description: serviceData.description || '',
          service_category: serviceData.service_category || '',
          is_available: serviceData.is_available ?? true,
          packages: {
            basic: {
              price: serviceData.packages?.basic?.price || '',
              duration: serviceData.packages?.basic?.duration || '',
              includes: serviceData.packages?.basic?.includes || []
            },
            premium: {
              price: serviceData.packages?.premium?.price || '',
              duration: serviceData.packages?.premium?.duration || '',
              includes: serviceData.packages?.premium?.includes || []
            },
            luxury: {
              price: serviceData.packages?.luxury?.price || '',
              duration: serviceData.packages?.luxury?.duration || '',
              includes: serviceData.packages?.luxury?.includes || []
            }
          }
        });
      } else {
        toast.error('Service not found');
        navigate('/admin/Services');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to load service details');
      navigate('/admin/Services');
    }
  };

  // Load service data when component mounts
  useEffect(() => {
    fetchServiceDetails();
  }, [id, navigate]);

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle package changes
  const handlePackageChange = (packageType, field, value) => {
    setService(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          [field]: value
        }
      }
    }));
  };

  // Handle includes list changes
  const handleIncludesChange = (packageType, value) => {
    // Split the textarea value into an array by new lines
    const includesArray = value.split('\n').filter(item => item.trim() !== '');
    
    handlePackageChange(packageType, 'includes', includesArray);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = checkUserLogin();
      if (!token) return;

      await axios.put(
        `${getApiUrl()}/api/users/admin-update-service/${id}`,
        service,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.success('Service updated successfully');
      navigate('/admin/Services');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  // Render the form
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Update Service Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Service Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          
          {/* Service Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              name="service_name"
              value={service.service_name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Service Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="service_category"
              value={service.service_category}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="pet_grooming">Pet Grooming</option>
              <option value="pet_boarding">Pet Boarding</option>
              <option value="pet_training">Pet Training</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Availability Toggle */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_available"
                checked={service.is_available}
                onChange={(e) => handleChange({
                  target: { name: 'is_available', value: e.target.checked }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Service is Available</span>
            </label>
          </div>
        </div>

        {/* Package Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Package Details</h3>
          
          {/* Map through package types */}
          {['basic', 'premium', 'luxury'].map((packageType) => (
            <div key={packageType} className="mb-6 last:mb-0">
              <h4 className="text-md font-medium mb-3 capitalize">{packageType} Package</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={service.packages[packageType].price}
                    onChange={(e) => handlePackageChange(packageType, 'price', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={service.packages[packageType].duration}
                    onChange={(e) => handlePackageChange(packageType, 'duration', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Includes */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Included Services (one per line)
                </label>
                <textarea
                  value={service.packages[packageType].includes.join('\n')}
                  onChange={(e) => handleIncludesChange(packageType, e.target.value)}
                  rows="4"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter included services..."
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Form Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/Services')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateService; 