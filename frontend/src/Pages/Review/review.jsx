import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

const CreateReview = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    rating: 1,
    review: "",
    service: "",
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("You're not logged in.");
      navigate("/login");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      service: serviceId || "",
    }));
  }, [serviceId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    console.log("Submitting review with data:", formData);

    try {
      const response = await axios.post(
        `${backendUrl}/api/reviews/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review submitted successfully!");
      setFormData({ rating: 1, review: "", service: serviceId });

      setTimeout(() => {
        navigate("/reviewdisplay");
      }, 2000);
    } catch (err) {
      console.error("Review submission error:", err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">Write a Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Your Review</label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Describe your experience..."
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Rating (1-5)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            submitLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
