import React, { useState } from 'react';
import axios from 'axios';
import { ClockIcon, CheckCircleIcon } from 'lucide-react';

export default function PetAppointmentForm() {
  // Simulating backend data
  const selectedPet = {
    id: '67d5e4073e18e063d8791e5f', // MongoDB ObjectId for pet
    name: 'Max',
    breed: 'Golden Retriever',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=100&h=100',
  };

  const selectedService = {
    id: '67da98b31af51a47f086517e', // MongoDB ObjectId for service
    name: 'Grooming',
    price: '$45',
  };

  const appointmentId = '67d86e1f457809a5015d4db4'; // Appointment MongoDB ID
  const periods = ['30 minutes', '1 hour', '2 hours'];

  const [formData, setFormData] = useState({
    period: '',
    start_time: '',
    special_request: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendSchedule = async () => {
    try {
      console.log('Form Data:', formData);

      if (!formData.start_time) {
        throw new Error('Start time is missing!');
      }

      const today = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)
      const fullDateTime = new Date(`${today}T${formData.start_time}:00`); // Append time

      if (isNaN(fullDateTime.getTime())) {
        throw new Error('Invalid start time format!');
      }

      // Backend expects a structured request body
      const requestBody = {
        pet_id: selectedPet.id,
        service_id: selectedService.id,
        appointment_id: appointmentId,
        Period: "1hour", 
        start_time: fullDateTime.toISOString(), // Convert to ISO format
        special_requests: formData.special_request,
        notes: formData.notes,
      };

      console.log('Sending Request with Body:', requestBody);

      const response = await axios.post(
        'http://localhost:3000/api/scheduling/groomingschedule/create', // Backend API
        requestBody
      );

      console.log('Schedule successful:', response.data);
      alert('✅ Your pet\'s appointment has been successfully scheduled!');
      setSubmitted(true);
    } catch (error) {
      console.error('Unexpected error:', error);

      if (error.response) {
        alert(`❌ Server Error: ${error.response.data.error || 'Unknown backend error'}`);
      } else if (error.request) {
        alert('❌ Network error: No response from server. Check if backend is running.');
      } else {
        alert(`❌ Error: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendSchedule();
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Schedule Updated!
        </h2>
        <p className="text-gray-600 mb-6">
          Your pet's appointment time has been successfully scheduled.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Make Another Change
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Appointment Details
        </h2>
        <div className="flex items-center mb-4">
          <img src={selectedPet.image} alt={selectedPet.name} className="w-12 h-12 rounded-full object-cover mr-4" />
          <div>
            <div className="font-medium text-gray-900">{selectedPet.name}</div>
            <div className="text-sm text-gray-500">{selectedPet.breed}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Service Duration */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="period">
              Service Duration
            </label>
            <select
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select duration</option>
              {periods.map((period, idx) => (
                <option key={idx} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          {/* Start Time */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="start_time">
              Start Time
            </label>
            <div className="relative">
              <ClockIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="special_request">
              Special Requests
            </label>
            <textarea
              id="special_request"
              name="special_request"
              rows="3"
              value={formData.special_request}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Any special grooming requirements?"
            />
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Additional instructions or concerns..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
