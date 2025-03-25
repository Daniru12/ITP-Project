import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MyTrainingSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [formData, setFormData] = useState({
    time: '',
    training_type: '',
    duration: '',
    status: '',
    notes: '',
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!token) return;

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = decodedToken.userId || decodedToken.id;
        setUserId(currentUserId);

        const res = await axios.get(`${backendUrl}/api/scheduling/trainingschedule`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const all = res.data.data;

        const mySchedules = all.filter(schedule =>
          schedule.appointment_id?.provider_id === currentUserId
        );

        setSchedules(mySchedules);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        toast.error('Failed to load your training schedules');
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleDelete = async (scheduleId, day, sessionIndex) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const confirm = window.confirm("Are you sure to delete this session?");
      if (!confirm) return;

      await axios.delete(`${backendUrl}/api/scheduling/trainingschedule/delete/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { day, sessionIndex },
      });

      setSchedules(prev =>
        prev.map(s => {
          if (s._id === scheduleId) {
            const updatedSchedule = s.schedule.map(d => {
              if (d.day === day) {
                const newSessions = [...d.sessions];
                newSessions.splice(sessionIndex, 1);
                return { ...d, sessions: newSessions };
              }
              return d;
            });
            return { ...s, schedule: updatedSchedule };
          }
          return s;
        })
      );

      toast.success('Session deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete session');
    }
  };

  const handleEditClick = (scheduleId, day, session, sessionIndex) => {
    setEditingSession({ scheduleId, day, sessionIndex });
    setFormData(session);
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const { scheduleId, day, sessionIndex } = editingSession;

      await axios.put(`${backendUrl}/api/scheduling/trainingschedule/update/${scheduleId}`, {
        day,
        sessionIndex,
        sessionData: formData,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSchedules(prev =>
        prev.map(s => {
          if (s._id === scheduleId) {
            const updated = s.schedule.map(d => {
              if (d.day === day) {
                const newSessions = [...d.sessions];
                newSessions[sessionIndex] = { ...formData };
                return { ...d, sessions: newSessions };
              }
              return d;
            });
            return { ...s, schedule: updated };
          }
          return s;
        })
      );

      toast.success('Session updated');
      setIsEditOpen(false);
      setEditingSession(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update session');
    }
  };

  const getSessionsByDay = () => {
    const dayMap = {};
    daysOfWeek.forEach(day => dayMap[day] = []);
    schedules.forEach(s => {
      s.schedule.forEach(dayObj => {
        if (dayMap[dayObj.day]) {
          dayMap[dayObj.day].push(...dayObj.sessions.map((session, i) => ({
            ...session,
            scheduleId: s._id,
            day: dayObj.day,
            sessionIndex: i,
            pet: s.pet_id?.name,
          })));
        }
      });
    });
    return dayMap;
  };

  const sessionsByDay = getSessionsByDay();

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">📅 My Training Calendar</h2>

      {loading ? (
        <div className="text-center py-20 text-blue-600">Loading your schedule...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysOfWeek.map(day => (
            <div key={day} className="border rounded-lg p-4 bg-blue-50 shadow-sm">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{day}</h3>
              {sessionsByDay[day].length > 0 ? (
                sessionsByDay[day].map((session, idx) => (
                  <div key={idx} className="relative bg-white p-3 mb-3 rounded shadow">
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEditClick(session.scheduleId, session.day, session, session.sessionIndex)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(session.scheduleId, session.day, session.sessionIndex)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <p><strong>Time:</strong> {session.time}</p>
                    <p><strong>Type:</strong> {session.training_type}</p>
                    <p><strong>Duration:</strong> {session.duration}</p>
                    <p><strong>Status:</strong> {session.status}</p>
                    {session.notes && <p><strong>Notes:</strong> {session.notes}</p>}
                    <p className="text-sm text-gray-500 mt-1">Pet: {session.pet}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No sessions</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal with Background Blur and Labels */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="fixed z-50 inset-0">
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4" aria-hidden="true" />

        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded shadow p-6 w-full max-w-md z-50 relative space-y-4">
            <Dialog.Title className="text-xl font-semibold text-blue-700">Edit Training Session</Dialog.Title>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 10:00 AM"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Training Type</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Obedience"
                  value={formData.training_type}
                  onChange={e => setFormData({ ...formData, training_type: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 30 minutes"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyTrainingSchedules;
