import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
        console.error("Error fetching appointments:", err.response?.data || err.message);
        toast.error("Failed to load appointments");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
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
      console.error("Delete error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete appointment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/appointments/update/${id}`);
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border border-green-300";
      case "pending":
        return "bg-white text-gray-700 border border-gray-300";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">🐾 My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">You haven't booked any appointments yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="p-6 bg-white shadow-lg hover:shadow-xl rounded-xl border border-gray-100 transition duration-200"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-blue-700 mb-1">
                  {appt.service_id?.service_name || "Unknown Service"}
                </h3>
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                    appt.status
                  )}`}
                >
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

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleUpdate(appt._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-4 rounded-md text-sm transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(appt._id)}
                  disabled={deletingId === appt._id}
                  className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md text-sm transition disabled:opacity-50"
                >
                  {deletingId === appt._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAppointments;
