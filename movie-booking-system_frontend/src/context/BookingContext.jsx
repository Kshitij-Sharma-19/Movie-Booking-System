import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);

  return (
    <BookingContext.Provider
      value={{
        selectedShowtime,
        setSelectedShowtime,
        selectedSeats,
        setSelectedSeats,
        bookingDetails,
        setBookingDetails,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
