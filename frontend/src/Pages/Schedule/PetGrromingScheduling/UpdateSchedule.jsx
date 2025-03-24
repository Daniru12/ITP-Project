import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendUrl = "http://localhost:3000"; // Change if needed

const UpdateGroomingSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/scheduling/groomingschedule/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("🧾 Grooming Schedule:", res.data);
        setSchedule(res.data.data); // ✅ Based on your API structure
      } catch (error) {
        toast.error("Failed to fetch grooming schedule");
        console.error("Error fetching grooming schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id, token]);

  const handleChange = (field, value) => {
    setSchedule((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${backendUrl}/api/scheduling/groomingschedule/update/${id}`,
        schedule,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Grooming schedule updated successfully!");
      setTimeout(() => navigate("/schedule/grooming"), 2000); // Redirect after success
    } catch (error) {
      toast.error("Error updating grooming schedule");
      console.error("Error updating grooming schedule:", error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!schedule) return <div className="p-6 text-red-600">❌ Failed to load schedule.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Grooming Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium text-sm">Period</label>
          <input
            type="text"
            value={schedule.Period || ""}
            onChange={(e) => handleChange("Period", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-sm">Start Time</label>
          <input
            type="datetime-local"
            value={schedule.start_time ? new Date(schedule.start_time).toISOString().slice(0, 16) : ""}
            onChange={(e) => handleChange("start_time", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-sm">Status</label>
          <select
            value={schedule.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-sm">Special Requests</label>
          <input
            type="text"
            value={schedule.special_requests || ""}
            onChange={(e) => handleChange("special_requests", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-sm">Notes</label>
          <textarea
            value={schedule.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate("/schedule/grooming")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UpdateGroomingSchedule;
