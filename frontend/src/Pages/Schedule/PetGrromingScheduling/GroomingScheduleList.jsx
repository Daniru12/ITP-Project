import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TrainingScheduleView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const appointmentId = state?.appointmentId;
        if (!appointmentId) {
          toast.error('Missing appointment ID');
          return;
        }

        const res = await axios.get(`${backendUrl}/api/scheduling/trainingschedule/byAppointment/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setScheduleData(res.data.schedule);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch training schedule:', error);
        toast.error('Failed to load schedule');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [state]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await axios.delete(`${backendUrl}/api/scheduling/trainingschedule/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Schedule deleted successfully');
      setScheduleData(null);
      navigate('/schedule/training');
    } catch (error) {
      toast.error('Failed to delete schedule');
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-20 text-blue-600">Loading schedule...</div>;
  if (!scheduleData) return <div className="text-center text-gray-500">No training schedule found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Training Schedule</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => {
          const dayData = scheduleData.schedule.find((d) => d.day === day);
          return (
            <div
              key={day}
              className="bg-white shadow-md rounded-xl p-6 border border-blue-100 hover:shadow-lg transition duration-200"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{day}</h3>
              {dayData && dayData.sessions.length > 0 ? (
                dayData.sessions.map((session, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-3 mb-3 shadow-sm">
                    <p><strong>Time:</strong> {session.time}</p>
                    <p><strong>Type:</strong> {session.training_type}</p>
                    <p><strong>Duration:</strong> {session.duration}</p>
                    <p><strong>Status:</strong> {session.status}</p>
                    {session.notes && <p><strong>Notes:</strong> {session.notes}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No sessions</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => handleDelete(scheduleData._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm shadow-sm"
        >
          Delete Full Schedule
        </button>
      </div>
    </div>
  );
};

export default TrainingScheduleView;
