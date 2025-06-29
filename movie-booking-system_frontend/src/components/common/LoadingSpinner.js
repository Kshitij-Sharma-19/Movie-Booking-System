import React from "react";
import { Box, Typography } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 10,
        height: "150px",
      }}
    >
      <Box
        sx={{
          width: "64px",
          height: "64px",
          border: "6px solid #e0e0e0",
          borderTop: "6px solid #1976d2",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Typography variant="subtitle1" sx={{ mt: 2, color: "text.secondary" }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
