import React, { useState } from "react";
import { Typography, Box, IconButton, Link, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate } from "react-router-dom";


const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      textAlign: "center",
      py: 3,
      mt: 4,
      borderTop: "1px solid #ccc",
      width: "100%",
      bgcolor: "#041562;",
      color: "#fff",
    }}>
      <Box sx={{ mb: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
        {/* About Us Dialog opener */}
        <Button
          startIcon={<InfoOutlinedIcon />}
          sx={{
            color: "#fff",
            textTransform: "none",
            "&:hover": { color: "#90caf9", bgcolor: "transparent" }
          }}
          onClick={() => navigate("/about")}
        >
          About Us
        </Button>
        {/* Contact Us mailto */}
        <Button
          startIcon={<MailOutlineIcon />}
          sx={{
            color: "#fff",
            textTransform: "none",
            "&:hover": { color: "#90caf9", bgcolor: "transparent" }
          }}
          component={Link}
          onClick={() => navigate("/contact")}
        >
          Contact Us
        </Button>
        {/* Social Icons */}
        <IconButton
          component="a"
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#fff", "&:hover": { color: "#e1306c" } }}
        >
          <InstagramIcon />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#fff", "&:hover": { color: "#4267B2" } }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          component="a"
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#fff", "&:hover": { color: "#1da1f2" } }}
        >
          <XIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" color="inherit">
        &copy; {new Date().getFullYear()} CineShowtime. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;