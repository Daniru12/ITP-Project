import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:3000";
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeSlots = [
  "09:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"
];

const TrainingScheduleGrid = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("1hour");
  const [showGrid, setShowGrid] = useState(false);

  const [notesMap, setNotesMap] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleStart = () => {
    if (!startDate || !endDate || !duration) {
      toast.error("Please select start date, end date, and duration");
      return;
    }
    setShowGrid(true);
  };

  const openNoteModal = (day, time) => {
    const key = `${day}_${time}`;
    setSelectedSlot({ day, time });
    setNoteInput(notesMap[key] || "");
    setIsOpen(true);
  };

  const handleSaveNote = () => {
    const key = `${selectedSlot.day}_${selectedSlot.time}`;
    setNotesMap({ ...notesMap, [key]: noteInput });
    setIsOpen(false);
  };

  const handleSubmitSchedule = async () => {
    const schedule = daysOfWeek.map((day) => ({
      day,
      sessions: timeSlots.map((time) => ({
        time,
        training_type: "Custom", // or allow editing later
        duration,
        status: "Scheduled",
        notes: notesMap[`${day}_${time}`] || ""
      }))
    }));

    try {
      const res = await axios.post(
        `${backendUrl}/api/training-schedules`,
        {
          appointment_id: "PLACEHOLDER_ID",
          pet_id: "PLACEHOLDER_PET",
          service_id: "PLACEHOLDER_SERVICE",
          week_start_date: startDate,
          schedule,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Training schedule saved!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving schedule");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {!showGrid && (
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Training Schedule Setup</h2>

          <label className="block mb-2">Week Start Date:</label>
          <input
            type="date"
            className="w-full p-2 border mb-4"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="block mb-2">Week End Date:</label>
          <input
            type="date"
            className="w-full p-2 border mb-4"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <label className="block mb-2">Session Duration:</label>
          <select
            className="w-full p-2 border mb-4"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="30min">30 minutes</option>
            <option value="1hour">1 hour</option>
            <option value="2hours">2 hours</option>
          </select>

          <button
            onClick={handleStart}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Continue to Training Grid
          </button>
        </div>
      )}

      {showGrid && (
        <div>
          <h2 className="text-2xl font-bold text-center mb-4">Weekly Training Plan</h2>

          <div className="grid grid-cols-8 border text-sm">
            <div className="bg-green-100 font-semibold p-2">Time</div>
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-green-300 text-center font-semibold p-2">{day}</div>
            ))}

            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="bg-green-100 p-2">{time}</div>
                {daysOfWeek.map((day) => {
                  const key = `${day}_${time}`;
                  return (
                    <div
                      key={key}
                      className="border p-2 h-20 cursor-pointer hover:bg-green-50"
                      onClick={() => openNoteModal(day, time)}
                    >
                      {notesMap[key] || ""}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={handleSubmitSchedule}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Full Schedule
          </button>
        </div>
      )}

      {/* Note Editor Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-2">Edit Note</Dialog.Title>
            <p className="text-sm mb-1">Day: {selectedSlot?.day}, Time: {selectedSlot?.time}</p>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full h-24 border p-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSaveNote} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TrainingScheduleGrid;
