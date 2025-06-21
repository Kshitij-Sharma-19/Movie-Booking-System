import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import Layout from "./components/common/Layout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import SeatSelector from "./components/booking/SeatSelector";
import BookingSummary from "./components/booking/BookingSummary";
import BookingConfirmation from "./components/booking/BookingConfirmation";
import StripeCheckout from "./components/payment/StripeCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import TheaterManagement from "./components/admin/TheaterManagement";
import AdminDashboard from "./components/admin/AdminDashboard";
import MovieManagement from "./components/admin/MovieManagement";
import UserManagement from "./components/admin/UserManagement";
import BookingManagement from "./components/admin/BookingManagement";
import UserProfile from "./components/user/UserProfile.jsx";
import ShowtimeManagement from "./components/admin/ShowtimeManagement.jsx";

function App() {
  return (
    <Layout >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/booking/seats" element={<ProtectedRoute><SeatSelector /></ProtectedRoute>} />
        <Route path="/booking/summary" element={<ProtectedRoute><BookingSummary /></ProtectedRoute>} />
        <Route path="/booking/confirmed" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><StripeCheckout /></ProtectedRoute>} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/movies" element={<ProtectedRoute><MovieManagement /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
        <Route path="/admin/theaters" element={<ProtectedRoute><TheaterManagement /></ProtectedRoute>} />
        <Route path="/admin/showtimes" element={<ProtectedRoute><ShowtimeManagement /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;
