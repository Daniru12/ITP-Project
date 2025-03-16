import React from 'react'
import { CalendarIcon, ClockIcon } from 'lucide-react'
const ServiceSummary = ({ service }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Service Summary
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h3 className="font-medium text-gray-800 mb-2">{service.name}</h3>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <div className="flex items-center mb-3">
            <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700">{service.date}</span>
          </div>
          <div className="flex items-center mb-3">
            <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700">
              {service.time} ({service.duration})
            </span>
          </div>
        </div>
        <div className="md:w-1/2 flex gap-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Your Pet</h3>
            <div className="flex items-center">
              <img
                src={service.pet.image}
                alt={service.pet.name}
                className="h-12 w-12 rounded-full object-cover mr-3"
              />
              <div>
                <p className="font-medium text-gray-800">{service.pet.name}</p>
                <p className="text-sm text-gray-600">{service.pet.breed}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Pet Sitter</h3>
            <div className="flex items-center">
              <img
                src={service.provider.image}
                alt={service.provider.name}
                className="h-12 w-12 rounded-full object-cover mr-3"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {service.provider.name}
                </p>
                <p className="text-sm text-gray-600">
                  ⭐ {service.provider.rating} Rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ServiceSummary
