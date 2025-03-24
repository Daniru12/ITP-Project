import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateGroomingScheduleForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const appointmentDetails = state?.appointmentDetails;

  const [formData, setFormData] = useState({
    pet_id: '',
    service_id: '',
    appointment_id: '',
    Period: '30min',
    start_time: '',
    special_requests: '',
    notes: '',
  });

  useEffect(() => {
    // Safety check: If no data passed, redirect
    if (!appointmentDetails) {
      toast.error("Appointment details not provided.");
      
      return;
    }

    console.log("Loaded appointment details:", appointmentDetails);

    // Populate IDs
    setFormData((prev) => ({
      ...prev,
      pet_id: appointmentDetails.pet_id?._id || '',
      service_id: appointmentDetails.service_id?._id || '',
      appointment_id: appointmentDetails._id || '',
    }));
  }, []); // ✅ no dependency warning

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { pet_id, service_id, appointment_id, start_time } = formData;

    if (!pet_id || !service_id || !appointment_id || !start_time) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/api/scheduling/groomingschedule/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Grooming schedule created!");
      navigate("/schedule/grooming");
    } catch (error) {
      console.error("Scheduling error:", error);
      toast.error(error.response?.data?.error || "Failed to create schedule");
    }
  };

  const isSubmitDisabled =
    !formData.pet_id || !formData.service_id || !formData.appointment_id || !formData.start_time;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 shadow-2xl rounded-2xl border border-blue-100">
      <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Create Grooming Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Period */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Period</label>
          <select
            name="Period"
            value={formData.Period}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="30min">30 Minutes</option>
            <option value="1hour">1 Hour</option>
            <option value="2hours">2 Hours</option>
            <option value="custom">Custom (use end_time field)</option>
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Special Requests</label>
          <textarea
            name="special_requests"
            placeholder="e.g. Use organic shampoo"
            value={formData.special_requests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
          <textarea
            name="notes"
            placeholder="Any other notes..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full ${
            isSubmitDisabled ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white text-lg font-semibold py-3 rounded-xl transition duration-200 shadow-md`}
        >
          Submit Schedule
        </button>
      </form>
    </div>
  );
};

export default CreateGroomingScheduleForm;
