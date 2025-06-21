import React, { useEffect, useState } from "react";
import { getAllMovies, createMovie } from "../../services/movieService";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";

const MovieManagement = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  // Use camelCase for state, map to snake_case when sending to backend
  const [newMovie, setNewMovie] = useState({
    id: "",
    title: "",
    description: "",
    genre: "",
    director: "",
    castMembers: "",
    durationMinutes: "",
    releaseDate: "",
    posterUrl: "",
  });

  const fetchMovies = () => {
    getAllMovies().then((res) => {
      const movies = res.data.map((m) => ({ id: m.id, ...m }));
      setRows(movies);
    });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const columns = [
    { field: "id", headerName: "Movie ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "genre", headerName: "Genre",flex: 1 },
    // { field: "rating", headerName: "Rating" },
    { field: "durationMinutes", headerName: "Duration (min)",flex: 1 },
    {field:"releaseDate", headerName:"Release Date (YYYY-MM-DD)", flex:1},
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewMovie({
      id: "",
      title: "",
      description: "",
      genre: "",
      director: "",
      castMembers: "",
      durationMinutes: "",
      releaseDate: "",
      posterUrl: "",
    });
    setOpen(false);
  };

  const handleSave = async () => {
    // Transform camelCase to snake_case before sending to backend
    const payload = {
      id: newMovie.id,
      title: newMovie.title,
      description: newMovie.description,
      genre: newMovie.genre,
      director: newMovie.director,
      cast_members: newMovie.castMembers,
      duration_minutes: newMovie.durationMinutes,
      release_date: newMovie.releaseDate,
      poster_url: newMovie.posterUrl,
    };

    try {
      await createMovie(payload);
      handleClose();
      fetchMovies(); // Refresh list
    } catch (err) {
      alert("Failed to create movie");
    }
  };

  return (
    <>
      <Typography variant="h5" mb={2}>Manage Movies</Typography>
      <Button variant="contained" sx={{ mb: 2, "&:hover": {
            color: "white", backgroundColor:"grey"
          }, }} onClick={handleOpen}>
        + Add Movie
      </Button>
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Movie</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Movie ID"
                fullWidth
                value={newMovie.id}
                onChange={(e) => setNewMovie({ ...newMovie, id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                fullWidth
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Genre"
                fullWidth
                value={newMovie.genre}
                onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Director"
                fullWidth
                value={newMovie.director}
                onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cast Members"
                fullWidth
                value={newMovie.castMembers}
                onChange={(e) => setNewMovie({ ...newMovie, castMembers: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (min)"
                type="number"
                fullWidth
                value={newMovie.durationMinutes}
                onChange={(e) => setNewMovie({ ...newMovie, durationMinutes: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Release Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newMovie.releaseDate}
                onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Poster URL"
                fullWidth
                value={newMovie.posterUrl}
                onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ "&:hover": {
            color: "white", backgroundColor: "red"
          }, }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ "&:hover": {
            color: "white", backgroundColor: "lightgreen"
          }, }}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MovieManagement;