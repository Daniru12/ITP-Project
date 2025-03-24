import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminUpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    pet_image: []
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to continue');
          navigate('/login');
          return;
        }

        const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/api/users/allpets`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const petData = response.data.pets.find(p => p._id === id);
        if (petData) {
          setPet({
            name: petData.name || '',
            species: petData.species || '',
            breed: petData.breed || '',
            age: petData.age || '',
            gender: petData.gender || '',
            pet_image: petData.pet_image || []
          });
        } else {
          toast.error('Pet not found');
          navigate('/admin/AllPets');
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
        toast.error(error.response?.data?.message || 'Error fetching pet details');
        navigate('/admin/AllPets');
      }
    };

    fetchPet();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setPet(prevState => ({
      ...prevState,
      pet_image: [e.target.value] // For now, just handle one image URL
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      await axios.put(
        `${apiUrl}/api/users/admin-update-pet/${id}`,
        pet,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Pet updated successfully');
      navigate('/admin/AllPets');
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error(error.response?.data?.message || 'Error updating pet');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Pet Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={pet.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Species</label>
          <input
            type="text"
            name="species"
            value={pet.species}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Breed</label>
          <input
            type="text"
            name="breed"
            value={pet.breed}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="text"
            name="age"
            value={pet.age}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={pet.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pet Image URL</label>
          <input
            type="url"
            name="pet_image"
            value={pet.pet_image[0] || ''}
            onChange={handleImageChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Pet
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/AllPets')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdatePet; 