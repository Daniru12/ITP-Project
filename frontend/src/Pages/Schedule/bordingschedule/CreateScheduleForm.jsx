import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateBoedingScheduleForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const appointmentId = state?.appointmentId;
  const appointmentDetails = state?.appointmentDetails;

  const [formData, setFormData] = useState({
    pet_id: '',
    service_id: '',
    appointment_id: '',
    duration: 'day',
    start_time: '',
    end_time: '', // only used if duration is "custom"
  });

  useEffect(() => {
    if (appointmentDetails) {
      setFormData((prev) => ({
        ...prev,
        pet_id: appointmentDetails.pet_id?._id,
        service_id: appointmentDetails.service_id?._id,
        appointment_id: appointmentDetails._id,
      }));
    }
  }, [appointmentDetails]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const payload = {
        ...formData,
      };

      // Remove end_time if duration is not custom
      if (formData.duration !== 'custom') {
        delete payload.end_time;
      }

      const response = await axios.post(
        `${backendUrl}/api/scheduling/bordingschedule/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Boarding schedule created!");
      navigate("/schedule/boarding");
    } catch (error) {
      console.error("Scheduling error:", error);
      toast.error(error.response?.data?.error || "Failed to create schedule");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-4">Create Boarding Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Duration</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="day">Day (8h)</option>
            <option value="overnight">Overnight (12h)</option>
            <option value="weekday">Weekday (5 days)</option>
            <option value="weekend">Weekend (2 days)</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {formData.duration === 'custom' && (
          <div>
            <label className="block font-medium mb-1">End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Submit Schedule
        </button>
      </form>
    </div>
  );
};

export default CreateBoedingScheduleForm;
