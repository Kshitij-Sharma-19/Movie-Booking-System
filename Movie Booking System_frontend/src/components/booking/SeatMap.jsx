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
    width: "100%",
    maxWidth: "1800px",
    margin: "0 auto",
    boxSizing: "border-box",
    overflowX: "auto", // Important for responsive view
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

<Box mt={3} display="flex" justifyContent="center" gap={4}>
  <Box display="flex" alignItems="center" gap={1}>
    <Box sx={{ width: 20, height: 20, bgcolor: "#43a047", borderRadius: 1, border: "1px solid #1b5e20" }} />
    <Typography variant="body2">Available</Typography>
  </Box>
  <Box display="flex" alignItems="center" gap={1}>
    <Box sx={{ width: 20, height: 20, bgcolor: "#ffd166", borderRadius: 1, border: "1px solid #ffae00" }} />
    <Typography variant="body2">Selected</Typography>
  </Box>
  <Box display="flex" alignItems="center" gap={1}>
    <Box sx={{ width: 20, height: 20, bgcolor: "#b0bec5", borderRadius: 1, border: "1px solid #78909c" }} />
    <Typography variant="body2">Booked</Typography>
  </Box>
</Box>
<br/>
      {/* Wider fixed seat grid container */}
      <Box sx={{ width: "80%" }}>
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