import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import SeatSelector from "../components/booking/SeatSelector.jsx";
import BookingSummary from "../components/booking/BookingSummary";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import StripeCheckout from "../components/payment/StripeCheckout";
import PaymentSuccess from "../components/payment/PaymentSuccess";
import PaymentCancel from "../components/payment/PaymentCancel";

const Booking = () => {
  return (
    <Routes>
      <Route
        path="/seats"
        element={
          <ProtectedRoute>
            <SeatSelector />
          </ProtectedRoute>
        }
      />
      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <BookingSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirmed"
        element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <StripeCheckout />
          </ProtectedRoute>
        }
      />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
    </Routes>
  );
};

export default Booking;