import React from 'react'
import { AlertCircleIcon, InfoIcon } from 'lucide-react'
export function SpecialNotes({ formData, setFormData }) {
  const handleNotesChange = (e) => {
    setFormData({
      ...formData,
      notes: e.target.value,
    })
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Special Instructions
        </h2>
        <p className="text-gray-600 text-sm">
          Let us know if your pet has any special needs or preferences
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Special Notes
          </label>
          <textarea
            id="notes"
            rows={5}
            value={formData.notes}
            onChange={handleNotesChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="E.g. allergies, behavioral notes, preferences, or any other special instructions..."
          ></textarea>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <InfoIcon className="h-5 w-5 mr-2 text-blue-500" />
            Common things to mention:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Any allergies or sensitivities</li>
            <li>• Behavioral traits (shy, anxious, etc.)</li>
            <li>• Previous reactions to grooming or care</li>
            <li>• Preferred treats or toys</li>
            <li>• Areas that are sensitive to touch</li>
          </ul>
        </div>
        <div className="flex items-start p-4 bg-amber-50 rounded-lg">
          <AlertCircleIcon className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            Please let us know about any medical conditions or medications that
            our staff should be aware of to ensure the safety and comfort of
            your pet.
          </p>
        </div>
      </div>
    </div>
  )
}
