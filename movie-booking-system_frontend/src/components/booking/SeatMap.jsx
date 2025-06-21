import React from "react";
import { Box, Typography } from "@mui/material";
import SeatGrid from "./SeatGrid";

const SeatMap = ({
  seats,
  selectedSeats,
  onSelect,
  movieName,
  theatreName,
  theatreAddress,
}) => {
  // Map selected seat ids to seatIdentifiers for display
  const selectedSeatNames = seats
    .filter(seat => selectedSeats.includes(seat.id))
    .map(seat => seat.seatIdentifier)
    .join(", ");

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f4f6fa",
        // width: "50%",                 // FULL viewport width
        maxWidth: "1800px",             // or whatever max you want
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {movieName && (
        <>
          <Typography variant="h5" fontWeight="bold" mb={1} color="#1e2a3a">
            {movieName}
          </Typography>
          <Typography variant="body1" color="#5b6b7e" mb={2}>
            {theatreName}, {theatreAddress}
          </Typography>
        </>
      )}

      {/* Wider fixed seat grid container */}
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <SeatGrid
          seats={seats}
          selectedSeats={selectedSeats}
          onSelect={onSelect}
        />
      </Box>

      <Box mt={4} color="#293241">
        <strong>Selected Seats:</strong>{" "}
        {selectedSeatNames.length ? selectedSeatNames : "None"}
      </Box>
    </Box>
  );
};

export default SeatMap;