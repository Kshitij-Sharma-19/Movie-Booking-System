import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosInstance from "../../services/axiosInstance";
import {
  getAllMovies,
  getShowtimesByMovieId,
  deleteShowtime,
  getShowtimeById,
} from "../../services/movieService";
import {deinitializeSeatsForShowtime} from "../../services/bookingService";
import { getAllTheaters } from "../../services/adminService";
import { green, grey } from "@mui/material/colors";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ShowtimeManagement = () => {
  const theme = useTheme();

  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [showtimeData, setShowtimeData] = useState({
    movieId: "",
    theaterId: "",
    showtime: "",
    price: "",
    screenNumber: "",
    availableSeats: 300,
  });

  const [updateMovieId, setUpdateMovieId] = useState("");
  const [updateShowtimes, setUpdateShowtimes] = useState([]);
  const [selectedUpdateShowtimeId, setSelectedUpdateShowtimeId] = useState("");
  const [updateShowtimeData, setUpdateShowtimeData] = useState({
    movieId: "",
    theaterId: "",
    showtime: "",
    price: "",
    screenNumber: "",
    availableSeats: 300,
  });

  // --- STATE FOR DELETE SHOWTIME ---
  const [deleteMovieId, setDeleteMovieId] = useState("");
  const [deleteShowtimes, setDeleteShowtimes] = useState([]);
  const [selectedDeleteShowtimeId, setSelectedDeleteShowtimeId] = useState("");

  useEffect(() => {
    fetchMoviesAndTheaters();
  }, []);

  useEffect(() => {
    if (updateMovieId) {
      getShowtimesByMovieId(updateMovieId)
        .then((res) => setUpdateShowtimes(res.data))
        .catch(() => setUpdateShowtimes([]));
    } else {
      setUpdateShowtimes([]);
    }
    setSelectedUpdateShowtimeId("");
    setUpdateShowtimeData({
      movieId: "",
      theaterId: "",
      showtime: "",
      price: "",
      screenNumber: "",
      availableSeats: 300,
    });
  }, [updateMovieId]);

  useEffect(() => {
    if (selectedUpdateShowtimeId) {
      getShowtimeById(selectedUpdateShowtimeId)
        .then((res) => setUpdateShowtimeData(res.data))
        .catch(() => {});
    }
  }, [selectedUpdateShowtimeId]);

  useEffect(() => {
    if (deleteMovieId) {
      getShowtimesByMovieId(deleteMovieId)
        .then((res) => setDeleteShowtimes(res.data))
        .catch(() => setDeleteShowtimes([]));
    } else {
      setDeleteShowtimes([]);
    }
    setSelectedDeleteShowtimeId("");
  }, [deleteMovieId]);

  const fetchMoviesAndTheaters = async () => {
    try {
      const [movieRes, theaterRes] = await Promise.all([
        getAllMovies(),
        getAllTheaters(),
      ]);
      setMovies(movieRes.data);
      setTheaters(theaterRes.data);
    } catch (err) {
      setError("Error loading movies or theaters.");
    }
  };

  const handleChange = (field) => (event) => {
    setShowtimeData({ ...showtimeData, [field]: event.target.value });
  };

  const handleCreateShowtime = async () => {
    setSuccess(null);
    setError(null);

    const { movieId, theaterId, showtime, price, screenNumber } = showtimeData;

    if (!movieId || !theaterId || !showtime || !price || !screenNumber) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await axiosInstance.post(
        `${BASE_URL}/movie-catalog-service/api/v1/showtimes`,
        {
          price: Number(price),
          screenNumber: Number(screenNumber),
        }
      );
      setSuccess("Showtime created successfully!");
      setShowtimeData({
        movieId: "",
        theaterId: "",
        showtime: "",
        price: "",
        screenNumber: "",
        availableSeats: 300,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create showtime. Please try again."
      );
    }
  };

  const handleUpdateShowtimeField = (field) => (event) => {
    setUpdateShowtimeData({
      ...updateShowtimeData,
      [field]: event.target.value,
    });
  };

  const handleUpdateShowtime = async () => {
    setSuccess(null);
    setError(null);
    const { theaterId, showtime, price, screenNumber } = updateShowtimeData;
    if (!theaterId || !showtime || !price || !screenNumber) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      await axiosInstance.put(
        `${BASE_URL}/movie-catalog-service/api/v1/showtimes/${selectedUpdateShowtimeId}`,
        {
          ...updateShowtimeData,
          price: Number(price),
          screenNumber: Number(screenNumber),
        }
      );
      setSuccess("Showtime updated successfully!");
      setUpdateMovieId("");
      setUpdateShowtimes([]);
      setSelectedUpdateShowtimeId("");
      setUpdateShowtimeData({
        movieId: "",
        theaterId: "",
        showtime: "",
        price: "",
        screenNumber: "",
        availableSeats: 300,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to update showtime. Please try again."
      );
    }
  };

  const handleDeleteShowtime = async () => {
    setSuccess(null);
    setError(null);
    if (!selectedDeleteShowtimeId) {
      setError("Please select a showtime to delete.");
      return;
    }
    try {
      await deleteShowtime(selectedDeleteShowtimeId);
      await deinitializeSeatsForShowtime(selectedDeleteShowtimeId);
      setSuccess("Showtime deleted successfully!");
      setDeleteMovieId("");
      setDeleteShowtimes([]);
      setSelectedDeleteShowtimeId("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete showtime. Please try again."
      );
    }
  };

  // Custom styles for accordion summary and details
  const summarySx = {
    background:
      theme.palette.mode === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[100],
    borderRadius: 2,
    "& .MuiAccordionSummary-content": {
      alignItems: "center",
    },
  };
  const detailsSx = {
    background:
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.background.paper,
    borderRadius: 2,
    py: 3,
    px: 2,
    boxShadow: 2,
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        my: 4,
        p: 2,
        background: theme.palette.mode === "dark" ? "#181c24" : "#f4f7fa",
        borderRadius: 4,
        boxShadow: 4,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 4,
          letterSpacing: 2,
          fontWeight: 700,
          color: grey[900],
        }}
      >
        Showtime Management
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2, fontWeight: 500 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2, fontWeight: 500 }}>
          {error}
        </Alert>
      )}

      {/* CREATE SHOWTIME */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
          <Typography
            fontWeight={600}
            color={theme.palette.secondary.dark}
            fontSize="1.2rem"
            sx={{ color: "black" }}
          >
            Create Showtime
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailsSx}>
          <TextField
            select
            label="Select Movie"
            value={showtimeData.movieId}
            onChange={handleChange("movieId")}
            fullWidth
            margin="normal"
            required
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id}>
                {movie.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Theater"
            value={showtimeData.theaterId}
            onChange={handleChange("theaterId")}
            fullWidth
            margin="normal"
            required
          >
            {theaters.map((theater) => (
              <MenuItem key={theater.id} value={theater.id}>
                {theater.name} - {theater.city}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Showtime"
            type="datetime-local"
            value={showtimeData.showtime}
            onChange={handleChange("showtime")}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Price"
            type="number"
            value={showtimeData.price}
            onChange={handleChange("price")}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Screen Number"
            type="number"
            value={showtimeData.screenNumber}
            onChange={handleChange("screenNumber")}
            fullWidth
            margin="normal"
            required
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              fontWeight: 600,
              fontSize: 16,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 1,
              "&:hover": {
                color: "white",
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={handleCreateShowtime}
          >
            Create Showtime
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* UPDATE SHOWTIME */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
          <Typography fontWeight={600} color="orange" fontSize="1.2rem">
            Update Showtime
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailsSx}>
          <TextField
            select
            label="Select Movie to Update"
            value={updateMovieId}
            onChange={(e) => setUpdateMovieId(e.target.value)}
            fullWidth
            margin="normal"
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id}>
                {movie.title}
              </MenuItem>
            ))}
          </TextField>

          {updateShowtimes.length > 0 && (
            <TextField
              select
              label="Select Showtime"
              value={selectedUpdateShowtimeId}
              onChange={(e) => setSelectedUpdateShowtimeId(e.target.value)}
              fullWidth
              margin="normal"
            >
              {updateShowtimes.map((showtime) => (
                <MenuItem key={showtime.id} value={showtime.id}>
                  {new Date(showtime.showtime).toLocaleString()} - Screen{" "}
                  {showtime.screenNumber}
                </MenuItem>
              ))}
            </TextField>
          )}

          {selectedUpdateShowtimeId && (
            <>
              <TextField
                select
                label="Select Theater"
                value={updateShowtimeData.theaterId}
                onChange={handleUpdateShowtimeField("theaterId")}
                fullWidth
                margin="normal"
                required
              >
                {theaters.map((theater) => (
                  <MenuItem key={theater.id} value={theater.id}>
                    {theater.name} - {theater.city}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Showtime"
                type="datetime-local"
                value={
                  updateShowtimeData.showtime
                    ? updateShowtimeData.showtime.slice(0, 16)
                    : ""
                }
                onChange={handleUpdateShowtimeField("showtime")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Price"
                type="number"
                value={updateShowtimeData.price}
                onChange={handleUpdateShowtimeField("price")}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Screen Number"
                type="number"
                value={updateShowtimeData.screenNumber}
                onChange={handleUpdateShowtimeField("screenNumber")}
                fullWidth
                margin="normal"
                required
              />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  fontSize: 16,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 1,
                  "&:hover": {
                    color: "white",
                    backgroundColor: "#7B1FA2",
                  },
                }}
                onClick={handleUpdateShowtime}
              >
                Update Showtime
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* DELETE SHOWTIME */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
          <Typography fontWeight={600} color="#D32F2F" fontSize="1.2rem">
            Delete Showtime
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={detailsSx}>
          <TextField
            select
            label="Select Movie"
            value={deleteMovieId}
            onChange={(e) => setDeleteMovieId(e.target.value)}
            fullWidth
            margin="normal"
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id}>
                {movie.title}
              </MenuItem>
            ))}
          </TextField>
          {deleteShowtimes.length > 0 && (
            <TextField
              select
              label="Select Showtime"
              value={selectedDeleteShowtimeId}
              onChange={(e) => setSelectedDeleteShowtimeId(e.target.value)}
              fullWidth
              margin="normal"
            >
              {deleteShowtimes.map((showtime) => (
                <MenuItem key={showtime.id} value={showtime.id}>
                  {new Date(showtime.showtime).toLocaleString()} - Screen{" "}
                  {showtime.screenNumber}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{
              mt: 2,
              fontWeight: 600,
              fontSize: 16,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
            onClick={handleDeleteShowtime}
            disabled={!selectedDeleteShowtimeId}
          >
            Delete Showtime
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ShowtimeManagement;