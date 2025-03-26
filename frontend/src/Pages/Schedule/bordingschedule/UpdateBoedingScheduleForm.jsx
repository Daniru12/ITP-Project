import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const UpdateBoedingScheduleForm = () => {
  const { id } = useParams(); // schedule ID
  const { state } = useLocation(); // optional: appointmentDetails passed via state
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pet_id: '',
    service_id: '',
    appointment_id: '',
    duration: 'day',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const res = await axios.get(`${backendUrl}/api/scheduling/bordingschedule/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data || res.data;

        console.log("Fetched schedule data:", data); // Debugging

        setFormData({
          pet_id: data.pet_id?._id || '',
          service_id: data.service_id?._id || '',
          appointment_id: data.appointment_id?._id || '', // Might be null
          duration: data.duration || 'day',
          start_time: data.start_time?.slice(0, 16) || '',
          end_time: data.end_time?.slice(0, 16) || '',
        });
      } catch (err) {
        console.error('Failed to load schedule:', err);
        toast.error('Failed to load schedule');
      }
    };

    fetchSchedule();
  }, [id]);

  const isFutureDateTime = (datetimeStr) => {
    const selected = new Date(datetimeStr);
    const now = new Date();
    return selected > now;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'start_time' || name === 'end_time') && value) {
      if (!isFutureDateTime(value)) {
        toast.error('You cannot select a past date/time');
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log("Form Data before submitting:", formData); // Debugging

    // Backend requires appointment_id — stop if it's null or empty
    if (!formData.appointment_id) {
      toast.error('This schedule is missing a linked appointment. Cannot update.');
      return;
    }

    if (!formData.pet_id || !formData.service_id) {
      toast.error('Missing required pet or service ID');
      return;
    }

    if (!isFutureDateTime(formData.start_time)) {
      toast.error('Start time must be in the future');
      return;
    }

    if (formData.duration === 'custom' && !isFutureDateTime(formData.end_time)) {
      toast.error('End time must be in the future');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
      };

      if (formData.duration === 'custom') {
        payload.end_time = new Date(formData.end_time).toISOString();
      } else {
        delete payload.end_time;
      }

      console.log("Payload being submitted:", payload);

      await axios.put(`${backendUrl}/api/scheduling/bordingschedule/update/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Schedule updated!');
      navigate('/schedule/boarding');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update schedule');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Update Boarding Schedule</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-medium mb-1 text-blue-800">Duration</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border rounded p-2 border-blue-300 focus:ring-2 focus:ring-blue-400"
          >
            <option value="day">Day (8h)</option>
            <option value="overnight">Overnight (12h)</option>
            <option value="weekday">Weekday (5 days)</option>
            <option value="weekend">Weekend (2 days)</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-blue-800">Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)}
            className="w-full border rounded p-2 border-blue-300 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {formData.duration === 'custom' && (
          <div>
            <label className="block font-medium mb-1 text-blue-800">End Time</label>
            <input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              min={formData.start_time || new Date().toISOString().slice(0, 16)}
              className="w-full border rounded p-2 border-blue-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Update Schedule
        </button>
      </form>
    </div>
  );
};

export default UpdateBoedingScheduleForm;
