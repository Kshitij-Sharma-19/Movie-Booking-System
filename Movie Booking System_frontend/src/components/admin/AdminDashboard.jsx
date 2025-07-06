import React from "react";
import { Typography, Grid, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Manage Movies", route: "/admin/movies" },
    { title: "Manage Theaters", route: "/admin/theaters" },
    { title: "Manage Users", route: "/admin/users" },
    { title: "Manage Showtime", route: "/admin/showtimes" },
    { title: "Manage Bookings", route: "/admin/bookings" }
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: "1200px",
        mx: "auto",
        mt: 4,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
      >
        Admin Dashboard
      </Typography>

      {/* First Row – 3 Items */}
      <Grid container spacing={4} justifyContent="center">
        {sections.slice(0, 3).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={4}
              onClick={() => navigate(item.route)}
              sx={{
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                transition: "all 0.3s ease",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#f0f4f8",
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <Typography variant="h6" fontWeight="medium" color="primary">
                {item.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Second Row – 2 Items */}
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        {sections.slice(3).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={4}
              onClick={() => navigate(item.route)}
              sx={{
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                transition: "all 0.3s ease",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#f0f4f8",
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <Typography variant="h6" fontWeight="medium" color="primary">
                {item.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
