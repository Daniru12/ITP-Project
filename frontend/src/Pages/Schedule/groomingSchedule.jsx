import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClockIcon, CheckCircleIcon } from 'lucide-react';

export default function PetAppointmentForm() {
  const [userPets, setUserPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

useEffect(() => {
  const fetchUserPets = async () => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.get(`${backendUrl}/api/users/pets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🐶 Pets Fetched:", response.data.pets); // Log all pets

      if (response.data.pets.length > 0) {
        const firstPet = response.data.pets[0];
        setSelectedPet(firstPet); // Set first pet as selected
        console.log("✅ First Pet Selected:", firstPet); // Log selected pet

        // Check if the pet has `_id` instead of `id`
        console.log("🐾 Pet ID:", firstPet.id || firstPet._id); 
      }

      setUserPets(response.data.pets || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user pets:", error);
      setIsLoading(false);
    }
  };

  fetchUserPets();
}, []);


  const selectedService = {
    id: '67da98b31af51a47f086517e', // MongoDB ObjectId for service
    name: 'Grooming',
    price: '$45',
  };

  const appointmentId = '67d86e1f457809a5015d4db4';
  const periods = ['30 minutes', '1 hour', '2 hours'];

  const [formData, setFormData] = useState({
    period: '',
    start_time: '',
    special_request: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendSchedule = async () => {
    try {
      if (!selectedPet) {
        alert("Please select a pet before scheduling.");
        console.error("❌ Error: selectedPet is null or undefined!");
        return;
      }
  
      const petId = selectedPet.id || selectedPet._id;
      if (!petId) {
        alert("❌ Pet ID is missing!");
        console.error("❌ Error: Pet ID is missing in selectedPet object!", selectedPet);
        return;
      }
  
      if (!formData.period) {
        alert("❌ Please select a service duration.");
        console.error("❌ Error: period is missing!");
        return;
      }
  
      console.log("🔍 Checking start_time value:", formData.start_time); // Log start_time for debugging
  
      if (!formData.start_time) {
        alert("❌ Please select a valid start time.");
        console.error("❌ Error: start_time is missing or empty!");
        return;
      }
  
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const fullDateTime = new Date(`${today}T${formData.start_time}:00`); // Append time to date
  
      console.log("⏰ Parsed Full DateTime:", fullDateTime.toISOString()); // Log full datetime
  
      if (isNaN(fullDateTime.getTime())) {
        alert("❌ Invalid start time format!");
        console.error("❌ Error: Invalid start time format!", formData.start_time);
        return;
      }
  
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
      const requestBody = {
        pet_id: petId,
        service_id: selectedService.id,
        appointment_id: appointmentId,
        period: formData.period,
        start_time: fullDateTime.toISOString(),
        end_time: formData.period === "custom" && formData.end_time ? new Date(`${today}T${formData.end_time}:00`).toISOString() : null,
        special_requests: formData.special_request || "",
        notes: formData.notes || "",
      };
  
      console.log("📡 Request Body Being Sent to Backend:", requestBody);
  
      const response = await axios.post(
        `${backendUrl}/api/scheduling/groomingschedule/create`,
        requestBody
      );
  
      console.log("✅ Schedule successful:", response.data);
      alert("✅ Your pet's appointment has been successfully scheduled!");
      setSubmitted(true);
    } catch (error) {
      console.error("🚨 Unexpected error:", error);
  
      if (error.response) {
        console.error("❌ Server Response Error:", error.response.data);
        alert(`❌ Server Error: ${error.response.data.error || "Unknown error"}`);
      } else if (error.request) {
        console.error("❌ Network error: No response from server");
        alert("❌ Network error: No response from server. Check if backend is running.");
      } else {
        console.error("❌ Client-side error:", error.message);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule Updated!</h2>
        <p className="text-gray-600 mb-6">Your pet's appointment time has been successfully scheduled.</p>
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h2>

        {isLoading ? (
          <p>Loading pets...</p>
        ) : (
          selectedPet && (
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
          )
        )}

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
