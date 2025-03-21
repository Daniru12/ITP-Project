import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import mediaUpload from '../../../utils/mediaUpload';

const registerPet = () => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [petImage, setPetImage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to register a pet");
                navigate("/login");
                return;
            }

            // Upload images to Supabase
            const imageUrls = [];
            for (let i = 0; i < petImage.length; i++) {
                try {
                    const url = await mediaUpload(petImage[i]);
                    imageUrls.push(url);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    toast.error("Error uploading image");
                    setIsLoading(false);
                    return;
                }
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            // Send pet data with image URLs to backend
            const response = await axios.post(`${backendUrl}/api/users/pet`, {
                name,
                species,
                breed,
                gender,
                age: Number(age),
                weight: Number(weight),
                pet_image: imageUrls, // Send array of image URLs
                owner_id: JSON.parse(atob(token.split('.')[1]))._id // Get user ID from token
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Pet registered successfully");
            navigate("/profile");
        } catch (error) {
            console.error("Error registering pet:", error);
            toast.error(error.response?.data?.message || "Error registering pet");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center' }}>Register Pet</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter pet's name"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="species">Species:</label>
                    <input
                        type="text"
                        id="species"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        placeholder="Enter pet's species"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="breed">Breed:</label>
                    <input
                        type="text"
                        id="breed"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="Enter pet's breed"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="gender">Gender:</label>
                    <input
                        type="text"
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        placeholder="Enter pet's gender"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter pet's age"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="weight">Weight (kg):</label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Enter pet's weight"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="petImage">Pet Images:</label>
                    <input
                        type="file"
                        id="petImage"
                        multiple
                        accept="image/*"
                        onChange={(e) => setPetImage(e.target.files)}
                        style={{ width: '100%' }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        border: 'none', 
                        backgroundColor: isLoading ? '#ccc' : '#28a745', 
                        color: '#fff', 
                        fontSize: '16px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    )
}

export default registerPet
