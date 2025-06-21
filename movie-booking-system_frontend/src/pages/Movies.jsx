import React, { useState, useEffect } from "react";
import MovieCard from "../components/movies/MovieCard";
import SearchBar from "../components/movies/SearchBar";
import MovieFilter from "../components/movies/MovieFilter";
import { filterMovies, getAllMovies, searchMovies } from "../services/movieService";
import { Grid, Typography, Box } from "@mui/material";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");

  const fetchMovies = () => {
    getAllMovies().then((res) => setMovies(res.data));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (query) => {
    if (!query) return fetchMovies();
    searchMovies(query).then((res) => setMovies(res.data));
  };

  useEffect(() => {
    if (genre || rating) {
      filterMovies(genre, rating).then((res) => setMovies(res.data));
    }
  }, [genre, rating]);

  return (
    <Box>
      <Typography variant="h4" mb={2}>Browse Movies</Typography>
      {/* <Box display="flex" gap={2} mb={3}>
        <SearchBar onSearch={handleSearch} />
        <MovieFilter genre={genre} setGenre={setGenre} rating={rating} setRating={setRating} />
      </Box> */}
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Movies;
