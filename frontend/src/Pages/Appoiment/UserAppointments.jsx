import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt._id} className="p-4 border shadow rounded bg-white">
              <h3 className="text-lg font-semibold">{appt.service_id?.service_name || "Unknown Service"}</h3>
              <p><strong>Pet:</strong> {appt.pet_id?.name || "Unknown Pet"}</p>
              <p><strong>Date:</strong> {new Date(appt.appointment_date).toLocaleString()}</p>
              <p><strong>Package:</strong> {appt.package_type}</p>
              <p><strong>Status:</strong> {appt.status}</p>
              <p><strong>Notes:</strong> {appt.special_notes || "None"}</p>
              <p><strong>Discount:</strong> {appt.discount_applied ?? 0}%</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserAppointments;
