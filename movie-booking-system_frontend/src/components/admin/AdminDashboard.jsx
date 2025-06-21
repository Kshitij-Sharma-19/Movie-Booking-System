import React from "react";
import { Typography, Grid, Paper } from "@mui/material";
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
    <>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {sections.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate(item.route)}
            >
              <Typography variant="h6">{item.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AdminDashboard;
