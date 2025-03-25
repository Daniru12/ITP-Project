import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:3000";

const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = ["09:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];

const TrainingScheduleGrid = () => {
  const [schedule, setSchedule] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dayPlan, setDayPlan] = useState(""); // "2", "3", "4", "7"
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/training-schedules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data[0];
        setSchedule(data);
        setDayPlan(data.day_plan_count?.toString() || "7"); // fallback to full week
      } catch (err) {
        toast.error("Failed to load schedule");
      }
    };
    fetchSchedule();
  }, [token]);

  const getNoteForCell = (day, time) => {
    const dayObj = schedule?.schedule?.find((d) => d.day === day);
    const session = dayObj?.sessions?.find((s) => s.time === time);
    return session?.notes || "";
  };

  const handleCellClick = (day, time) => {
    const note = getNoteForCell(day, time);
    setSelectedSlot({ day, time });
    setNoteInput(note);
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${backendUrl}/api/training-schedules/note/${schedule._id}`,
        {
          day: selectedSlot.day,
          time: selectedSlot.time,
          notes: noteInput,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Note updated");
      setIsOpen(false);
      const res = await axios.get(`${backendUrl}/api/training-schedules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedule(res.data.data[0]);
    } catch (err) {
      toast.error("Error updating note");
    }
  };

  const handlePlanChange = async (value) => {
    setDayPlan(value);
    try {
      await axios.patch(
        `${backendUrl}/api/training-schedules/${schedule._id}`,
        { day_plan_count: parseInt(value) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Day plan updated!");
    } catch (err) {
      toast.error("Failed to update plan");
    }
  };

  const generateDateList = (startDate) => {
    const dateList = [];
    const base = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      dateList.push(d.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    }
    return dateList;
  };

  const visibleDays = allDays.slice(0, parseInt(dayPlan) || 0);
  const weekDates = schedule?.week_start_date ? generateDateList(schedule.week_start_date) : [];
  const visibleDates = weekDates.slice(0, parseInt(dayPlan) || 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Dog Training Plan</h2>

      {schedule && (
        <div className="max-w-md mx-auto bg-white p-4 rounded shadow-md mb-6">
          <label className="block mb-2 font-medium">Select Your Training Days Plan:</label>
          <select
            className="w-full p-2 border rounded"
            value={dayPlan}
            onChange={(e) => handlePlanChange(e.target.value)}
          >
            <option value="2">2 Days</option>
            <option value="3">3 Days</option>
            <option value="4">4 Days</option>
            <option value="7">Full Week (7 Days)</option>
          </select>
        </div>
      )}

      {schedule && dayPlan && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[100px_repeat(auto-fill,_minmax(100px,_1fr))] border text-sm">
            <div className="bg-blue-100 font-semibold p-2 text-center">Time</div>
            {visibleDays.map((day, idx) => (
              <div key={day} className="bg-blue-600 text-white text-center font-semibold p-2">
                <div>{day}</div>
                <div className="text-xs">{visibleDates[idx]}</div>
              </div>
            ))}

            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="bg-blue-100 p-2 font-medium text-center">{time}</div>
                {visibleDays.map((day) => (
                  <div
                    key={day + time}
                    className="border p-2 h-20 cursor-pointer hover:bg-blue-50"
                    onClick={() => handleCellClick(day, time)}
                  >
                    {getNoteForCell(day, time)}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-2">Add/Edit Note</Dialog.Title>
            <p className="text-sm mb-1">Day: {selectedSlot?.day}, Time: {selectedSlot?.time}</p>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full h-24 border p-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TrainingScheduleGrid;
