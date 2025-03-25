import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdReviewComponent = () => {
  const [adDetails, setAdDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewStatus, setReviewStatus] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      setError('Invalid token. Please log in again.');
      return;
    }

    const fetchAdDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:3000/api/advertisement', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdDetails(response.data);
      } catch (err) {
        setError('Failed to fetch advertisement details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, []);

  const handleApprove = async (adId, imageUrl) => {
    setReviewStatus((prev) => ({ ...prev, [adId]: 'approved' }));
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/advertisement/approve/${adId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('approvedImageUrl', imageUrl);
    } catch (err) {
      setError('Failed to approve the advertisement.');
    }
  };

  const handleReject = async (adId) => {
    setReviewStatus((prev) => ({ ...prev, [adId]: 'rejected' }));

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/advertisement/reject/${adId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setError('Failed to reject the advertisement.');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!adDetails.length) return <div className="text-center py-4">No advertisement details available.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6 text-center">Ad Review</h2>
      <div className="space-y-6">
        {adDetails.map((ad) => (
          <div key={ad._id} className="border rounded-md p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-medium">{ad.title}</h3>
              <div className="flex space-x-4">
                <button className="text-green-600 hover:text-green-800 text-2xl">
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-800 text-2xl">
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="mb-2">{ad.description}</p>
            <div className="mb-2"><strong>Category:</strong> {ad.category}</div>
            <div className="mb-2">
              <strong>Image:</strong>
              <img src={ad.image_url} alt={ad.title} className="mt-2 w-full rounded-md" />
            </div>
            <div className="mb-2"><strong>Start Date:</strong> {ad.start_date}</div>
            <div className="mb-4"><strong>End Date:</strong> {ad.end_date}</div>
            <div className="flex justify-end space-x-4">
              {reviewStatus[ad._id] === 'approved' ? (
                <div className="text-green-500">Approved</div>
              ) : (
                <>
                  <button
                    onClick={() => handleApprove(ad._id, ad.image_url)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >Approve</button>
                  <button
                    onClick={() => handleReject(ad._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdReviewComponent;
