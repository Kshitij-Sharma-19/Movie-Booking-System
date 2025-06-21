import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../services/movieService";
import MovieCard from "./MovieCard";
import { Grid, Typography } from "@mui/material";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getAllMovies()
      .then((res) => setMovies(res.data))
      .catch((err) => console.error("Error loading movies", err));
  }, []);

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
