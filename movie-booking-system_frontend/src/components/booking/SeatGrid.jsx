import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";

// Helper: get row letter from seatIdentifier ("A1" => "A")
const getRow = seatIdentifier => seatIdentifier.match(/^[A-Z]+/i)[0];
// Helper: get seat number from seatIdentifier ("A1" => 1)
const getNumber = seatIdentifier => parseInt(seatIdentifier.match(/\d+$/)[0], 10);

const extremeLeftCols = [1, 2];
const middleCols = [3, 4, 5, 6, 7, 8];
const extremeRightCols = [9, 10];

const SeatGrid = ({ seats, selectedSeats, onSelect }) => {
  // Build {row: {extremeLeft:[], middle:[], extremeRight:[]}}
  const seatRows = {};
  seats.forEach(seat => {
    const row = getRow(seat.seatIdentifier);
    const num = getNumber(seat.seatIdentifier);
    if (!seatRows[row]) seatRows[row] = { extremeLeft: [], middle: [], extremeRight: [] };
    if (num <= 2) seatRows[row].extremeLeft.push(seat);
    else if (num >= 3 && num <= 8) seatRows[row].middle.push(seat);
    else seatRows[row].extremeRight.push(seat);
  });

  // Sorted row keys (Z to A)
  const rowKeys = Object.keys(seatRows).sort().reverse();

  // Selection logic
  const toggleSeat = seat => {
    if (seat.status === "BOOKED") return;
    if (selectedSeats.includes(seat.id)) {
      onSelect(selectedSeats.filter(id => id !== seat.id));
    } else {
      onSelect([...selectedSeats, seat.id]);
    }
  };

  return (
    <Box textAlign="center">
      {/* Column labels */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
        <Box width={34} /> {/* Spacer for row label */}
        {extremeLeftCols.map((col) => (
          <Typography key={`el${col}`} width={28} color="#758ca3">{col}</Typography>
        ))}
        <Box width={16} /> {/* Gap between extreme left and middle */}
        {middleCols.map((col) => (
          <Typography key={`m${col}`} width={28} color="#758ca3">{col}</Typography>
        ))}
        <Box width={16} /> {/* Gap between middle and extreme right */}
        {extremeRightCols.map((col) => (
          <Typography key={`er${col}`} width={28} color="#758ca3">{col}</Typography>
        ))}
      </Box>

      {/* Grid */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        {rowKeys.map(row => (
          <Box key={row} display="flex" alignItems="center">
            {/* Row label */}
            <Typography
              width={34}
              fontWeight="bold"
              color="#758ca3"
              textAlign="center"
              sx={{ lineHeight: "28px" }}
            >
              {row}
            </Typography>
            {/* Extreme Left seats 1-2 */}
            {seatRows[row].extremeLeft
              .sort((a, b) => getNumber(a.seatIdentifier) - getNumber(b.seatIdentifier))
              .map(seat => (
                <Tooltip title={seat.seatIdentifier} key={seat.id}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "4px",
                      background: selectedSeats.includes(seat.id)
                        ? "#ffd166"
                        : seat.status === "BOOKED"
                        ? "#b0bec5"
                        : "#43a047",
                      border: "1.5px solid #1b5e20",
                      cursor: seat.status === "BOOKED" ? "not-allowed" : "pointer",
                    }}
                    onClick={() => toggleSeat(seat)}
                  />
                </Tooltip>
              ))}
            {/* Gap between extreme left and middle */}
            <Box width={16} />
            {/* Middle seats 3-8 */}
            {seatRows[row].middle
              .sort((a, b) => getNumber(a.seatIdentifier) - getNumber(b.seatIdentifier))
              .map(seat => (
                <Tooltip title={seat.seatIdentifier} key={seat.id}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "4px",
                      background: selectedSeats.includes(seat.id)
                        ? "#ffd166"
                        : seat.status === "BOOKED"
                        ? "#b0bec5"
                        : "#43a047",
                      border: "1.5px solid #1b5e20",
                      cursor: seat.status === "BOOKED" ? "not-allowed" : "pointer",
                    }}
                    onClick={() => toggleSeat(seat)}
                  />
                </Tooltip>
              ))}
            {/* Gap between middle and extreme right */}
            <Box width={16} />
            {/* Extreme Right seats 9-10 */}
            {seatRows[row].extremeRight
              .sort((a, b) => getNumber(a.seatIdentifier) - getNumber(b.seatIdentifier))
              .map(seat => (
                <Tooltip title={seat.seatIdentifier} key={seat.id}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "4px",
                      background: selectedSeats.includes(seat.id)
                        ? "#ffd166"
                        : seat.status === "BOOKED"
                        ? "#b0bec5"
                        : "#43a047",
                      border: "1.5px solid #1b5e20",
                      cursor: seat.status === "BOOKED" ? "not-allowed" : "pointer",
                    }}
                    onClick={() => toggleSeat(seat)}
                  />
                </Tooltip>
              ))}
          </Box>
        ))}
      </Box>

      {/* SCREEN at the bottom */}
      <Box mt={3}>
        <Typography variant="subtitle1" color="#37474f" fontWeight="bold">
          SCREEN
        </Typography>
        <Box
          sx={{
            width: 250,
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