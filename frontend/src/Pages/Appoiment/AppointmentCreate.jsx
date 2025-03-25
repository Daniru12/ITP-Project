import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

import HamsterLoader from '../../components/HamsterLoader';

const AppointmentCreate = () => {
  const [formData, setFormData] = useState({
    pet_id: "",
    service_id: "",
    appointment_date: "",
    package_type: "basic",
    special_notes: "",
    usePoints: false,
  });

  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error("You're not logged in.");
        window.location.href = "/login";
        return;
      }

      try {
        const petRes = await axios.get(`${backendUrl}/api/users/pets`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const petsArray = Array.isArray(petRes.data)
          ? petRes.data
          : petRes.data.pets || [];

        setPets(petsArray);
      } catch (err) {
        console.error("Error loading pets:", err.response?.data || err.message);
        toast.error("Failed to load pets");
        setPets([]);
      }

      try {
        let servicesArray = [];

        if (id) {
          const serviceRes = await axios.get(`${backendUrl}/api/users/service/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const singleService = serviceRes.data?.service;
          if (singleService) {
            servicesArray = [singleService];
            setFormData((prev) => ({ ...prev, service_id: singleService._id }));
          }
        }

        setServices(servicesArray);
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const selectedDate = new Date(formData.appointment_date);
    const now = new Date();

    if (selectedDate < now) {
      toast.error("You can't select a past date/time.");
      setSubmitLoading(false);
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/appointments/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Appointment booked successfully!");
      setFormData({
        pet_id: "",
        service_id: "",
        appointment_date: "",
        package_type: "basic",
        special_notes: "",
        usePoints: false,
      });

      setTimeout(() => {
        navigate("/Appointment");
      }, 1000);
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  if (loading) {
    return (
      <HamsterLoader />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 font-sans">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Paws & Relax"
            className="w-16 h-16 mx-auto rounded-full mb-2"
          />
          <h1 className="text-2xl font-bold text-blue-700">{services[0]?.service_name || "Unknown service"}</h1>
          <p className="text-gray-500">Book your pet’care services</p>
        </div>
        <div>
            <h3 className="text-blue-600 font-semibold mb-2">🐾 Pet Profile</h3>
            <div className="flex gap-4 flex-wrap">
              {pets.map((pet) => (
                <div
                  key={pet._id}
                  className="flex items-center gap-3 border border-blue-200 px-4 py-2 rounded-xl bg-blue-50"
                >
                  <img
                    src={pet.photo || "/default-pet.png"}
                    alt={pet.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700">{pet.name}</p>
                    <p className="text-gray-500 text-xs">{pet.breed}, {pet.age} years</p>
                  </div>
                </div>
              ))}
              <br></br>
            </div>
            
          </div>
          <br></br><br></br>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Pet Profile */}
         

          {/* Service Name */}
          <div>
            <h3 className="text-blue-600 font-semibold mb-2"> Selected Service</h3>
            <div className="bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200">
              {services[0]?.service_name || "Unknown service"}
            </div>
          </div>

          {/* Package Options */}
          <div>
            <h3 className="text-blue-600 font-semibold mb-2"> Package Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["basic", "premium", "luxury"].map((type) => (
                <div
                  key={type}
                  onClick={() => setFormData({ ...formData, package_type: type })}
                  className={`cursor-pointer border rounded-xl p-4 text-sm ${
                    formData.package_type === type
                      ? "bg-blue-100 border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <h4 className="font-semibold capitalize text-blue-700">{type} Care</h4>
                  <p className="text-gray-500 mt-1">
                    {type === "basic" && "Simple care for your pet"}
                    {type === "premium" && "Advanced grooming & care"}
                    {type === "luxury" && "Top-tier grooming + extras"}
                  </p>
                </div>
              ))}
            </div>
          </div>

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


          {/* Appointment Date & Time */}
          <div>
            <h3 className="text-blue-600 font-semibold mb-2"> Book Appointment</h3>
            <input
              type="datetime-local"
              name="appointment_date"
              min={getMinDateTime()}
              value={formData.appointment_date}
              onChange={handleChange}
              required
              className="w-full border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Special Notes */}
          <div>
            <h3 className="text-blue-600 font-semibold mb-2">📝 Special Notes</h3>
            <textarea
              name="special_notes"
              value={formData.special_notes}
              onChange={handleChange}
              placeholder="Add any special instructions, allergies, or preferences here..."
              className="w-full border border-blue-300 rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Use Loyalty Points */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="usePoints"
              checked={formData.usePoints}
              onChange={handleChange}
              className="accent-blue-600 w-5 h-5"
            />
            <span className="text-sm text-gray-700">Use Loyalty Points</span>
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {submitLoading ? "Booking..." : "Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentCreate;
