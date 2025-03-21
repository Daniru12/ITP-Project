import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FiX } from 'react-icons/fi';

const PetDetailsModal = ({ pet, onClose }) => {
  if (!pet) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4">{pet.name}'s Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={pet.pet_image?.[0] || 'https://via.placeholder.com/150'} 
              alt={pet.name}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Pet Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Species:</span> {pet.species}</p>
                <p><span className="font-medium">Breed:</span> {pet.breed}</p>
                <p><span className="font-medium">Age:</span> {pet.age}</p>
                <p><span className="font-medium">Gender:</span> {pet.gender}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Owner Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Name:</span> {pet.owner_id?.full_name}</p>
                <p><span className="font-medium">Email:</span> {pet.owner_id?.email}</p>
                <p><span className="font-medium">Phone:</span> {pet.owner_id?.phone_number}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Registration Details</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Registered:</span> {new Date(pet.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Last Updated:</span> {new Date(pet.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PetsManagement = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      const response = await axios.get(`${backendUrl}/api/users/allpets`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPets(response.data.pets || []); // Changed from response.data to response.data.pets
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError('Failed to load pets');
      toast.error('Failed to load pets');
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this pet? This action cannot be undone.");
    
    if (!isConfirmed) {
      return; // If user cancels, don't proceed with deletion
    }

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.delete(`${backendUrl}/api/users/admin-delete-pet/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Pet deleted successfully');
      setPets(pets.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error('Error deleting pet:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete pet';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Pets Management</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pet Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pets.map((pet) => (
                <tr 
                  key={pet._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedPet(pet)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={pet.pet_image?.[0] || 'https://via.placeholder.com/150'} 
                          alt={pet.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {pet.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pet.owner_id?.full_name || 'Unknown Owner'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pet.owner_id?.email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleDeletePet(pet._id);
                        }} 
                        className="text-red-600 hover:text-red-900"
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

      {/* Modal */}
      {selectedPet && (
        <PetDetailsModal 
          pet={selectedPet} 
          onClose={() => setSelectedPet(null)} 
        />
      )}
    </div>
  );
};

export default PetsManagement;
