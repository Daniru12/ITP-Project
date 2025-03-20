import React, { useState } from 'react'
import { CalendarIcon, ClockIcon } from 'lucide-react'
export function AppointmentBooking({ formData, setFormData }) {
  const [selectedDate, setSelectedDate] = useState(
    formData.appointmentDate || '',
  )
  const [selectedTime, setSelectedTime] = useState(
    formData.appointmentTime || '',
  )
  // Generate next 14 days for calendar
  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      // Skip Sundays (assuming the business is closed)
      if (date.getDay() !== 0) {
        const dateStr = date.toISOString().split('T')[0]
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(date)
        dates.push({
          value: dateStr,
          label: formattedDate,
        })
      }
    }
    return dates
  }
  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ]
  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setFormData({
      ...formData,
      appointmentDate: date,
      appointmentTime: selectedTime,
    })
  }
  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setFormData({
      ...formData,
      appointmentDate: selectedDate,
      appointmentTime: time,
    })
  }
  const dateOptions = generateDateOptions()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Schedule an Appointment
        </h2>
        <p className="text-gray-600 text-sm">
          Pick a date and time that works for you
        </p>
      </div>
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-pink-500" />
          Select Date
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {dateOptions.map((date) => (
            <button
              key={date.value}
              type="button"
              onClick={() => handleDateSelect(date.value)}
              className={`p-3 text-center border rounded-lg transition ${selectedDate === date.value ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-300 hover:border-pink-300'}`}
            >
              <span className="block text-xs font-medium mb-1">
                {date.label.split(',')[0]}
              </span>
              <span
                className={`block text-sm ${selectedDate === date.value ? 'text-white' : 'text-gray-800'}`}
              >
                {date.label.split(',')[1]}
              </span>
            </button>
          ))}
        </div>
      </div>
      {selectedDate && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-pink-500" />
            Select Time
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeSelect(time)}
                className={`p-3 text-center border rounded-lg transition ${selectedTime === time ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-300 hover:border-pink-300'}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="pt-4">
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Appointments are available Monday through Saturday. Please
                arrive 10 minutes before your scheduled time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
