import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TrainingScheduleView = () => {
  const { state } = useLocation();
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  if (loading) return <div className="text-center py-20 text-blue-600">Loading schedule...</div>;
  if (!scheduleData) return <div className="text-center text-red-600">No schedule found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Training Schedule Calendar View</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => {
          const dayData = scheduleData.schedule.find((d) => d.day === day);
          return (
            <div key={day} className="border rounded-md shadow p-4 bg-blue-50">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{day}</h3>
              {dayData && dayData.sessions.length > 0 ? (
                dayData.sessions.map((session, idx) => (
                  <div key={idx} className="mb-3 bg-white p-3 rounded shadow-sm">
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
    </div>
  );
};

export default TrainingScheduleView;
