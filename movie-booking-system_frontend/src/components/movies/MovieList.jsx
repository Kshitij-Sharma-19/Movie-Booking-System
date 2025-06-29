import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../services/movieService";
import MovieCard from "./MovieCard";
import { Grid, Typography, Box } from "@mui/material";
import LoadingSpinner from "../common/LoadingSpinner";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMovies()
      .then(res => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading movies", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      width="100%"
      zIndex={1}
    >
      <LoadingSpinner />
    </Box>
  );

  return (
    <div>
      <Typography variant="h4" mb={3}>Now Showing</Typography>
      <Grid container>
        {movies.map((movie) => (
          <Grid item key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MovieList;