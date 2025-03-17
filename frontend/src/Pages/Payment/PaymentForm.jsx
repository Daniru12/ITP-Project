import React from 'react'
import { CreditCardIcon, SmartphoneIcon, BanknoteIcon } from 'lucide-react'
const PaymentForm = ({ paymentMethod, onPaymentMethodChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Payment Method
      </h2>
      <div className="space-y-4 mb-6">
        <div
          className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'credit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          onClick={() => onPaymentMethodChange('credit')}
        >
          <div className="h-6 w-6 mr-3">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'credit'}
              onChange={() => onPaymentMethodChange('credit')}
              className="h-6 w-6 text-blue-600"
            />
          </div>
          <CreditCardIcon className="h-6 w-6 text-gray-700 mr-3" />
          <span className="font-medium">Credit or Debit Card</span>
        </div>
        <div
          className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'mobile' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          onClick={() => onPaymentMethodChange('mobile')}
        >
          <div className="h-6 w-6 mr-3">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'mobile'}
              onChange={() => onPaymentMethodChange('mobile')}
              className="h-6 w-6 text-blue-600"
            />
          </div>
          <SmartphoneIcon className="h-6 w-6 text-gray-700 mr-3" />
          <span className="font-medium">Mobile Payment</span>
        </div>
        <div
          className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          onClick={() => onPaymentMethodChange('cash')}
        >
          <div className="h-6 w-6 mr-3">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'cash'}
              onChange={() => onPaymentMethodChange('cash')}
              className="h-6 w-6 text-blue-600"
            />
          </div>
          <BanknoteIcon className="h-6 w-6 text-gray-700 mr-3" />
          <span className="font-medium">Pay with Cash</span>
        </div>
      </div>
      {paymentMethod === 'credit' && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                placeholder="MM/YY"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Security Code
              </label>
              <input
                type="text"
                id="cvv"
                placeholder="CVV"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="nameOnCard"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name on Card
            </label>
            <input
              type="text"
              id="nameOnCard"
              placeholder="John Doe"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
      {paymentMethod === 'mobile' && (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-700 mb-2">
            Scan the QR code with your mobile payment app
          </p>
          <div className="bg-white p-4 inline-block rounded-md">
            <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">QR Code Placeholder</span>
            </div>
          </div>
        </div>
      )}
      {paymentMethod === 'cash' && (
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">
            You will pay the provider directly at the time of service.
          </p>
        </div>
      )}
    </div>
  )
}
export default PaymentForm
