import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateSchedule = () => {
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    pet_id: "",
    service_id: "",
    week_start_date: "",
    schedule: [],
    comments: "",
  });

  const [day, setDay] = useState("Monday");
  const [session, setSession] = useState({
    time: "",
    training_type: "",
    duration: "1hour",
    status: "Scheduled",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petRes = await axios.get("http://localhost:3000/api/pets"); // Update as per your route
        const serviceRes = await axios.get("http://localhost:3000/api/services"); // Update as per your route
        setPets(petRes.data);
        setServices(serviceRes.data);
      } catch (error) {
        console.error("Error fetching pets/services", error);
      }
    };
    fetchData();
  }, []);

  const addSessionToDay = () => {
    const updated = [...formData.schedule];
    const existingDay = updated.find((d) => d.day === day);

    if (existingDay) {
      existingDay.sessions.push(session);
    } else {
      updated.push({ day, sessions: [session] });
    }

    setFormData({ ...formData, schedule: updated });
    setSession({ time: "", training_type: "", duration: "1hour", status: "Scheduled", notes: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/scheduling/trainigschedule/create", formData);
      alert("Schedule created successfully!");
      setFormData({ pet_id: "", service_id: "", week_start_date: "", schedule: [], comments: "" });
    } catch (error) {
      console.error("Error submitting schedule", error);
      alert("Failed to create schedule");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create Training Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={formData.pet_id} onChange={(e) => setFormData({ ...formData, pet_id: e.target.value })} required>
          <option value="">Select Pet</option>
          {pets.map((pet) => (
            <option key={pet._id} value={pet._id}>{pet.name}</option>
          ))}
        </select>

        <select value={formData.service_id} onChange={(e) => setFormData({ ...formData, service_id: e.target.value })} required>
          <option value="">Select Main Service</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={formData.week_start_date}
          onChange={(e) => setFormData({ ...formData, week_start_date: e.target.value })}
          required
        />

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Add Session</h3>
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Time (e.g., 06:00 AM)"
            value={session.time}
            onChange={(e) => setSession({ ...session, time: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Training Type"
            value={session.training_type}
            onChange={(e) => setSession({ ...session, training_type: e.target.value })}
            required
          />
          <select value={session.duration} onChange={(e) => setSession({ ...session, duration: e.target.value })}>
            <option value="30min">30min</option>
            <option value="1hour">1hour</option>
            <option value="2hours">2hours</option>
            <option value="custom">custom</option>
          </select>
          <textarea
            placeholder="Notes"
            value={session.notes}
            onChange={(e) => setSession({ ...session, notes: e.target.value })}
          />
          <button type="button" onClick={addSessionToDay}>Add Session</button>
        </div>

        <textarea
          placeholder="Comments"
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Schedule</button>
      </form>
    </div>
  );
};

export default CreateSchedule;
