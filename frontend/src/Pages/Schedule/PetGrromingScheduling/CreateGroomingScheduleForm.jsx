import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CreateTrainingScheduleForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const appointmentDetails = state?.appointmentDetails;

  const [formData, setFormData] = useState({
    appointment_id: '',
    pet_id: '',
    service_id: '',
    week_start_date: '',
    schedule: [],
  });

  const [newSession, setNewSession] = useState({
    day: 'Monday',
    time: '',
    training_type: '',
    duration: '1hour',
    notes: '',
  });

  useEffect(() => {
    console.log("🔥 STATE:", state);
    console.log("🐾 appointmentDetails:", appointmentDetails);
    if (!appointmentDetails) {
      toast.error('Appointment details not provided.');
      return;
    }

    console.log('🐾 Loaded appointment details:', appointmentDetails);

    setFormData((prev) => ({
      ...prev,
      appointment_id: appointmentDetails._id || '',
      pet_id: appointmentDetails.pet_id?._id || '',
      service_id: appointmentDetails.service_id?._id || '',
    }));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSessionChange = (e) => {
    setNewSession((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddSession = () => {
    if (!newSession.time || !newSession.training_type) {
      toast.error('Please provide time and training type.');
      return;
    }

    const existingDay = formData.schedule.find((d) => d.day === newSession.day);
    const sessionData = {
      ...newSession,
      status: 'Scheduled',
    };

    let updatedSchedule;

    if (existingDay) {
      existingDay.sessions.push(sessionData);
      updatedSchedule = [...formData.schedule];
    } else {
      updatedSchedule = [
        ...formData.schedule,
        {
          day: newSession.day,
          sessions: [sessionData],
        },
      ];
    }

    setFormData((prev) => ({
      ...prev,
      schedule: updatedSchedule,
    }));

    setNewSession({
      day: 'Monday',
      time: '',
      training_type: '',
      duration: '1hour',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { appointment_id, pet_id, service_id, week_start_date, schedule } = formData;

    if (!appointment_id || !pet_id || !service_id || !week_start_date || schedule.length === 0) {
      toast.error('All required fields must be filled and at least one session added.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/api/scheduling/trainingschedule/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Training schedule created!');
      navigate('/schedule/training');
    } catch (error) {
      console.error('❌ Scheduling error:', error);
      toast.error(error.response?.data?.message || 'Failed to create schedule');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 shadow-2xl rounded-2xl border border-green-100">
      <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">Create Training Schedule</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Week Start Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Week Start Date</label>
          <input
            type="date"
            name="week_start_date"
            value={formData.week_start_date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Session Fields */}
        <div className="p-4 bg-gray-100 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Add Training Session</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="day"
              value={newSession.day}
              onChange={handleSessionChange}
              className="border px-3 py-2 rounded"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="time"
              placeholder="Time (e.g., 07:30 PM)"
              value={newSession.time}
              onChange={handleSessionChange}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="training_type"
              placeholder="Training Type"
              value={newSession.training_type}
              onChange={handleSessionChange}
              className="border px-3 py-2 rounded"
            />
            <select
              name="duration"
              value={newSession.duration}
              onChange={handleSessionChange}
              className="border px-3 py-2 rounded"
            >
              <option value="30min">30 Minutes</option>
              <option value="1hour">1 Hour</option>
              <option value="2hours">2 Hours</option>
              <option value="custom">Custom</option>
            </select>
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={newSession.notes}
              onChange={handleSessionChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          <button
            type="button"
            onClick={handleAddSession}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
          >
            Add Session
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 rounded-xl shadow-md"
        >
          Submit Schedule
        </button>
      </form>

      {/* Schedule Preview */}
      {formData.schedule.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-3 text-green-600">Scheduled Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.schedule.map((dayGroup, index) => (
              <div key={index} className="bg-gray-50 p-4 border rounded-lg shadow-sm">
                <h4 className="font-semibold text-green-700 mb-2">{dayGroup.day}</h4>
                {dayGroup.sessions.map((s, i) => (
                  <div key={i} className="text-sm mb-2 border-b pb-2">
                    <p><strong>Time:</strong> {s.time}</p>
                    <p><strong>Type:</strong> {s.training_type}</p>
                    <p><strong>Duration:</strong> {s.duration}</p>
                    {s.notes && <p><strong>Notes:</strong> {s.notes}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTrainingScheduleForm;
