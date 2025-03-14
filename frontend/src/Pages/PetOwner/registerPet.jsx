import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const registerPet = () => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [petImage, setPetImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, species, breed, gender, age, weight, petImage);

        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        axios.post(`${backendUrl}/api/users/pet`, {
            name,
            species,
            breed,
            gender,
            age,
            weight,
            petImage
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(()=>{
            toast.success("Pet registered successfully");
            navigate("/profile");
        })
        .catch((err)=>{
            toast.error("Error registering pet");
        })
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
      <label htmlFor="petImage">Pet Image:</label>
      <input
        type="file"
        id="petImage"
        multiple
        onChange={(e) => setPetImage(e.target.files)}
        style={{ width: '100%' }}
      />
    </div>
    <button
      type="submit"
      style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: '#fff', fontSize: '16px' }}
    >
      Register
    </button>
  </form>
</div>

  )
}

export default registerPet
