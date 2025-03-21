// components/ShowSchedule.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowSchedule = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get("/api/training-schedules");
        setSchedules(res.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Training Schedules</h2>
      {schedules.map((schedule) => (
        <div key={schedule._id} className="border p-4 mb-4 rounded shadow">
          <h3 className="text-lg font-semibold">
            Pet: {schedule.pet_id?.name || "Unknown"} | Start: {new Date(schedule.week_start_date).toLocaleDateString()}
          </h3>
          <p className="text-sm text-gray-600 mb-2">Main Service: {schedule.service_id?.name}</p>
          {schedule.schedule.map((dayBlock, idx) => (
            <div key={idx} className="mt-2">
              <strong>{dayBlock.day}</strong>
              <ul className="list-disc list-inside ml-4">
                {dayBlock.sessions.map((s, i) => (
                  <li key={i}>
                    {s.time} - {s.training_type} ({s.duration}) - <em>{s.status}</em> {s.notes && `- Notes: ${s.notes}`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {schedule.comments && <p className="mt-2 text-sm italic">Comments: {schedule.comments}</p>}
        </div>
      ))}
    </div>
  );
};

export default ShowSchedule;
