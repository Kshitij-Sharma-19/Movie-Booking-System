import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BreadcrumbHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get previous URL from browser history
  const handleGoBack = () => navigate(-1);

  // Convert path like "/movies/123" to ['Home', 'Movies', 'Movie Details']
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter(x => x);

    return ["Home", ...pathnames.map(name => {
      // Optional: you can customize dynamic route names here
      if (name.match(/^\d+$/)) return "Movie Details";
      return name.charAt(0).toUpperCase() + name.slice(1);
    })];
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        mb: 2, 
        gap: 1 
      }}
    >
      <IconButton onClick={handleGoBack} color="primary">
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="subtitle1" color="textSecondary">
        {getBreadcrumbs().join(" / ")}
      </Typography>
    </Box>
  );
};

export default BreadcrumbHeader;