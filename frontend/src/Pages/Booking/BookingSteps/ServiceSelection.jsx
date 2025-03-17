import React from 'react'
import { ScissorsIcon, HeartIcon, BedIcon, DumbbellIcon } from 'lucide-react'
export function ServiceSelection({ formData, setFormData }) {
  const services = [
    {
      id: 'grooming',
      name: 'Grooming',
      description:
        'Full service bath, haircut, nail trimming, and ear cleaning',
      price: '$45',
      icon: <ScissorsIcon className="h-6 w-6" />,
    },
    {
      id: 'bathing',
      name: 'Bath & Brush',
      description: 'Thorough bath with premium shampoo and brush out',
      price: '$30',
      icon: <div className="h-6 w-6" />,
    },
    {
      id: 'health-check',
      name: 'Health Check',
      description: 'Basic health examination and wellness assessment',
      price: '$55',
      icon: <HeartIcon className="h-6 w-6" />,
    },
    {
      id: 'boarding',
      name: 'Boarding',
      description: 'Overnight care in our comfortable pet suites',
      price: '$40/night',
      icon: <BedIcon className="h-6 w-6" />,
    },
    {
      id: 'training',
      name: 'Training',
      description: 'Behavioral training and socialization sessions',
      price: '$65',
      icon: <DumbbellIcon className="h-6 w-6" />,
    },
  ]
  const handleServiceSelect = (serviceId) => {
    setFormData({
      ...formData,
      service: serviceId,
    })
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Select a Service
        </h2>
        <p className="text-gray-600 text-sm">
          Choose the service that best fits your pet's needs
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceSelect(service.id)}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${formData.service === service.id ? 'border-pink-500 bg-pink-50 shadow-sm' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'}`}
          >
            <div className="flex items-start">
              <div
                className={`p-3 rounded-lg mr-4 ${formData.service === service.id ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                {service.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {service.description}
                </p>
                <p className="text-lg font-semibold text-pink-600 mt-2">
                  {service.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                All services include a complimentary basic health check to
                ensure your pet's well-being.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
