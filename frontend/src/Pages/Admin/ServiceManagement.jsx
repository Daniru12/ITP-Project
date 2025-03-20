import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiX as FiClose, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Component for displaying package information (Basic, Premium, Luxury)
const PackageCard = ({ tier, details }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-semibold text-lg capitalize mb-2">{tier}</h4>
      <div className="space-y-2">
        {/* Price */}
        <p className="text-2xl font-bold text-blue-600">${details.price}</p>
        {/* Duration */}
        <p className="text-gray-600">{details.duration} minutes</p>
        {/* Services included */}
        <div className="mt-4">
          <p className="font-medium mb-2">Includes:</p>
          <ul className="list-disc list-inside text-gray-600">
            {details.includes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Component for displaying provider information
const ProviderInfo = ({ provider }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Provider Information</h3>
      <div className="space-y-3">
        {/* Provider Name */}
        <div className="flex items-center gap-3">
          <FiUser className="text-gray-400" />
          <span className="text-gray-700">{provider?.full_name || 'N/A'}</span>
        </div>
        {/* Provider Email */}
        <div className="flex items-center gap-3">
          <FiMail className="text-gray-400" />
          <span className="text-gray-700">{provider?.email || 'N/A'}</span>
        </div>
        {/* Provider Phone */}
        <div className="flex items-center gap-3">
          <FiPhone className="text-gray-400" />
          <span className="text-gray-700">{provider?.phone_number || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

// Modal component for displaying service details
const ServiceDetailsModal = ({ service, onClose }) => {
  if (!service) return null;

  return (
    // Modal overlay with backdrop blur
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold">{service.service_name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiClose className="h-6 w-6" />
            </button>
          </div>

          {/* Service status badges */}
          <div className="flex items-center gap-4 mb-6">
            {/* Category badge */}
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              {service.service_category.replace('_', ' ')}
            </span>
            {/* Status badge */}
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              service.is_available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {service.is_available ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Service description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>

          {/* Provider information section */}
          <ProviderInfo provider={service.provider_id} />

          {/* Package details section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Package Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Map through each package type (basic, premium, luxury) */}
              {service.packages && Object.entries(service.packages).map(([tier, details]) => (
                <PackageCard key={tier} tier={tier} details={details} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main ServiceManagement component
const ServiceManagement = () => {
  // State variables
  const [services, setServices] = useState([]); // List of all services
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedService, setSelectedService] = useState(null); // Currently selected service

  // Fetch services when component mounts
  useEffect(() => {
    fetchServices();
  }, []);

  // Function to fetch all services from the backend
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      const response = await axios.get(`${backendUrl}/api/users/services`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setServices(response.data.services);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
      toast.error('Failed to load services');
      setLoading(false);
    }
  };

  // Function to toggle service active status
  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      await axios.patch(
        `${backendUrl}/api/services/${serviceId}/toggle-status`,
        { is_available: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the service status in the local state
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, is_available: !service.is_available }
          : service
      ));
      
      toast.success('Service status updated successfully');
    } catch (error) {
      console.error('Error updating service status:', error);
      toast.error('Failed to update service status');
    }
  };

  // Helper function to safely get the basic package price
  const getBasicPrice = (service) => {
    try {
      return service.packages?.basic?.price 
        ? `$${service.packages.basic.price}` 
        : 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to safely get the provider name
  const getProviderName = (service) => {
    if (!service.provider_id) return 'Unknown Provider';
    return service.provider_id.full_name || service.provider_id.username || 'Unknown Provider';
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  async function handleDeleteService(serviceId) {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this service? This action cannot be undone.");
    
    if (!isConfirmed) {
      return; // If user cancels, don't proceed with deletion
    }

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.delete(`${backendUrl}/api/users/admin-delete-service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Show success message
      toast.success('Service deleted successfully');
      
      // Update local state
      setServices(services.filter(service => service._id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
      // Show more specific error message
      const errorMessage = error.response?.data?.message || 'Failed to delete service. Please try again.';
      toast.error(errorMessage);
    }
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Services Management</h2>
      </div>

      {/* Services table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr 
                  key={service._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  {/* Service name and description */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {service.service_name || 'Unnamed Service'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.description 
                        ? `${service.description.substring(0, 50)}...`
                        : 'No description available'}
                    </div>
                  </td>
                  {/* Service category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {(service.service_category || 'uncategorized').replace('_', ' ')}
                    </span>
                  </td>
                  {/* Provider name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getProviderName(service)}
                  </td>
                  {/* Basic price */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getBasicPrice(service)}
                  </td>
                  {/* Status toggle button */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleServiceStatus(service._id, service.is_available);
                      }}
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        service.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service.is_available ? (
                        <><FiCheck className="mr-1" /> Active</>
                      ) : (
                        <><FiX className="mr-1" /> Inactive</>
                      )}
                    </button>
                  </td>
                  {/* Action buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit (to be implemented)
                        }}
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleDeleteService(service._id);
                        }}
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service details modal */}
      {selectedService && (
        <ServiceDetailsModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
};

export default ServiceManagement;
