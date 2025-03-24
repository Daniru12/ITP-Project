import React, { useState } from "react";
import { CreditCardIcon, BanknoteIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const PaymentCreate = ({ appointmentId, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle the payment submission
  const handlePaymentSubmit = async () => {
    setLoading(true);
    setError(null);

    // Basic validation for amount
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    // Additional validation for card details if payment method is Card
    if (paymentMethod === "Card") {
      if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
        setError("Please fill all card details.");
        setLoading(false);
        return;
      }
      if (!/^\d{16}$/.test(cardNumber)) {
        setError("Invalid card number. Must be 16 digits.");
        setLoading(false);
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError("Invalid CVV. Must be 3 or 4 digits.");
        setLoading(false);
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        setError("Invalid expiry date format. Use MM/YY.");
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/api/payment/create`,
        {
          appointment_id: appointmentId,
          amount,
          currency,
          payment_method: paymentMethod,
          card_details:
            paymentMethod === "Card"
              ? {
                  card_number: cardNumber,
                  card_holder_name: cardHolderName,
                  expiration_date: expiryDate,
                  cvv,
                }
              : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "Payment created successfully") {
        toast.success("Payment successful!");
        onPaymentSuccess();
      } else {
        toast.error(response.data.message || "Payment failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during payment.");
      toast.error(err.response?.data?.message || "An error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-[400px] mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Make a Payment</h2>

      {/* Amount and Currency Fields */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-3/4 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-1/4 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USD">USD</option>
            <option value="LKR">LKR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      {/* Payment Method Selection */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3 mt-3">Payment Method</h2>
      <div className="space-y-2 mb-4">
        {/* Credit Card Option */}
        <div
          className={`flex items-center p-2 border rounded-md cursor-pointer ${
            paymentMethod === "Card" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => setPaymentMethod("Card")}
        >
          <input
            type="radio"
            name="paymentMethod"
            checked={paymentMethod === "Card"}
            className="h-5 w-5 text-blue-600 mr-2"
          />
          <CreditCardIcon className="h-5 w-5 text-gray-700 mr-2" />
          <span className="font-medium text-sm">Credit or Debit Card</span>
        </div>

        {/* Cash Option */}
        <div
          className={`flex items-center p-2 border rounded-md cursor-pointer ${
            paymentMethod === "Cash" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => setPaymentMethod("Cash")}
        >
          <input
            type="radio"
            name="paymentMethod"
            checked={paymentMethod === "Cash"}
            className="h-5 w-5 text-blue-600 mr-2"
          />
          <BanknoteIcon className="h-5 w-5 text-gray-700 mr-2" />
          <span className="font-medium text-sm">Pay with Cash</span>
        </div>
      </div>

      {/* Card Details (Visible if Card is selected) */}
      {paymentMethod === "Card" && (
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Card Holder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Security Code</label>
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handlePaymentSubmit}
        disabled={loading}
        className={`w-full bg-blue-600 text-white p-2 rounded-md text-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-1 text-xs">{error}</p>}
    </div>
  );
};

export default PaymentCreate;
