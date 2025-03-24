import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GroomingScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/scheduling/groomingschedule`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load schedules");
      console.error("Schedule fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this schedule?");
    if (!confirm) return;

    try {
      setDeletingId(id);
      await axios.delete(`${backendUrl}/api/scheduling/groomingschedule/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Schedule deleted successfully");
      setSchedules(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      toast.error("Failed to delete schedule");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-groomingschedule/${id}`);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="text-center py-10 text-blue-600 font-semibold text-lg">
        Loading grooming schedules...
      </div>
    );
  }

  if (!schedules.length) {
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        No grooming schedules found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Grooming Schedules</h2>
      <div className="grid grid-cols-1 gap-6">
        {schedules.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-xl p-6 border border-blue-100 hover:shadow-lg transition duration-200 relative flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {item?.service_id?.service_name || 'Grooming Service'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                <p><strong>Pet:</strong> {item?.pet_id?.name} ({item?.pet_id?.species})</p>
                <p><strong>Breed:</strong> {item?.pet_id?.breed}</p>
                <p>
                  <strong>Appointment Date:</strong>{" "}
                  {item?.appointment_id?.appointment_date
                    ? formatDate(item.appointment_id.appointment_date)
                    : "N/A"}
                </p>
                <p><strong>Status:</strong> {item?.appointment_id?.status || "N/A"}</p>
                <p><strong>Start Time:</strong> {formatTime(item?.start_time)}</p>
                <p><strong>Period:</strong> {item?.Period}</p>
                {item.end_time && (
                  <p><strong>End Time:</strong> {formatTime(item?.end_time)}</p>
                )}
                {item.special_requests && item.special_requests.trim() !== "" && (
                  <p><strong>Special Requests:</strong> {item.special_requests}</p>
                )}
                {item.notes && item.notes.trim() !== "" && (
                  <p><strong>Notes:</strong> {item.notes}</p>
                )}
              </div>
            </div>

            {/* Bottom Right Buttons */}
            <div className="flex justify-end gap-3 mt-auto pt-4">
              <button
                onClick={() => handleUpdate(item._id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-md text-sm shadow-sm transition"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={deletingId === item._id}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm shadow-sm transition disabled:opacity-50"
              >
                {deletingId === item._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroomingScheduleList;
