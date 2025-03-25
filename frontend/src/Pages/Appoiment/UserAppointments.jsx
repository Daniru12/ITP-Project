import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaCalendarCheck } from "react-icons/fa";

import HamsterLoader from '../../components/HamsterLoader';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [boardingSchedules, setBoardingSchedules] = useState([]);
  const [groomingSchedules, setGroomingSchedules] = useState([]);
  const [trainingSchedules, setTrainingSchedules] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) {
        toast.error("You're not logged in.");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await axios.get(`${backendUrl}/api/appointments/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res.data) ? res.data : res.data.appointments || [];
        setAppointments(data);
      } catch (err) {
        toast.error("Failed to load appointments");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchSchedules = async () => {
      try {
        const [boardingRes, groomingRes, trainingRes] = await Promise.all([
          axios.get(`${backendUrl}/api/scheduling/bordingschedule`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/scheduling/groomingschedule`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/scheduling/trainingschedule`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBoardingSchedules(Array.isArray(boardingRes.data) ? boardingRes.data : []);
        setGroomingSchedules(Array.isArray(groomingRes.data) ? groomingRes.data : []);
        setTrainingSchedules(Array.isArray(trainingRes.data.data) ? trainingRes.data.data : []);
      } catch (err) {
        toast.error("Failed to load schedules");
        setBoardingSchedules([]);
        setGroomingSchedules([]);
        setTrainingSchedules([]);
      }
    };

    fetchAppointments();
    fetchSchedules();
  }, [backendUrl, token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await axios.delete(`${backendUrl}/api/appointments/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Appointment deleted successfully");
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete appointment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/appointments/update/${id}`);
  };

  const handleScheduleDetails = (appointmentId) => {
    const boardingMatch = boardingSchedules.find((s) => s.appointment_id?._id === appointmentId);
    const groomingMatch = groomingSchedules.find((s) => s.appointment_id?._id === appointmentId);
    const trainingMatch = trainingSchedules.find((s) => s.appointment_id?._id === appointmentId);

    if (boardingMatch) setSelectedSchedule({ ...boardingMatch, type: "Boarding" });
    else if (groomingMatch) setSelectedSchedule({ ...groomingMatch, type: "Grooming" });
    else if (trainingMatch) setSelectedSchedule({ ...trainingMatch, type: "Training" });
    else toast("No schedule found for this appointment");
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800 border border-green-300";
      case "cancelled": return "bg-red-100 text-red-800 border border-red-300";
      case "completed": return "bg-gray-200 text-gray-600 border border-gray-300";
      case "pending":
      default: return "bg-white text-gray-700 border border-gray-300";
    }
  };

  if (loading) {
    return (
      <HamsterLoader />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">🐾 My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">You haven't booked any appointments yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => {
            const hasBoardingSchedule = boardingSchedules.find((s) => s.appointment_id?._id === appt._id);
            const hasGroomingSchedule = groomingSchedules.find((s) => s.appointment_id?._id === appt._id);
            const hasTrainingSchedule = trainingSchedules.find((s) => s.appointment_id?._id === appt._id);

            return (
              <div key={appt._id} className="p-6 bg-white shadow-lg hover:shadow-xl rounded-xl border border-gray-100 transition duration-200 relative">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-blue-700 mb-1">
                    {appt.service_id?.service_name || "Unknown Service"}
                  </h3>
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(appt.status)}`}>
                    {appt.status || "Unknown"}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Pet:</strong> {appt.pet_id?.name || "Unknown Pet"}</p>
                  <p><strong>Date:</strong> {new Date(appt.appointment_date).toLocaleString()}</p>
                  <p><strong>Package:</strong> {appt.package_type}</p>
                  <p><strong>Notes:</strong> {appt.special_notes || "None"}</p>
                  <p><strong>Discount:</strong> {appt.discount_applied ?? 0}%</p>
                </div>

                {(appt.status === "pending") && (
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => handleUpdate(appt._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-4 rounded-md text-sm transition">
                      Update
                    </button>
                    <button onClick={() => handleDelete(appt._id)} disabled={deletingId === appt._id} className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md text-sm transition disabled:opacity-50">
                      {deletingId === appt._id ? "Deleting..." : "Cancel"}
                    </button>
                  </div>
                )}

                {(appt.status === "confirmed") && (
                  <div className="mt-4 flex gap-3">
                    <Link to={`/payment/${appt._id}`} className="bg-indigo-500 hover:bg-indigo-600 text-white py-1.5 px-4 rounded-md text-sm transition">
                      Make Payment
                    </Link>
                  </div>
                )}

                {(appt.status === "cancelled") && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleDelete(appt._id)}
                      disabled={deletingId === appt._id}
                      className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-4 rounded-md text-sm transition disabled:opacity-50"
                    >
                      {deletingId === appt._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}

                {appt.status === "confirmed" && (hasBoardingSchedule || hasGroomingSchedule || hasTrainingSchedule) && (
                  <button onClick={() => handleScheduleDetails(appt._id)} className="absolute top-3 right-3 bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full" title="View Schedule">
                    <FaCalendarCheck />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-center">
              {selectedSchedule.type} Schedule Details
            </h3>

            {selectedSchedule.type === "Training" ? (
              <>
                <p><strong>Week Start:</strong> {new Date(selectedSchedule.week_start_date).toLocaleDateString()}</p>
                {selectedSchedule.schedule?.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    <p className="font-semibold">Training Sessions:</p>
                    {selectedSchedule.schedule.map((dayObj, idx) => (
                      <div key={idx}>
                        <p className="text-blue-700 font-medium">{dayObj.day}</p>
                        <ul className="list-disc ml-5 text-sm text-gray-800">
                          {(dayObj.sessions || []).map((s, i) => (
                            <li key={i} className="mb-1">
                              <span className="block"><strong>Time:</strong> {s.time || "N/A"}</span>
                              <span className="block"><strong>Type:</strong> {s.training_type || "N/A"}</span>
                              <span className="block"><strong>Duration:</strong> {s.duration || "N/A"}</span>
                              <span className="block"><strong>Status:</strong> {s.status || "N/A"}</span>
                              <span className="block"><strong>Notes:</strong> {s.notes?.trim() || "No notes"}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No sessions available.</p>
                )}

                {selectedSchedule.comments?.trim() && (
                  <p className="mt-2 text-sm text-gray-600"><strong>Comments:</strong> {selectedSchedule.comments}</p>
                )}
              </>
            ) : (
              <>
                {selectedSchedule.start_time && <p><strong>Start Time:</strong> {new Date(selectedSchedule.start_time).toLocaleString()}</p>}
                {selectedSchedule.end_time && <p><strong>End Time:</strong> {new Date(selectedSchedule.end_time).toLocaleString()}</p>}
                {selectedSchedule.status && <p><strong>Status:</strong> {selectedSchedule.status}</p>}
                {selectedSchedule.confirmed_days?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold">Confirmed Days:</p>
                    <ul className="list-disc ml-5 text-sm mt-1 text-green-700">
                      {selectedSchedule.confirmed_days.map((day, i) => <li key={i}>{day}</li>)}
                    </ul>
                  </div>
                )}
                {selectedSchedule.notes && <p className="mt-2 text-sm text-gray-600"><strong>Notes:</strong> {selectedSchedule.notes}</p>}
              </>
            )}

            <button onClick={() => setSelectedSchedule(null)} className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAppointments;
