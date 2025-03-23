import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const CreateReview = () => {
  const [formData, setFormData] = useState({
    rating: 1,
    review: "",
    service: "", // Service ID
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      toast.error("You're not logged in.");
      window.location.href = "/login";
      return;
    }

    // Fetch services
    const fetchData = async () => {
      try {
        const serviceRes = await axios.get(`${backendUrl}/api/users/services`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const servicesArray = Array.isArray(serviceRes.data)
          ? serviceRes.data
          : serviceRes.data.services || [];
        setServices(servicesArray);
      } catch (err) {
        console.error("Error loading services:", err.response?.data || err.message);
        toast.error("Failed to load services");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl, token]);

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

    try {
      await axios.post(`${backendUrl}/api/reviews/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Review submitted successfully!");
      setFormData({ rating: 1, review: "", service: "" });
    } catch (err) {
      console.error("Review submission error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">Create Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Review</label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
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

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Select Service</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">-- Select a service --</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.service_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${submitLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
