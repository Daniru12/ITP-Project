import React from 'react'
import {
  CheckCircleIcon,
  CalendarIcon,
  PackageIcon,
  MessageSquareIcon,
  HeartIcon,
} from 'lucide-react'
export function Summary({ formData }) {
  // Find the selected service name
  const getServiceName = () => {
    const services = {
      grooming: 'Grooming',
      bathing: 'Bath & Brush',
      'health-check': 'Health Check',
      boarding: 'Boarding',
      training: 'Training',
    }
    return services[formData.service] || 'Not selected'
  }
  // Find the selected package name and price
  const getPackageInfo = () => {
    const packages = {
      basic: {
        name: 'Basic Care',
        price: '$45',
      },
      premium: {
        name: 'Premium Care',
        price: '$75',
      },
      deluxe: {
        name: 'Deluxe Care',
        price: '$95',
      },
    }
    return (
      packages[formData.package] || {
        name: 'Not selected',
        price: 'N/A',
      }
    )
  }
  // Format the appointment date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not selected'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }
  const packageInfo = getPackageInfo()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Booking Summary
        </h2>
        <p className="text-gray-600 text-sm">
          Please review your booking details before confirming
        </p>
      </div>
      <div className="bg-gray-50 rounded-xl p-6 space-y-6">
        {/* Pet Information */}
        <div className="flex items-start">
          <div className="bg-pink-100 p-2 rounded-full mr-4">
            <HeartIcon className="h-6 w-6 text-pink-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Pet Information</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <span className="ml-2 text-gray-900 font-medium">
                  {formData.pet.name || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Breed:</span>
                <span className="ml-2 text-gray-900">
                  {formData.pet.breed || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Age:</span>
                <span className="ml-2 text-gray-900">
                  {formData.pet.age || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Photo:</span>
                <span className="ml-2 text-gray-900">
                  {formData.pet.photo ? 'Provided' : 'Not provided'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Service & Package */}
        <div className="flex items-start">
          <div className="bg-purple-100 p-2 rounded-full mr-4">
            <PackageIcon className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Service & Package</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Service:</span>
                <span className="ml-2 text-gray-900 font-medium">
                  {getServiceName()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Package:</span>
                <span className="ml-2 text-gray-900 font-medium">
                  {packageInfo.name}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Price:</span>
                <span className="ml-2 text-gray-900 font-bold">
                  {packageInfo.price}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Appointment */}
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-full mr-4">
            <CalendarIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Appointment Details</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="md:col-span-2">
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 text-gray-900">
                  {formatDate(formData.appointmentDate)}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Time:</span>
                <span className="ml-2 text-gray-900">
                  {formData.appointmentTime || 'Not selected'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Special Notes */}
        <div className="flex items-start">
          <div className="bg-yellow-100 p-2 rounded-full mr-4">
            <MessageSquareIcon className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Special Notes</h3>
            <div className="mt-2 text-sm">
              <p className="text-gray-700 whitespace-pre-line">
                {formData.notes || 'No special notes provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-green-800">Almost done!</h3>
          <p className="text-sm text-green-700 mt-1">
            Please review all the information above. Once you confirm your
            booking, you'll receive a confirmation email with all the details.
          </p>
        </div>
      </div>
    </div>
  )
}
