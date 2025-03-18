import React, { useState } from 'react'
import { PawPrintIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { PetProfile } from './BookingSteps/PetProfile'
import { ServiceSelection } from './BookingSteps/ServiceSelection'
import { AppointmentBooking } from './BookingSteps/AppointmentBooking'
import { SpecialNotes } from './BookingSteps/SpecialNotes'
import { PackageOptions } from './BookingSteps/PackageOptions'
import { Summary } from './BookingSteps/Summary'
import { StepIndicator } from './BookingUI/StepIndicator'
export function PetCareBooking() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    pet: {
      name: '',
      breed: '',
      age: '',
      photo: null,
    },
    service: '',
    appointmentDate: null,
    appointmentTime: '',
    notes: '',
    package: null,
  })
  const steps = [
    {
      name: 'Pet Profile',
      component: <PetProfile formData={formData} setFormData={setFormData} />,
    },
    {
      name: 'Service',
      component: (
        <ServiceSelection formData={formData} setFormData={setFormData} />
      ),
    },
    {
      name: 'Appointment',
      component: (
        <AppointmentBooking formData={formData} setFormData={setFormData} />
      ),
    },
    {
      name: 'Package',
      component: (
        <PackageOptions formData={formData} setFormData={setFormData} />
      ),
    },
    {
      name: 'Notes',
      component: <SpecialNotes formData={formData} setFormData={setFormData} />,
    },
    {
      name: 'Summary',
      component: <Summary formData={formData} />,
    },
  ]
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  return (
    <div className="w-full min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <PawPrintIcon className="h-6 w-6 text-pink-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Book Your Pet Care Service
            </h1>
          </div>
          <div className="px-6 py-8">
            <StepIndicator
              steps={steps.map((step) => step.name)}
              currentStep={currentStep}
            />
            <div className="mt-8 min-h-[400px]">
              {steps[currentStep].component}
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                disabled={isFirstStep}
                className={`flex items-center px-6 py-3 rounded-lg ${isFirstStep ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Back
              </button>
              <button
                onClick={nextStep}
                className={`flex items-center px-6 py-3 rounded-lg ${isLastStep ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}
              >
                {isLastStep ? 'Confirm Booking' : 'Continue'}
                {!isLastStep && <ChevronRightIcon className="h-5 w-5 ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
