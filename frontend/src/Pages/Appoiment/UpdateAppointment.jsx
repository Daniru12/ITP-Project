import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HamsterLoader from '../../components/HamsterLoader';
const UpdateAppointment = () => {
  const { id } = useParams(); // appointment ID
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointment_date: "",
    package_type: "",
    special_notes: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/appointments/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setAppointment(data);
        setFormData({
          appointment_date: data.appointment_date?.slice(0, 16), // for datetime-local
          package_type: data.package_type || "",
          special_notes: data.special_notes || "",
        });
      } catch (err) {
        toast.error("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [backendUrl, token, id]);

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

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

    const selectedDate = new Date(formData.appointment_date);
    const now = new Date();
    if (selectedDate < now) {
      toast.error("You can't select a past date/time.");
      setSubmitLoading(false);
      return;
    }

    try {
      await axios.put(`${backendUrl}/api/appointments/user/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Appointment updated successfully!");
      setTimeout(() => {
        navigate("/Appointment");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <HamsterLoader />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          ✏️ Update Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-Only Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg border border-gray-300">
              {appointment?.service_id?.service_name || "Unknown service"}
            </div>
          </div>

          {/* Appointment Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date & Time
            </label>
            <input
              type="datetime-local"
              name="appointment_date"
              min={getMinDateTime()}
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
              <option value="">-- Select Package --</option>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {submitLoading ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAppointment;
