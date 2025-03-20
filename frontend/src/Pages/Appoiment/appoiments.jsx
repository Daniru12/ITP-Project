import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        const response = await axios.get(`${backendUrl}/api/appointments/provider`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.appointments && response.data.appointments.length > 0) {
          setAppointments(response.data.appointments);
        } else {
          setMessage(response.data.message || "You don't have any appointments yet.");
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
        toast.error('Failed to load appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleConfirm = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.put(
        `${backendUrl}/api/appointments/${appointmentId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Appointment confirmed!');
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: 'confirmed' } : appt
        )
      );
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.put(
        `${backendUrl}/api/appointments/${appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Appointment cancelled!');
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: 'cancelled' } : appt
        )
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Upcoming Appointments</h2>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    {appointment.appointment_date
                      ? new Date(appointment.appointment_date).toLocaleDateString()
                      : 'No Date'}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {appointment.status || 'Unknown'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">Service: {appointment.service_id?.service_name || 'Unknown'}</p>
                <p className="text-gray-600 text-sm">Price: ${appointment.service_id?.price ?? 'N/A'}</p>
                <p className="text-gray-600 text-sm">Duration: {appointment.service_id?.duration ?? 'N/A'} mins</p>
                <p className="text-gray-600 text-sm">Pet: {appointment.pet_id?.name || 'Unknown'}</p>
                <p className="text-gray-600 text-sm">Package: {appointment.package_type || 'N/A'}</p>
                <p className="text-gray-600 text-sm">Discount Applied: ${appointment.discount_applied ?? 0}</p>

                <div className="flex justify-end space-x-2 mt-4">
                  {appointment.status === 'pending' && (
                    <button
                      onClick={() => handleConfirm(appointment._id)}
                      className="text-green-600 hover:text-green-800 flex items-center"
                    >
                      <FaCheck className="mr-1" /> Confirm
                    </button>
                  )}
                  {appointment.status !== 'completed' && (
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <FaTimes className="mr-1" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;

