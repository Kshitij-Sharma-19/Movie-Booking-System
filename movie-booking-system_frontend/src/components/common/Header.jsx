import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { searchMovies } from "../../services/movieService";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthContext();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
  };

  const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  try {
    const res = await searchMovies(searchQuery);
    const movie = res.data;

    if (movie && movie.id) {
      setSearchOpen(false);        // Close modal
      setSearchQuery("");          // Reset search
      navigate(`/movies/${movie.id}`);  // Navigate to movie details
    } else {
      alert("No movie found with that title.");
    }
  } catch (error) {
    console.error("Search error:", error);
    alert("Something went wrong. Try again later.");
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <AppBar className="header"
        position="static"
        sx={{
          backgroundColor: "#041562",
          "& a:hover": {
            color: "#FFD700",
          },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
          >
            Movie Booking
          </Typography>

          <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
            <SearchIcon />
          </IconButton>

          <Button color="inherit" component={Link} to="/movies">
            Movies
          </Button>

          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate("/user/profile")} sx={{
    "&:hover": {
      color: "red",
    },
  }
  }>{user.sub}</Button>
              {user.roles === "ROLE_ADMIN" && (
                <Button component={Link} to="/admin/dashboard" color="inherit">
                  Admin
                </Button>
              )}
              <Button color="inherit" sx={{
    "&:hover": {
      color: "red",
    },
  }} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Search Modal */}
      <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Search Movies</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Movie Title"
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
