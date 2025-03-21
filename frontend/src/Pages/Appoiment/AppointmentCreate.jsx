import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const AppointmentCreate = () => {
  const [formData, setFormData] = useState({
    pet_id: '',
    service_id: '',
    appointment_date: '',
    package_type: 'basic',
    special_notes: '',
    usePoints: false,
  });

  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');
  const { id } = useParams(); // service_id from URL (optional)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error("You're not logged in.");
        window.location.href = "/login";
        return;
      }

      try {
        // Fetch pets
        const petRes = await axios.get(`${backendUrl}/api/users/pets`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const petsArray = Array.isArray(petRes.data)
          ? petRes.data
          : petRes.data.pets || [];

        setPets(petsArray);
        console.log("Pets loaded:", petsArray);
      } catch (err) {
        console.error("Error loading pets:", err.response?.data || err.message);
        toast.error("Failed to load pets");
        setPets([]);
      }

      try {
        let servicesArray = [];

        // If a specific service ID is passed, fetch that single service
        if (id) {
          const serviceRes = await axios.get(`${backendUrl}/api/users/service/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const singleService = serviceRes.data?.service;
          if (singleService) {
            servicesArray = [singleService]; // wrap in array
            setFormData((prev) => ({ ...prev, service_id: singleService._id })); // pre-fill
          }
        } else {
          // Otherwise, fetch all available services
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

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await axios.post(`${backendUrl}/api/appointments/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Appointment booked successfully!');
      setFormData({
        pet_id: '',
        service_id: '',
        appointment_date: '',
        package_type: 'basic',
        special_notes: '',
        usePoints: false,
      });
    } catch (err) {
      console.error('Booking error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to book appointment');
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
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          🐾 Book a New Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pet Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Pet</label>
            <select
              name="pet_id"
              value={formData.pet_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a pet --</option>
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name}
                  </option>
                ))
              ) : (
                <option disabled>No pets available</option>
              )}
            </select>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a service --</option>
              {services.length > 0 ? (
                services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.service_name}
                  </option>
                ))
              ) : (
                <option disabled>No services available</option>
              )}
            </select>
          </div>

          {/* Appointment Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date & Time
            </label>
            <input
              type="datetime-local"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Package Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
            <select
              name="package_type"
              value={formData.package_type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
            <textarea
              name="special_notes"
              value={formData.special_notes}
              onChange={handleChange}
              placeholder="Add any special requests or notes..."
              className="w-full border border-gray-300 rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Use Loyalty Points */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="usePoints"
              checked={formData.usePoints}
              onChange={handleChange}
              className="accent-blue-600 w-5 h-5"
            />
            <label className="text-sm text-gray-700">Use Loyalty Points</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {submitLoading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentCreate;
