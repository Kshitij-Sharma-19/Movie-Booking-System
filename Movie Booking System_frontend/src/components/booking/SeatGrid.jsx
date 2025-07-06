import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import {renderColumnNumbers} from "../../utils/helpers"; // Assuming you have a helper for rendering column numbers
// Helpers
const getRow = seatIdentifier => seatIdentifier.match(/^[A-Z]+/i)[0];
const getNumber = seatIdentifier => parseInt(seatIdentifier.match(/\d+$/)[0], 10);

const SeatGrid = ({ seats, selectedSeats, onSelect }) => {
  const seatRows = {};
  seats.forEach(seat => {
    const row = getRow(seat.seatIdentifier);
    if (!seatRows[row]) seatRows[row] = [];
    seatRows[row].push(seat);
  });

  // Split row keys
  const leftRows = Array.from({ length: 13 }, (_, i) => String.fromCharCode(65 + i)); // A–M
  const rightRows = Array.from({ length: 13 }, (_, i) => String.fromCharCode(78 + i)); // N–Z

  const toggleSeat = seat => {
    if (seat.status === "BOOKED") return;
    onSelect(
      selectedSeats.includes(seat.id)
        ? selectedSeats.filter(id => id !== seat.id)
        : [...selectedSeats, seat.id]
    );
  };

  // Helper to render seats from an array of column numbers
  function renderSeats(row, cols) {
    return cols.map(n => renderSeat(row, n));
  }

  // Renders a seat box
  function renderSeat(row, colNumber) {
    const seatId = `${row}${colNumber}`;
    const seat = seatRows[row]?.find(s => s.seatIdentifier === seatId);
    if (!seat) return <Box key={`${row}${colNumber}`} width={28} height={28} />;
    const isSelected = selectedSeats.includes(seat.id);
    const color = isSelected
      ? "#ffd166"
      : seat.status === "BOOKED"
      ? "#b0bec5"
      : "#43a047";

    return (
      <Tooltip title={seat.seatIdentifier} key={seat.id}>
        <Box
          sx={{
            width: 28,
            height: 28,
            minWidth: 28,
            borderRadius: "4px",
            background: color,
            border: "1.5px solid #1b5e20",
            cursor: seat.status === "BOOKED" ? "not-allowed" : "pointer",
            mx: 0.25,
          }}
          onClick={() => toggleSeat(seat)}
        />
      </Tooltip>
    );
  }

  // For header alignment
  const maxRows = Math.max(leftRows.length, rightRows.length);

  return (
    <Box textAlign="center">
      {/* Column Labels */}
    <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
  {renderColumnNumbers(leftRows[0], rightRows[0])}
</Box>
     

      {/* Seat Rows, render left and right side by side */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        {Array.from({ length: maxRows }, (_, i) => {
          const leftRow = leftRows[i];
          const rightRow = rightRows[i];
          return (
            <Box key={i} display="flex" alignItems="center">
              {/* Left side: A-M */}
              {leftRow ? (
                <>
                  <Typography
                    width={34}
                    fontWeight="bold"
                    color="#758ca3"
                    textAlign="center"
                    sx={{ lineHeight: "28px" }}
                  >
                    {leftRow}
                  </Typography>
                  {renderSeats(leftRow, [1, 2, 3])}
                  <Box width={16} />
                  {renderSeats(leftRow, [4, 5, 6, 7, 8, 9, 10])}
                </>
              ) : (
                // Empty space for alignment if no left row
                <Box width={34 + 3 * 28 + 16 + 7 * 28} height={28} />
              )}
              <Box width={40} />
              {/* Right side: N-Z */}
              {rightRow ? (
                <>
                  <Typography
                    width={34}
                    fontWeight="bold"
                    color="#758ca3"
                    textAlign="center"
                    sx={{ lineHeight: "28px" }}
                  >
                    {rightRow}
                  </Typography>
                  {renderSeats(rightRow, [1, 2, 3, 4, 5, 6, 7])}
                  <Box width={16} />
                  {renderSeats(rightRow, [8, 9, 10])}
                </>
              ) : null}
            </Box>
          );
        })}
      </Box>

      {/* SCREEN */}
      <Box mt={3}>
        <Typography variant="subtitle1" color="#37474f" fontWeight="bold">
          SCREEN
        </Typography>
        <Box
          sx={{
            width: 350,
            height: 5,
            mx: "auto",
            background: "#bdbdbd",
            borderRadius: 2,
            my: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default SeatGrid;