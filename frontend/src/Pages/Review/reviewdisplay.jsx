import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/reviews/service`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err.response?.data || err.message);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [backendUrl, token]);

  if (loading) {
    return <p className="text-center text-xl mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  // Function to generate stars based on rating
  const renderStars = (rating) => {
    return "⭐".repeat(rating); // Creates stars equal to the rating value
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">All Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews available.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li
              key={review._id}
              className="border-b py-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{review.review}</p>
                <p className="text-gray-600">
                  Rating: <strong>{review.rating}</strong> {renderStars(review.rating)}
                </p>
                <p className="text-sm text-gray-500">
                  By <strong>{review.user?.name || "Unknown User"}</strong> | Service:{" "}
                  <strong>{review.service?.name || "Unknown Service"}</strong>
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
              <Link
                to={`/review/${review._id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllReviews;
