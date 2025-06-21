import React, { useEffect, useState } from "react";
import { getMovieById } from "../services/movieService";
import { getShowtimesByMovieId } from "../services/movieService";
import { useParams, Link } from "react-router-dom";
import { Typography, Box, Button, List, ListItem } from "@mui/material";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);

  useEffect(() => {
    getMovieById(id)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (id) {
      setLoadingShowtimes(true);
      getShowtimesByMovieId(id)
        .then((res) => setShowtimes(res.data))
        .catch((err) => setShowtimes([]))
        .finally(() => setLoadingShowtimes(false));
    }
  }, [id]);

  if (!movie) return <Typography>Loading movie...</Typography>;

  return (
    <Box>
      <Typography variant="h4">{movie.title}</Typography>
      <Typography variant="subtitle1">
        {movie.genre} | {movie.duration} mins | {new Date(movie.releaseDate).toLocaleDateString()}
      </Typography>
      <Typography mt={2}>{movie.description}</Typography>

      <Box mt={3}>
        <Typography variant="h6">Available Showtimes</Typography>
        {loadingShowtimes ? (
          <Typography>Loading showtimes...</Typography>
        ) : showtimes.length === 0 ? (
          <Typography>No showtimes available for this movie.</Typography>
        ) : (
          <List>
            {showtimes.map((showtime) => (
              <ListItem key={showtime.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>
                  {new Date(showtime.showtime).toLocaleString()} &mdash; {showtime.screenNumber}
                </span>
                <Link
  to={`/booking/seats?movieId=${movie.id}&showtimeId=${showtime.id}`}
  state={{ movieName: movie.title, theatreName: showtime.theater.name, theaterLocation: showtime.theater.address,showtimeId: showtime.id, }}
  style={{ textDecoration: "none" }}
>
                  <Button variant="contained" color="primary">
                    Book Showtime
                  </Button>
                </Link>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default MovieDetail;