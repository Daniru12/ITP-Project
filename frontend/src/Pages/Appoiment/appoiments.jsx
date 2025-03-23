import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaCalendarPlus,
  FaTrash
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const [appointmentsRes, schedulesRes] = await Promise.all([
          axios.get(`${backendUrl}/api/appointments/provider`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/scheduling/bordingschedule`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAppointments(appointmentsRes.data.appointments || []);
        setSchedules(schedulesRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load data');
        toast.error('Failed to load data');
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const hasSchedule = (appointmentId) => {
    return schedules.some((s) => s.appointment_id?._id === appointmentId);
  };

  const handleConfirm = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.put(`${backendUrl}/api/appointments/${appointmentId}`, {
        status: 'confirmed',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Appointment confirmed!');
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, status: 'confirmed' } : a
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm appointment');
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure to cancel this appointment?")) return;
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.put(`${backendUrl}/api/appointments/${appointmentId}`, {
        status: 'cancelled',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Appointment cancelled!');
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, status: 'cancelled' } : a
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure to delete this appointment?")) return;
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.delete(`${backendUrl}/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Appointment deleted!');
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleSchedule = (appointment) => {
    const category = appointment?.service_id?.service_category;
    const routeMap = {
      pet_boarding: '/Bordingscheduleadd',
      pet_grooming: '/Groomingscheduleadd',
      pet_training: '/Trainingscheduleadd',
    };

    const path = routeMap[category];
    if (!path) {
      toast.error("Invalid service category");
      return;
    }

    navigate(path, {
      state: {
        appointmentId: appointment._id,
        appointmentDetails: appointment,
      },
    });
  };

  const handleViewSchedule = (appointment) => {
    const category = appointment?.service_id?.service_category;
    const routeMap = {
      pet_boarding: '/schedule/boarding',
      pet_grooming: '/ViewGroomingSchedule',
      pet_training: '/ViewTrainingSchedule',
    };

    const path = routeMap[category];
    if (!path) {
      toast.error("Invalid service category");
      return;
    }

    navigate(path, {
      state: {
        appointmentId: appointment._id,
        appointmentDetails: appointment,
      },
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="text-center py-20 text-blue-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">📅 Provider Appointments</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => {
          const service = appointment.service_id || {};
          const pet = appointment.pet_id || {};
          const owner = pet.owner_id || {};
          const scheduled = hasSchedule(appointment._id);

          return (
            <div key={appointment._id} className="relative border rounded-xl p-4 shadow hover:shadow-md">
              {/* Schedule button */}
              {appointment.status === 'confirmed' && !scheduled && (
                <button
                  onClick={() => handleSchedule(appointment)}
                  className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  title="Create Schedule"
                >
                  <FaCalendarPlus />
                </button>
              )}

              {appointment.status === 'confirmed' && scheduled && (
                <button
                  onClick={() => handleViewSchedule(appointment)}
                  className="absolute top-3 right-3 bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200"
                  title="View Schedule"
                >
                  <FaCalendarAlt />
                </button>
              )}

              <h3 className="text-lg font-bold mb-2">{service.service_name}</h3>
              <div className={`text-xs px-2 py-1 inline-block rounded-full mb-2 ${getStatusStyle(appointment.status)}`}>
                {appointment.status}
              </div>

              <p className="text-sm text-gray-700">Pet: {pet.name}</p>
              <p className="text-sm text-gray-700">Owner: {owner.full_name}</p>
              <p className="text-sm text-gray-700">Phone: {owner.phone_number}</p>
              <p className="text-sm text-gray-700">Date: {new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-700">Package: {appointment.package_type}</p>
              <p className="text-sm text-gray-700">Discount: ${appointment.discount_applied ?? 0}</p>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                {appointment.status === 'pending' && (
                  <button
                    onClick={() => handleConfirm(appointment._id)}
                    className="text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full text-sm"
                  >
                    <FaCheck className="inline mr-1" /> Confirm
                  </button>
                )}
                {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full text-sm"
                  >
                    <FaTimes className="inline mr-1" /> Cancel
                  </button>
                )}
                {appointment.status === 'cancelled' && (
                  <button
                    onClick={() => handleDelete(appointment._id)}
                    className="text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentsList;
