import React, { useState } from 'react'
import ServiceSummary from './ServiceSummary'
import PaymentForm from './PaymentForm'
import OrderSummary from './OrderSummary'
import { ArrowLeftIcon } from 'lucide-react'

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit')
  // Sample data - in a real app this would come from your state management or API
  const serviceData = {
    name: 'Pet Sitting',
    description: 'In-home pet sitting service',
    date: 'May 15, 2023',
    time: '10:00 AM - 2:00 PM',
    duration: '4 hours',
    pet: {
      name: 'Max',
      type: 'Dog',
      breed: 'Golden Retriever',
      image:
        'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z29sZGVuJTIwcmV0cmlldmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    },
    provider: {
      name: 'Sarah Johnson',
      rating: 4.9,
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    },
    price: 45.0,
    serviceFee: 5.0,
  }
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span>Back to services</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Complete Your Booking
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <ServiceSummary service={serviceData} />
            <PaymentForm
              paymentMethod={paymentMethod}
              onPaymentMethodChange={handlePaymentMethodChange}
            />
          </div>
          <div className="lg:w-1/3">
            <OrderSummary service={serviceData} paymentMethod={paymentMethod} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default PaymentPage
