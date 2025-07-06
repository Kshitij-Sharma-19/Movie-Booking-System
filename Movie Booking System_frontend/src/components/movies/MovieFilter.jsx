import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const MovieFilter = ({ genre, setGenre, rating, setRating }) => {
  return (
    <>
      <FormControl sx={{ mr: 2, minWidth: 120 }} size="small">
        <InputLabel>Genre</InputLabel>
        <Select value={genre} onChange={(e) => setGenre(e.target.value)} label="Genre">
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Action">Action</MenuItem>
          <MenuItem value="Comedy">Comedy</MenuItem>
          <MenuItem value="Drama">Drama</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel>Rating</InputLabel>
        <Select value={rating} onChange={(e) => setRating(e.target.value)} label="Rating">
          <MenuItem value="">All</MenuItem>
          <MenuItem value="4">4+</MenuItem>
          <MenuItem value="3">3+</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default MovieFilter;
