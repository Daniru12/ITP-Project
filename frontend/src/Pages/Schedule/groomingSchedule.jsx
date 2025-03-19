import React, { useState } from 'react'
import axios from 'axios' // Import axios
import { ClockIcon, CheckCircleIcon } from 'lucide-react'

export default function PetAppointmentForm() {
  // Simulating data from backend
  const [userAppointment, setAppointment] = useState({
    appointment_id: '',
  });

  const selectedPet = {
    id: 'pet1',
    name: 'Max',
    breed: 'Golden Retriever',
    image:
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=100&h=100',
  };

  const selectedService = {
    id: 'service1',
    name: 'Grooming',
    price: '$45',
  };

  const selectedDate = '2024-02-15';
  const [formData, setFormData] = useState({
    period: '',
    start_time: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const periods = ['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendSchedule = async () => {
  try {
    console.log("Form Data:", formData); // Debugging

    // Ensure the user has selected a valid time
    if (!formData.start_time) {
      throw new Error("Start time is missing!");
    }

    // Create a valid DateTime format (YYYY-MM-DDTHH:MM:SS)
    const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
    const fullDateTime = new Date(`${today}T${formData.start_time}:00`); // Append time

    // Ensure the date is valid
    if (isNaN(fullDateTime.getTime())) {
      throw new Error("Invalid start time format!");
    }

    const requestBody = {
      pet_id: "67d5e4073e18e063d8791e5f",
      service_id: "67da98b31af51a47f086517e",
      appointment_id: "67d86e1f457809a5015d4db4",
      Period: "1hour",
      start_time: fullDateTime.toISOString(), // Convert to valid ISO format
    };

    console.log("Sending Request with Body:", requestBody); // Debugging

    const response = await axios.post(
      "http://localhost:3000/api/scheduling/groomingschedule/create",
      requestBody
    );

    console.log("Schedule successful:", response.data);
    alert("✅ Your pet's appointment has been successfully scheduled!");
    setSubmitted(true);
  } catch (error) {
    console.error("Unexpected error:", error);

    if (error.response) {
      alert(`❌ Server Error: ${error.response.data.error || "Unknown backend error"}`);
    } else if (error.request) {
      alert("❌ Network error: No response from server. Check if backend is running.");
    } else {
      alert(`❌ Error: ${error.message}`);
    }
  }
};

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendSchedule();
    setSubmitted(true);
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
        {/* Pre-selected Information */}
        <div className="mb-8 bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Appointment Details
          </h2>
          <div className="flex items-center mb-4">
            <img
              src={selectedPet.image}
              alt={selectedPet.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <div className="font-medium text-gray-900">{selectedPet.name}</div>
              <div className="text-sm text-gray-500">{selectedPet.breed}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Service:</span>
              <span className="ml-2 text-gray-900">{selectedService.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Price:</span>
              <span className="ml-2 text-gray-900">{selectedService.price}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Date:</span>
              <span className="ml-2 text-gray-900">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="period">
              Service Duration
            </label>
            <div className="relative">
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                required
              >
                <option value="">Select duration</option>
                {periods.map((period, idx) => (
                  <option key={idx} value={period}>
                    {period}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="start_time">
              Start Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
