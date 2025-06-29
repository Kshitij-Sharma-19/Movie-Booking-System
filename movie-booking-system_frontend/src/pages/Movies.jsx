import React, { useState, useEffect } from "react";
import MovieCard from "../components/movies/MovieCard";
import {
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import { getAllMovies } from "../services/movieService";
import { useSearchParams } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filters from URL
  const genre = searchParams.get("genre") || "";
  const sortOrder = searchParams.get("sort") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const moviesPerPage = 6;

  useEffect(() => {
    getAllMovies().then((res) => {
      setMovies(res.data);
    });
  }, []);

  // 🔄 Update filters in URL
  const updateFilters = (newFilters) => {
    const updated = {
      genre,
      sort: sortOrder,
      page: currentPage,
      ...newFilters,
    };

    // Remove empty keys
    Object.keys(updated).forEach((key) => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };

  // 🔍 Filter + Sort Logic
  useEffect(() => {
    let temp = [...movies];

    if (genre) {
      temp = temp.filter((movie) =>
        movie.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    if (sortOrder) {
      temp.sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    setFilteredMovies(temp);
  }, [genre, sortOrder, movies]);

  // 📄 Pagination Logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const pageCount = Math.ceil(filteredMovies.length / moviesPerPage);

  return (
    <Box>
      {/* Header + Filters */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Browse Movies</Typography>

        <Box display="flex" gap={2}>
          {/* Genre Filter */}
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Genre</InputLabel>
            <Select
              value={genre}
              onChange={(e) => updateFilters({ genre: e.target.value, page: 1 })}
              label="Genre"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Action">Action</MenuItem>
              <MenuItem value="Drama">Drama</MenuItem>
              <MenuItem value="Comedy">Comedy</MenuItem>
              <MenuItem value="Horror">Horror</MenuItem>
              <MenuItem value="Adventure">Adventure</MenuItem>
              <MenuItem value="Crime">Crime</MenuItem>
              <MenuItem value="Thriller">Thriller</MenuItem>
              <MenuItem value="Fantasy">Fantasy</MenuItem>
              <MenuItem value="Superhero">Superhero</MenuItem>
            </Select>
          </FormControl>

          {/* Sort Filter */}
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Sort by Date</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => updateFilters({ sort: e.target.value, page: 1 })}
              label="Sort by Date"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="asc">Oldest First</MenuItem>
              <MenuItem value="desc">Newest First</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Movie Grid */}
      <Grid container spacing={3} margin={4}>
        {currentMovies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(e, page) => updateFilters({ page })}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default Movies;
