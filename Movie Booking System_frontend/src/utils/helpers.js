import React from "react";
import { Typography, Box } from "@mui/material";

export function renderColumnNumbers() {
  // Box styles for a "seat-like" number box
  const numberBoxSx = {
    width: 28,
    height: 28,
    minWidth: 28,
    borderRadius: "4px",
    background: "#f4f6fa",
    border: "1.5px solidrgb(255, 255, 255)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mx: 0.25,
  };

  return (
    <Box display="flex" alignItems="center">
      {/* Left section: Row letter A-M placeholder */}
      <Box width={34} />
      {/* Left seats 1-3 */}
      {[1, 2, 3].map(n => (
        <Box key={`A${n}`} sx={numberBoxSx}>
          <Typography
            color="#758ca3"
            fontSize="1rem"
            fontWeight="bold"
            sx={{ m: 0, p: 0, lineHeight: 1 }}
          >{n}</Typography>
        </Box>
      ))}
      {/* Gap between 3 and 4 */}
      <Box width={16} />
      {/* Left seats 4-10 */}
      {[4, 5, 6, 7, 8, 9, 10].map(n => (
        <Box key={`A${n}`} sx={numberBoxSx}>
          <Typography
            color="#758ca3"
            fontSize="1rem"
            fontWeight="bold"
            sx={{ m: 0, p: 0, lineHeight: 1 }}
          >{n}</Typography>
        </Box>
      ))}
      {/* Big gap between left and right */}
      <Box width={40} />
      {/* Right section: Row letter N-Z placeholder */}
      <Box width={34} />
      {/* Right seats 1-7 */}
      {[1, 2, 3, 4, 5, 6, 7].map(n => (
        <Box key={`N${n}`} sx={numberBoxSx}>
          <Typography
            color="#758ca3"
            fontSize="1rem"
            fontWeight="bold"
            sx={{ m: 0, p: 0, lineHeight: 1 }}
          >{n}</Typography>
        </Box>
      ))}
      {/* Gap between 7 and 8 */}
      <Box width={16} />
      {/* Right seats 8-10 */}
      {[8, 9, 10].map(n => (
        <Box key={`N${n}`} sx={numberBoxSx}>
          <Typography
            color="#758ca3"
            fontSize="1rem"
            fontWeight="bold"
            sx={{ m: 0, p: 0, lineHeight: 1 }}
          >{n}</Typography>
        </Box>
      ))}
    </Box>
  );
}