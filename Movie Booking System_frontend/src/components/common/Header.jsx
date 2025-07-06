import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MovieIcon from "@mui/icons-material/Movie";
import LoginIcon from "@mui/icons-material/Login";
import { useNotify } from "../../context/NotificationContext";

import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/2.png";
import SearchBar from "../movies/SearchBar";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthContext();

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // for user menu

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {notifySuccess, notifyError } = useNotify();


  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    notifySuccess("Logged out successfully.");
  };

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      label: "Movies",
      path: "/movies",
      icon: <MovieIcon fontSize="small" />,
    },
    isAuthenticated && user.roles === "ROLE_ADMIN" && {
      label: "Admin",
      path: "/admin/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    !isAuthenticated && {
      label: "Login",
      path: "/login",
      icon: <LoginIcon fontSize="small" />,
    },
  ].filter(Boolean);

  const renderMenuButtons = () =>
    menuItems.map(({ label, path, icon }, i) => (
      <Button
        key={i}
        color="inherit"
        component={Link}
        to={path}
        startIcon={icon}
        sx={{ textTransform: "none" }}
      >
        {label}
      </Button>
    ));

  const renderDrawer = () => (
    <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
      <Box
        sx={{
          width: 250,
          p: 2,
          backgroundColor: "#041562",
          height: "100%",
          color: "white",
        }}
      >
        <List>
          {menuItems.map(({ label, path, icon }, i) => (
            <ListItem
              button
              key={i}
              onClick={() => {
                setMenuOpen(false);
              }}
              component={Link}
              to={path}
            >
              {icon}
              <ListItemText primary={label} sx={{ pl: 1 }} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#041562",
          "& a:hover": {
            color: "#FFD700",
          },
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          {/* Logo */}
          <IconButton
            edge="start"
            color="inherit"
            component={Link}
            to="/"
            sx={{ p: 0, "&:hover": { backgroundColor: "transparent" } }}
          >
            <Box
              component="img"
              src={logo}
              alt="CineShowtime Logo"
              sx={{
                height: { xs: 40, sm: 50 },
                width: "auto",
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease",
                },
              }}
            />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
            <SearchIcon />
          </IconButton>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={() => setMenuOpen(true)}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
              {renderDrawer()}
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>{renderMenuButtons()}</Box>
          )}

          {isAuthenticated && (
            <>
              <Tooltip title="User Options">
                <IconButton onClick={handleOpenUserMenu} sx={{ ml: 2 }}>
                  <Avatar sx={{ bgcolor: "#FFD700", color: "#041562" }}>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                  },
                }}
              >
              <MenuItem>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {user.sub}
                </Typography>
              </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/user/profile");
                    handleCloseUserMenu();
                  }}
                >
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                  View Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/user/bookings");
                    handleCloseUserMenu();
                  }}
                >
                  <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
                  Booking History
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Search Modal */}
      <SearchBar
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onResults={(r) => r}
      />
    </>
  );
};

export default Header;
