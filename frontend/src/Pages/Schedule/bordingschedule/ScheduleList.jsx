import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaTrash, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { format, eachDayOfInterval } from 'date-fns';

const BoardingScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmedDays, setConfirmedDays] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.get(`${backendUrl}/api/scheduling/bordingschedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSchedules(res.data || []);

      const dayMap = {};
      (res.data || []).forEach(s => {
        dayMap[s._id] = s.confirmed_days || [];
      });
      setConfirmedDays(dayMap);

      setLoading(false);
    } catch (error) {
      console.error("Failed to load schedules", error);
      toast.error("Could not load schedules");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.delete(`${backendUrl}/api/scheduling/bordingschedule/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Schedule deleted");
      setSchedules((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      toast.error("Failed to delete schedule");
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.put(`${backendUrl}/api/scheduling/bordingschedule/${id}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Schedule marked as completed");
      fetchSchedules();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleDayConfirm = async (scheduleId, dateStr) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.patch(
        `${backendUrl}/api/scheduling/bordingschedule/toggle/${scheduleId}`,
        { date: dateStr },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConfirmedDays(prev => ({
        ...prev,
        [scheduleId]: res.data.confirmed_days,
      }));
    } catch (error) {
      toast.error("Failed to update day");
    }
  };

  const handleEdit = (scheduleId) => {
    navigate(`/scheduling/boarding/${scheduleId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-500 text-lg">Loading boarding schedules...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Boarding Schedules</h2>

      {schedules.length === 0 ? (
        <p className="text-center text-gray-500">No schedules found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => {
            const pet = schedule.pet_id || {};
            const owner = pet.owner_id || {};

            const daysBetween = eachDayOfInterval({
              start: new Date(schedule.start_time),
              end: new Date(schedule.end_time),
            });

            return (
              <div
                key={schedule._id}
                className="bg-white border rounded-xl shadow p-4 space-y-2 hover:shadow-md transition relative"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{pet.name || 'Unknown Pet'}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">Owner: {owner.full_name || 'N/A'}</p>
                <p className="text-sm text-gray-600">Contact: {owner.phone_number || 'N/A'}</p>

                <div className="text-sm text-gray-700 mt-2">
                  <p><FaClock className="inline mr-1 text-blue-500" /> Start: {new Date(schedule.start_time).toLocaleString()}</p>
                  <p><FaClock className="inline mr-1 text-green-600" /> End: {new Date(schedule.end_time).toLocaleString()}</p>
                </div>

                <p className="text-sm text-gray-600">Duration: <strong>{schedule.duration}</strong></p>

                <div className="mt-3">
                  <p className="text-sm font-semibold mb-1">Days Confirmation:</p>
                  <div className="flex flex-wrap gap-2">
                    {daysBetween.map((date) => {
                      const formatted = format(date, 'yyyy-MM-dd');
                      const confirmed = confirmedDays[schedule._id]?.includes(formatted);
                      return (
                        <button
                          key={formatted}
                          onClick={() => toggleDayConfirm(schedule._id, formatted)}
                          className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${confirmed ? 'bg-green-200 border-green-400' : 'bg-gray-100 border-gray-300'}`}
                        >
                          <FaCheckCircle className={`text-xs ${confirmed ? 'text-green-600' : 'text-gray-500'}`} />
                          {formatted}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                <button
                    onClick={() => handleMarkComplete(schedule._id)}
                    disabled={updatingId === schedule._id || schedule.status === 'Completed'}
                    className="text-green-600 hover:text-green-800"
                    title="Mark as Completed"
                  >
                    <FaCheckCircle />
                  </button>
                  <button
                    onClick={() => handleEdit(schedule._id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Schedule"
                  >
                    <FaEdit />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(schedule._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Schedule"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BoardingScheduleList;