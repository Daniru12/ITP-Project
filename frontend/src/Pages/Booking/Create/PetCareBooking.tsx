import React, { useState } from 'react'
import { PawPrintIcon, CalendarIcon, CheckIcon, HeartIcon } from 'lucide-react'
// Pet type definition
type Pet = {
  id: number
  name: string
  breed: string
  age: string
  image: string
}
// Service type definition
type Service = {
  id: number
  name: string
  description: string
  price: number
}
// Package type definition
type Package = {
  id: number
  name: string
  description: string
  services: string[]
  price: number
}
export function PetCareBooking() {
  // Sample pet data
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '3 years',
      image:
        'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=262&q=80',
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Siamese Cat',
      age: '2 years',
      image:
        'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    },
  ])
  // Available services
  const services: Service[] = [
    {
      id: 1,
      name: 'Bath & Brush',
      description: 'Complete bath with brushing and blow dry',
      price: 40,
    },
    {
      id: 2,
      name: 'Full Grooming',
      description: 'Bath, haircut, nail trimming, ear cleaning',
      price: 65,
    },
    {
      id: 3,
      name: 'Nail Trimming',
      description: 'Nail trimming and filing',
      price: 15,
    },
    {
      id: 4,
      name: 'Teeth Cleaning',
      description: 'Dental hygiene service',
      price: 25,
    },
  ]
  // Available packages
  const packages: Package[] = [
    {
      id: 1,
      name: 'Basic Care',
      description: 'Essential care for your pet',
      services: ['Bath & Brush', 'Nail Trimming'],
      price: 50,
    },
    {
      id: 2,
      name: 'Standard Care',
      description: 'Comprehensive grooming and care',
      services: ['Bath & Brush', 'Full Grooming', 'Nail Trimming'],
      price: 100,
    },
    {
      id: 3,
      name: 'Premium Care',
      description: 'Complete pet pampering experience',
      services: [
        'Bath & Brush',
        'Full Grooming',
        'Nail Trimming',
        'Teeth Cleaning',
      ],
      price: 120,
    },
  ]
  // Form state
  const [selectedPet, setSelectedPet] = useState<number | null>(null)
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [appointmentDate, setAppointmentDate] = useState<string>('')
  const [appointmentTime, setAppointmentTime] = useState<string>('')
  const [specialNotes, setSpecialNotes] = useState<string>('')
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [showSummary, setShowSummary] = useState<boolean>(false)
  // Handle service selection
  const handleServiceSelect = (serviceId: number) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
    // Clear package selection when individual services are selected
    setSelectedPackage(null)
  }
  // Handle package selection
  const handlePackageSelect = (packageId: number) => {
    setSelectedPackage(packageId)
    // Clear individual services when a package is selected
    setSelectedServices([])
  }
  // Calculate total price
  const calculateTotal = () => {
    if (selectedPackage !== null) {
      const pkg = packages.find((p) => p.id === selectedPackage)
      return pkg ? pkg.price : 0
    } else {
      return selectedServices.reduce((total, serviceId) => {
        const service = services.find((s) => s.id === serviceId)
        return total + (service ? service.price : 0)
      }, 0)
    }
  }
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSummary(true)
  }
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
            alt="Pet Care Services"
            className="rounded-full w-24 h-24 object-cover border-4 border-pink-200"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Paws & Relax</h1>
        <p className="text-gray-600">
          Book your pet's grooming and care services
        </p>
      </div>
      {!showSummary ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white rounded-lg shadow-lg p-6"
        >
          {/* Pet Profile Section */}
          <section className="border-b pb-6">
            <div className="flex items-center mb-4">
              <PawPrintIcon className="w-6 h-6 text-pink-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Pet Profile
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPet === pet.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                  onClick={() => setSelectedPet(pet.id)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{pet.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pet.breed}, {pet.age}
                      </p>
                    </div>
                    {selectedPet === pet.id && (
                      <CheckIcon className="w-5 h-5 text-pink-500 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 text-sm text-pink-600 hover:text-pink-800 flex items-center"
            >
              <span className="mr-1">+</span> Add another pet
            </button>
          </section>
          {/* Service Selection */}
          <section className="border-b pb-6">
            <div className="flex items-center mb-4">
              <HeartIcon className="w-6 h-6 text-pink-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Select Services
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedServices.includes(service.id) ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-gray-800">
                        ${service.price}
                      </span>
                      {selectedServices.includes(service.id) && (
                        <CheckIcon className="w-5 h-5 text-pink-500 mt-2" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Package Options */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Package Options
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPackage === pkg.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    <h3 className="font-medium text-gray-800">{pkg.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {pkg.description}
                    </p>
                    <ul className="text-sm text-gray-600 mb-4">
                      {pkg.services.map((service, index) => (
                        <li key={index} className="flex items-center">
                          <CheckIcon className="w-4 h-4 text-green-500 mr-1" />
                          {service}
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-gray-800">
                        ${pkg.price}
                      </span>
                      {selectedPackage === pkg.id && (
                        <CheckIcon className="w-5 h-5 text-pink-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Appointment Booking */}
          <section className="border-b pb-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-6 h-6 text-pink-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Book Appointment
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>
          </section>
          {/* Special Notes */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Special Notes
            </h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              rows={4}
              placeholder="Add any special instructions, allergies, or preferences here..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            ></textarea>
          </section>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              disabled={
                !selectedPet ||
                (!selectedServices.length && selectedPackage === null) ||
                !appointmentDate ||
                !appointmentTime
              }
            >
              Review Booking
            </button>
          </div>
        </form> /* Booking Summary */
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <CheckIcon className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Booking Summary
            </h2>
          </div>
          <div className="space-y-4">
            {selectedPet && (
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">Pet</h3>
                <div className="flex items-center">
                  <img
                    src={pets.find((p) => p.id === selectedPet)?.image}
                    alt={pets.find((p) => p.id === selectedPet)?.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">
                      {pets.find((p) => p.id === selectedPet)?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {pets.find((p) => p.id === selectedPet)?.breed},
                      {pets.find((p) => p.id === selectedPet)?.age}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-700 mb-2">Services</h3>
              {selectedPackage !== null ? (
                <div>
                  <p className="font-medium">
                    {packages.find((p) => p.id === selectedPackage)?.name}{' '}
                    Package
                  </p>
                  <ul className="text-sm text-gray-600 mt-1">
                    {packages
                      .find((p) => p.id === selectedPackage)
                      ?.services.map((service, index) => (
                        <li key={index} className="flex items-center">
                          <CheckIcon className="w-4 h-4 text-green-500 mr-1" />
                          {service}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <ul className="space-y-1">
                  {selectedServices.map((serviceId) => {
                    const service = services.find((s) => s.id === serviceId)
                    return (
                      <li key={serviceId} className="flex justify-between">
                        <span>{service?.name}</span>
                        <span>${service?.price}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-700 mb-2">Appointment</h3>
              <p>
                Date:{' '}
                {new Date(appointmentDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p>Time: {appointmentTime}</p>
            </div>
            {specialNotes && (
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  Special Notes
                </h3>
                <p className="text-gray-600">{specialNotes}</p>
              </div>
            )}
            <div className="pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setShowSummary(false)}
              >
                Back to Edit
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                onClick={() =>
                  alert(
                    "Booking confirmed! You'll receive a confirmation email shortly.",
                  )
                }
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
