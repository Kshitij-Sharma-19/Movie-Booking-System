import React, { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllMovies, createMovie, updateMovie, deleteMovie } from "../../services/movieService";

const defaultMovie = {
  id: "",
  title: "",
  description: "",
  genre: "",
  durationMinutes: 0,
  releaseDate: "",
  director: "",
  castMembers: "",
  posterUrl: "",
  trailerYoutubeId: "",
};

const normalizeMovie = (movie) => ({
  id: movie.id ?? "",
  title: movie.title ?? "",
  description: movie.description ?? "",
  genre: movie.genre ?? "",
  durationMinutes: movie.durationMinutes ?? 0,
  releaseDate: movie.releaseDate ?? "",
  director: movie.director ?? "",
  castMembers: movie.castMembers ?? "",
  posterUrl: movie.posterUrl ?? "",
  trailerYoutubeId: movie.trailerYoutubeId ?? "",
});

const MovieManagement = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({ ...defaultMovie });
  const [editMovie, setEditMovie] = useState({ ...defaultMovie });

  const fetchMovies = () => {
    getAllMovies().then((res) => {
      const movies = res.data.map(normalizeMovie);
      setRows(movies);
    });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const columns = [
    { field: "id", headerName: "Movie ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "genre", headerName: "Genre", flex: 1 },
    { field: "durationMinutes", headerName: "Duration (min)", flex: 1 },
    { field: "releaseDate", headerName: "Release Date (YYYY-MM-DD)", flex: 1 },
    { field: "trailerYoutubeId", headerName: "YouTube Trailer ID", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <EditIcon
              sx={{
                color: "#1976d2",
                "&:hover": { color: "#1565c0" },
              }}
            />
          }
          label="Edit"
          onClick={() => handleEditOpen(params.row)}
          sx={{
            borderRadius: "4px",
            border: "1px solid #1976d2",
            color: "#1976d2",
            mx: 0.5,
            background: "#e3f2fd",
            "&:hover": {
              background: "#bbdefb",
              borderColor: "#1976d2",
            },
          }}
        />,
        <GridActionsCellItem
          icon={
            <DeleteIcon
              sx={{
                color: "#d32f2f",
                "&:hover": { color: "#b71c1c" },
              }}
            />
          }
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
          sx={{
            borderRadius: "4px",
            border: "1px solid #d32f2f",
            color: "#d32f2f",
            mx: 0.5,
            background: "#ffebee",
            "&:hover": {
              background: "#ffcdd2",
              borderColor: "#b71c1c",
            },
          }}
        />,
      ],
    },
  ];

  // Add movie dialog handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewMovie({ ...defaultMovie });
    setOpen(false);
  };

  // Edit dialog handlers
  const handleEditOpen = (movie) => {
    setEditMovie(normalizeMovie(movie));
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditMovie({ ...defaultMovie });
    setEditOpen(false);
  };

  // Create
  const handleSave = async () => {
    // The backend expects camelCase, just send as is
    const payload = { ...newMovie };
    try {
      await createMovie(payload);
      handleClose();
      fetchMovies();
    } catch (err) {
      alert("Failed to create movie");
    }
  };

  // Edit
  const handleEditSave = async () => {
    const payload = { ...editMovie };
    try {
      await updateMovie(editMovie.id, payload);
      handleEditClose();
      fetchMovies();
    } catch (err) {
      alert("Failed to update movie");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await deleteMovie(id);
        fetchMovies();
      } catch (err) {
        alert("Failed to delete movie");
      }
    }
  };

  return (
    <>
      <Typography variant="h5" mb={2}>Manage Movies</Typography>
      <Button variant="contained" sx={{
        mb: 2,
        backgroundColor: "#1976d2",
        color: "white",
        "&:hover": {
          backgroundColor: "#1565c0",
          color: "white"
        }
      }} onClick={handleOpen}>
        + Add Movie
      </Button>
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} />

      {/* Add Movie Dialog */}
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
                onChange={(e) => setNewMovie({ ...newMovie, durationMinutes: Number(e.target.value) })}
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
            <Grid item xs={12}>
              <TextField
                label="YouTube Trailer ID"
                fullWidth
                value={newMovie.trailerYoutubeId}
                onChange={(e) => setNewMovie({ ...newMovie, trailerYoutubeId: e.target.value })}
                helperText="e.g. For https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{
            color: "#d32f2f",
            "&:hover": {
              background: "#ffebee",
              color: "#b71c1c",
            },
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
              color: "white"
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Movie</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Movie ID"
                fullWidth
                value={editMovie.id}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                fullWidth
                value={editMovie.title}
                onChange={(e) => setEditMovie({ ...editMovie, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Genre"
                fullWidth
                value={editMovie.genre}
                onChange={(e) => setEditMovie({ ...editMovie, genre: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Director"
                fullWidth
                value={editMovie.director}
                onChange={(e) => setEditMovie({ ...editMovie, director: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cast Members"
                fullWidth
                value={editMovie.castMembers}
                onChange={(e) => setEditMovie({ ...editMovie, castMembers: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={editMovie.description}
                onChange={(e) => setEditMovie({ ...editMovie, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (min)"
                type="number"
                fullWidth
                value={editMovie.durationMinutes}
                onChange={(e) => setEditMovie({ ...editMovie, durationMinutes: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Release Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editMovie.releaseDate}
                onChange={(e) => setEditMovie({ ...editMovie, releaseDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Poster URL"
                fullWidth
                value={editMovie.posterUrl}
                onChange={(e) => setEditMovie({ ...editMovie, posterUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="YouTube Trailer ID"
                fullWidth
                value={editMovie.trailerYoutubeId}
                onChange={(e) => setEditMovie({ ...editMovie, trailerYoutubeId: e.target.value })}
                helperText="e.g. For https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} sx={{
            color: "#d32f2f",
            "&:hover": {
              background: "#ffebee",
              color: "#b71c1c",
            },
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} sx={{
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
              color: "white"
            }
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MovieManagement;