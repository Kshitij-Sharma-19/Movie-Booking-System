import React, { useEffect, useState } from "react";
import { getMovieById, getShowtimesByMovieId } from "../services/movieService";
import { useParams, Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  Paper,
  Chip,
  Avatar,
  Divider,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Rating,
  TextField,
  MenuItem,
  Pagination,
} from "@mui/material";
import { Movie, AccessTime, Person, CalendarToday, Star, Movie as MovieIcon } from "@mui/icons-material";
import { formatReleaseDate } from "../utils/dateUtils.js";

const OMDB_API_KEY = "OMDB_API";

const fetchOmdbData = async (title, year) => {
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}${year ? `&y=${year}` : ""}&apikey=${OMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch OMDb data");
  return res.json();
};

const DEFAULT_PAGE_SIZE = 5;

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [fullShowtimes, setFullShowtimes] = useState([]);   // All showtimes from backend
  const [filteredShowtimes, setFilteredShowtimes] = useState([]); // Showtimes after client-side filter
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [omdb, setOmdb] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  // Filters
  const [city, setCity] = useState("");
  const [date, setDate] = useState(""); // ISO string (YYYY-MM-DD)
  const [availableCities, setAvailableCities] = useState([]);

  const handleDummyClick = (event) => event.preventDefault();

  // Fetch movie details
  useEffect(() => {
    getMovieById(id)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Fetch OMDb info when movie loaded
  useEffect(() => {
    if (movie?.title) {
      fetchOmdbData(movie.title, movie.releaseDate?.slice(0, 4))
        .then((data) => {
          if (data && data.Response === "True") setOmdb(data);
          else setOmdb(null);
        })
        .catch(() => setOmdb(null));
    }
  }, [movie]);

  // Fetch all showtimes and set available cities
  useEffect(() => {
    setLoadingShowtimes(true);
    getShowtimesByMovieId(id)
      .then((res) => {
        const data = res.data || [];
        setFullShowtimes(data);
        setFilteredShowtimes(data);

        // Get unique cities for filter dropdown
        const cities = Array.from(new Set(data.map(st => st.theater?.city).filter(Boolean)));
        setAvailableCities(cities);
      })
      .catch(() => {
        setFullShowtimes([]);
        setFilteredShowtimes([]);
        setAvailableCities([]);
      })
      .finally(() => setLoadingShowtimes(false));
  }, [id]);

  // Filter showtimes whenever city/date changes
  useEffect(() => {
    let filtered = fullShowtimes;

    if (city) {
      filtered = filtered.filter(st => st.theater?.city === city);
    }
    if (date) {
      filtered = filtered.filter(st => {
        // Compare only the date portion (YYYY-MM-DD)
        const showtimeDate = new Date(st.showtime);
        const showtimeDateString = showtimeDate.toISOString().slice(0, 10);
        return showtimeDateString === date;
      });
    }
    setFilteredShowtimes(filtered);
    setPage(1); // Reset to first page on filter change
  }, [city, date, fullShowtimes]);

  // Pagination logic
  const totalPages = Math.ceil(filteredShowtimes.length / pageSize);
  const pagedShowtimes = filteredShowtimes.slice((page - 1) * pageSize, page * pageSize);

  if (!movie)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6">Loading movie...</Typography>
      </Box>
    );

  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={5} p={3} alignItems="flex-start">
      {/* Poster */}
      <Paper elevation={3} sx={{ width: 320, minWidth: 260, maxWidth: 350, p: 2, mb: { xs: 3, md: 0 } }}>
        <Box
          component="img"
          src={movie.posterUrl}
          alt={movie.title}
          sx={{
            width: "100%",
            height: 450,
            borderRadius: 2,
            objectFit: "cover",
            mb: 2,
            boxShadow: 2,
          }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" >
          {movie.genre.split(",").map((g) => (
            <Chip
              key={g.trim()}
              label={g.trim()}
              color="primary"
              size="small"
              sx={{ fontWeight: 500, mb: 1, cursor: "default",}}
              icon={<MovieIcon fontSize="small" />}
              onClick={handleDummyClick}
            />
          ))}
        </Stack>
      </Paper>

      {/* Details */}
      <Box flex="1">
        <Typography variant="h3" fontWeight={700} gutterBottom>
          {movie.title}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Chip
            icon={<CalendarToday fontSize="small" />}
            label={formatReleaseDate(movie.releaseDate)}
            size="small"
            sx={{ fontWeight: 500 }}
            onClick={handleDummyClick}
          />
          <Chip
            icon={<AccessTime fontSize="small" />}
            label={`${movie.durationMinutes} mins`}
            size="small"
            sx={{ fontWeight: 500 }}
            onClick={handleDummyClick}
          />
          {/* IMDb Rating from OMDb */}
          {omdb && omdb.imdbRating && omdb.imdbID && (
            <Chip
              icon={<Star fontSize="small" sx={{ color: "#F5C518" }} />}
              label={`IMDb: ${omdb.imdbRating}/10`}
              color="secondary"
              size="small"
              component="a"
              href={`https://www.imdb.com/title/${omdb.imdbID}/`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": { color: "white" },
              }}
              clickable
              onClick={ () => {
                {`https://www.imdb.com/title/${omdb.imdbID}/`}
              }}
            />
          )}
        </Stack>
        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          Directed by <b>{movie.director}</b>
        </Typography>
        <Typography variant="body1" mb={2}>
          {movie.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Main Cast
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {movie.castMembers.split(",").map((member) => (
            <Chip
              key={member.trim()}
              avatar={<Avatar><Person /></Avatar>}
              label={member.trim()}
              variant="outlined"
              sx={{ mb: 1 }}
              onClick={handleDummyClick}
            />
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        {/* OMDb Review Card */}
        {omdb && (
          <Card variant="outlined" sx={{ mb: 2, mt: 2, background: "#faf7ee" }}>
            <CardHeader
              title="IMDb & OMDb Info"
              subheader={omdb.Title && omdb.Year ? `${omdb.Title} (${omdb.Year})` : ""}
              avatar={
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                  alt="IMDb"
                  width={32}
                  style={{ background: "#fff", borderRadius: 4 }}
                />
              }
            />
            <CardContent>
              <Stack direction="row" gap={2} alignItems="center" mb={1} flexWrap="wrap">
                <Typography variant="caption">
                  <b>Country:</b>{" "}
                  {omdb.Title === "Alpha"
                    ? "India"
                    : omdb.Country
                      ? omdb.Country
                      : "India"}
                </Typography>
                <Typography variant="caption">
                  <b>Language:</b> {omdb.Language}
                </Typography>
              </Stack>
              {omdb.imdbRating && omdb.imdbRating !== "N/A" && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    name="imdb-rating"
                    value={parseFloat(omdb.imdbRating) / 2}
                    precision={0.1}
                    max={5}
                    readOnly
                    sx={{ color: "#F5C518", marginBottom: "2rem" }}
                  />
                  <Typography variant="body2">{omdb.imdbRating} / 10</Typography>
                </Stack>
              )}
              <br />
              {/* Embedded Trailer using imdbID */}
              {omdb.imdbID && movie.trailerYoutubeId && (
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
              {/* IMDb Review Button */}
              {omdb.imdbID && (
                <Button
                  variant="outlined"
                  color="secondary"
                  href={`https://www.imdb.com/title/${omdb.imdbID}/reviews`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1, fontWeight: 500 }}
                >
                  Read IMDb Reviews
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Divider sx={{ my: 2 }} />
        <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 1 }}>
          <Typography variant="h5" gutterBottom>
            Available Showtimes
          </Typography>
          <Stack direction="row" spacing={2} mb={2} alignItems="center">
            <TextField
              select
              label="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              sx={{ minWidth: 120 }}
              size="small"
            >
              <MenuItem value="">All</MenuItem>
              {availableCities.map(cityOption => (
                <MenuItem key={cityOption} value={cityOption}>{cityOption}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date"
              type="date"
              size="small"
              value={date}
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            {/* Filter is now instant on change, but you can keep the button if you want */}
            {/* <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={() => setPage(1)}
              sx={{ ml: 1 }}
            >
              Filter
            </Button> */}
          </Stack>

          {loadingShowtimes ? (
            <Typography>Loading showtimes...</Typography>
          ) : pagedShowtimes.length === 0 ? (
            <Typography color="text.secondary" fontStyle="italic">
              No showtimes available for this movie.
            </Typography>
          ) : (
            <>
              <List>
                {pagedShowtimes.map((showtime) => {
                  const showtimeDate = new Date(showtime.showtime);
                  const isPastShowtime = showtimeDate < new Date();
                  return (
                    <ListItem
                      key={showtime.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px dashed rgba(0, 0, 0, 0.96)",
                        py: 1.5,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {showtimeDate.toLocaleString("en-IN", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "normal", wordBreak: "break-word", display: "inline-block", maxWidth: "300px" }}>
                          {showtime.theater.name} &mdash; {showtime.theater.address} &mdash; Screen {showtime.screenNumber || 1}
                        </Typography>
                      </Box>
                      {isPastShowtime ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="medium"
                          disabled
                          sx={{ backgroundColor: "#ccc", color: "#666" }}
                        >
                          Showtime Passed
                        </Button>
                      ) : (
                        <Link
                          to={`/booking/seats?movieId=${movie.id}&showtimeId=${showtime.id}`}
                          state={{
                            movieName: movie.title,
                            theatreName: showtime.theater.name,
                            theaterLocation: showtime.theater.address,
                            showtimeId: showtime.id,
                            posterUrl: movie.posterUrl,
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            sx={{
                              backgroundColor: "#1976d2",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: "#115293",
                              },
                            }}
                          >
                            Book Showtime
                          </Button>
                        </Link>
                      )}
                    </ListItem>
                  );
                })}
              </List>
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MovieDetail;