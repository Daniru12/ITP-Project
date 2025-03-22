import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import mediaUpload from '../../../utils/mediaUpload';

const UpdatePet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State for form fields
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [petImage, setPetImage] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch existing pet data
    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const token = localStorage.getItem('token');
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                const response = await axios.get(`${backendUrl}/api/users/pet/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const pet = response.data.pet;
                setName(pet.name);
                setSpecies(pet.species);
                setBreed(pet.breed);
                setGender(pet.gender);
                setAge(pet.age.toString());
                setCurrentImages(pet.pet_image || []);
            } catch (error) {
                console.error("Error fetching pet data:", error);
                toast.error("Failed to load pet data");
                navigate("/profile");
            }
        };

        fetchPetData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to update pet information");
                navigate("/login");
                return;
            }

            // Upload new images if any
            const newImageUrls = [];
            for (let i = 0; i < petImage.length; i++) {
                try {
                    const url = await mediaUpload(petImage[i]);
                    newImageUrls.push(url);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    toast.error("Error uploading image");
                    setIsLoading(false);
                    return;
                }
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            // Combine existing and new images
            const allImages = [...currentImages, ...newImageUrls];
            
            // Send updated pet data to backend
            await axios.put(`${backendUrl}/api/users/pet/${id}`, {
                name,
                species,
                breed,
                gender,
                age: Number(age),
                pet_image: allImages
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Pet information updated successfully");
            navigate("/profile");
        } catch (error) {
            console.error("Error updating pet:", error);
            toast.error(error.response?.data?.message || "Error updating pet");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Update Pet Information</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pet Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Species Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Species</label>
                    <input
                        type="text"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Breed Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Breed</label>
                    <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Gender Display */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50">
                        {gender}
                    </div>
                </div>

                {/* Age Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        min="0"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Current Images Display */}
                {currentImages.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                        <div className="grid grid-cols-3 gap-4">
                            {currentImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Pet ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* New Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Add New Images</label>
                    <input
                        type="file"
                        onChange={(e) => setPetImage(Array.from(e.target.files || []))}
                        multiple
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                        {isLoading ? 'Updating...' : 'Update Pet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePet;
