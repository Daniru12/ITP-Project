import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const CreateFaq = () => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    service: "",
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const { id } = useParams(); // Optional service ID

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error("You're not logged in.");
        window.location.href = "/login";
        return;
      }

      try {
        let servicesArray = [];

        // If service id is provided, fetch only that
        if (id) {
          const serviceRes = await axios.get(`${backendUrl}/api/users/service/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const singleService = serviceRes.data?.service;
          if (singleService) {
            servicesArray = [singleService];
            setFormData((prev) => ({ ...prev, service: singleService._id }));
          }
        } else {
          const serviceRes = await axios.get(`${backendUrl}/api/users/services`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          servicesArray = Array.isArray(serviceRes.data)
            ? serviceRes.data
            : serviceRes.data.services || [];
        }

        setServices(servicesArray);
        console.log("Services loaded:", servicesArray);
      } catch (err) {
        console.error("Error loading services:", err.response?.data || err.message);
        toast.error("Failed to load services");
        setServices([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [backendUrl, token, id]);

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
      await axios.post(`${backendUrl}/api/faqs/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("FAQ created successfully!");
      setFormData({ question: "", answer: "", service: "" });
    } catch (err) {
      console.error("FAQ create error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to create FAQ");
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
      <h2 className="text-2xl font-bold mb-6 text-center">Create FAQ</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Question</label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Answer</label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          ></textarea>
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
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            submitLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting..." : "Create FAQ"}
        </button>
      </form>
    </div>
  );
};

export default CreateFaq;
