import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // For redirecting to update page

const DeleteAdvertisement = ({ ads }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to delete an advertisement');
          return;
        }

        await axios.delete(
          `${backendUrl}/api/advertisement/delete/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success('Advertisement deleted successfully!');
        // Optionally, reload or re-fetch the ads list
      } catch (error) {
        toast.error('Failed to delete advertisement.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <div key={ad._id} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-md">
          <div>
            <h3 className="text-xl">{ad.title}</h3>
            <p>{ad.description}</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => navigate(`/update-ad/${ad._id}`)} className="text-blue-600">Edit</button>
            <button onClick={() => handleDelete(ad._id)} className="text-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeleteAdvertisement;
