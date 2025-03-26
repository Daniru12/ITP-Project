import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/reviews/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err.response?.data || err.message);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.user_type);
        setUserId(res.data._id);
      } catch (err) {
        console.error("Error fetching user details:", err.response?.data || err.message);
      }
    };

    if (token) {
      fetchReviews();
      fetchUserDetails();
    } else {
      toast.error("You're not logged in.");
      window.location.href = "/login";
    }
  }, [token]);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${backendUrl}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((review) => review._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (err) {
      console.error("Error deleting review:", err.response?.data || err.message);
      toast.error("Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading Reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Reviews</h1>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="mb-6 border-b pb-4">
              <h3 className="font-semibold text-lg">{review.user.full_name}</h3>
              <p className="text-gray-700">{review.review}</p>
              <p className="text-yellow-500">Rating: {review.rating} ⭐</p>

              {/* Show update and delete buttons only for user's own reviews */}
              {review.user._id === userId && (
                <div className="mt-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Show delete button for Admins and Service Providers */}
              {userRole === "admin" || userRole === "service_provider" ? (
                review.user._id !== userId && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
