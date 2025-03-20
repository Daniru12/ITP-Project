import React from 'react'
import { ShieldCheckIcon } from 'lucide-react'


const OrderSummary = ({ service, paymentMethod }) => {
  const subtotal = service.price
  const serviceFee = service.serviceFee
  const total = subtotal + serviceFee
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Order Summary
      </h2>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">{service.name}</span>
          <span className="text-gray-800">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Service Fee</span>
          <span className="text-gray-800">${serviceFee.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-lg">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition">
        Complete Booking
      </button>
      <div className="mt-6 flex items-start">
        <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600">
          Your payment is secure and you're protected by our 100% money back
          guarantee if the service isn\'t delivered as described.
        </p>
      </div>
      {paymentMethod === 'credit' && (
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-6 w-10 bg-gray-200 rounded"></div>
          <div className="h-6 w-10 bg-gray-200 rounded"></div>
          <div className="h-6 w-10 bg-gray-200 rounded"></div>
          <div className="h-6 w-10 bg-gray-200 rounded"></div>
        </div>
      )}
    </div>
  )
}
export default OrderSummary
