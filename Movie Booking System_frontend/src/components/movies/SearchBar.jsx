import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button,
  Box,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { filterMovies, searchMovies } from "../../services/movieService";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ open, onClose, onResults }) => {
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    date: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleSearch = async () => {
    const { name, city, date } = filters;
    try {
      if (city && date) {
        if (!name) {
          setError("Movie name is required for filtering.");
          return;
        }
        // Use filterMovies when city and date are present with name
        const res = await filterMovies(name, city, date);
        console.log("Filter Results:", res.data);
if (res.data && res.data.length > 0) {
  if (res.data.length === 1 && res.data[0].movie && res.data[0].movie.id) {
  setFilters({ name: "", city: "", date: "" });
  setError("");
  onClose();
  navigate(`/movies/${res.data[0].movie.id}`);
  return;
}
  onResults?.(res.data); // Pass results to parent if provided
  onClose();
} else {
  setError("No movies found with those filters.");
}
      } else if (name && !city && !date) {
        // Use searchMovies when only name is present
        const res = await searchMovies(name);
        const movie = res.data;
        if (movie && movie.id) {
          setFilters({ name: "", city: "", date: "" });
          setError("");
          onClose();
          navigate(`/movies/${movie.id}`);
        } else {
          setError("No movie found with that title.");
        }
      } else {
        setError("Please fill either only Movie Name, or all three fields (Movie Name, City, Date) to filter.");
      }
    } catch (err) {
      setError("No results found or something went wrong.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClose = () => {
    setFilters({ name: "", city: "", date: "" });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Search / Filter Movies
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} flexDirection="column" mt={1}>
          <TextField
            label="Movie Name"
            name="name"
            value={filters.name}
            onChange={handleChange}
            size="small"
            autoFocus
            onKeyDown={handleKeyDown}
            fullWidth
          />
          <TextField
            label="City"
            name="city"
            value={filters.city}
            onChange={handleChange}
            size="small"
            onKeyDown={handleKeyDown}
            fullWidth
          />
          <TextField
            label="Showtime Date"
            name="date"
            type="date"
            value={filters.date}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
            onKeyDown={handleKeyDown}
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{ backgroundColor: "#1976d2", color: "#fff",
            "&:hover": {
              backgroundColor: "#115293"
            } }}
        >
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchBar;