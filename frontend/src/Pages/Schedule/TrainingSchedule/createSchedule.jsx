import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

  const [timeError, setTimeError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0]; // format: 'YYYY-MM-DD'

  useEffect(() => {
    if (!appointmentDetails) {
      toast.error('Appointment details not provided.');
      return;
    }

    console.log('📦 Loaded appointment details:', appointmentDetails);

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
    const { name, value } = e.target;

    if (name === 'time') {
      const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
      if (value === '' || timeRegex.test(value)) {
        setTimeError('');
      } else {
        setTimeError('Invalid time format. Use HH:MM AM/PM (e.g. 09:00 AM)');
      }
    }

    setNewSession((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSession = () => {
    if (!newSession.time || !newSession.training_type) {
      toast.error('Please provide time and training type.');
      return;
    }

    if (timeError) {
      toast.error('Please fix time format before adding.');
      return;
    }

    const existingDay = formData.schedule.find((d) => d.day === newSession.day);
    const session = { ...newSession, status: 'Scheduled' };
    let updatedSchedule;

    if (existingDay) {
      existingDay.sessions.push(session);
      updatedSchedule = [...formData.schedule];
    } else {
      updatedSchedule = [
        ...formData.schedule,
        {
          day: newSession.day,
          sessions: [session],
        },
      ];
    }

    setFormData((prev) => ({
      ...prev,
      schedule: updatedSchedule,
    }));

    setNewSession({ day: 'Monday', time: '', training_type: '', duration: '1hour', notes: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { appointment_id, pet_id, service_id, week_start_date, schedule } = formData;

    const today = new Date();
    const selectedDate = new Date(week_start_date);

    if (selectedDate < new Date(today.setHours(0, 0, 0, 0))) {
      toast.error('Week start date cannot be in the past.');
      return;
    }

    if (!appointment_id || !pet_id || !service_id || !week_start_date || schedule.length === 0) {
      toast.error('All fields required and at least one session must be added.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.post(`${backendUrl}/api/scheduling/trainingschedule/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('✅ Training schedule created!');
      navigate('/schedule/training');
    } catch (error) {
      console.error('❌ Schedule error:', error);
      toast.error(error.response?.data?.message || 'Failed to create schedule');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 shadow-xl rounded-xl border border-blue-200">
      <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Create Training Schedule</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Week Start */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Week Start Date</label>
          <input
            type="date"
            name="week_start_date"
            min={todayStr}
            value={formData.week_start_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Session Inputs */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Add Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select name="day" value={newSession.day} onChange={handleSessionChange} className="p-2 border rounded">
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <div className="flex flex-col">
              <input
                type="text"
                name="time"
                placeholder="Time (e.g. 09:00 AM)"
                value={newSession.time}
                onChange={handleSessionChange}
                className={`p-2 border rounded ${timeError ? 'border-red-500' : ''}`}
                pattern="^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$"
                title="Please enter time in the format HH:MM AM/PM"
              />
              {timeError && <span className="text-red-500 text-sm mt-1">{timeError}</span>}
            </div>

            <input
              type="text"
              name="training_type"
              placeholder="Training Type"
              value={newSession.training_type}
              onChange={handleSessionChange}
              className="p-2 border rounded"
            />
            <select
              name="duration"
              value={newSession.duration}
              onChange={handleSessionChange}
              className="p-2 border rounded"
            >
              <option value="30min">30 min</option>
              <option value="1hour">1 hour</option>
              <option value="2hours">2 hours</option>
              <option value="custom">Custom</option>
            </select>
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={newSession.notes}
              onChange={handleSessionChange}
              className="p-2 border rounded col-span-2"
            />
          </div>
          <button
            type="button"
            onClick={handleAddSession}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Session
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-xl shadow"
        >
          Submit Schedule
        </button>
      </form>

      {/* Preview */}
      {formData.schedule.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-3 text-blue-700">📅 Scheduled Sessions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.schedule.map((group, idx) => (
              <div key={idx} className="bg-blue-50 border rounded p-3">
                <h5 className="font-semibold text-blue-800 mb-2">{group.day}</h5>
                {group.sessions.map((s, i) => (
                  <div key={i} className="text-sm border-b py-1">
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
