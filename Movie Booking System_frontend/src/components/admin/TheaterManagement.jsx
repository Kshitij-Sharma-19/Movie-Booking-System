import React, { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllTheaters,
  createTheater,
  deleteTheater,
  updateTheater,
} from "../../services/adminService";

const defaultNewTheater = {
  name: "",
  city: "",
  address: "",
  totalSeats: 0,
  numberOfScreens: 1,
};

const defaultEditTheater = {
  id: "",
  name: "",
  city: "",
  address: "",
  totalSeats: 0,
  numberOfScreens: 1,
};

const TheaterManagement = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newTheater, setNewTheater] = useState({ ...defaultNewTheater });
  const [editTheater, setEditTheater] = useState({ ...defaultEditTheater });

  // Fetch theaters
  const fetchTheaters = async () => {
    const res = await getAllTheaters();
    setRows(res.data.map((t) => ({ id: t.id, ...t })));
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewTheater({ ...defaultNewTheater });
    setOpen(false);
  };

  const handleEditOpen = (theater) => {
    setEditTheater({
      id: theater.id,
      name: theater.name,
      city: theater.city || "",
      address: theater.address || "",
      totalSeats: theater.totalSeats ?? 0,
      numberOfScreens: theater.numberOfScreens ?? 1,
    });
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditTheater({ ...defaultEditTheater });
    setEditOpen(false);
  };

  // Create
  const handleSave = async () => {
    try {
      await createTheater(newTheater);
      handleClose();
      fetchTheaters();
    } catch (err) {
      alert("Error creating theater");
    }
  };

  // Edit
  const handleEditSave = async () => {
    try {
      await updateTheater(editTheater.id, editTheater);
      handleEditClose();
      fetchTheaters();
    } catch (err) {
      alert("Error updating theater");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this theater?")) {
      try {
        await deleteTheater(id);
        fetchTheaters();
      } catch (err) {
        alert("Error deleting theater");
      }
    }
  };

  const columns = [
    { field: "id", headerName: "Theater ID", flex: 1 },
    { field: "name", headerName: "Theater Name", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "address", headerName: "Location", flex: 1 },
    { field: "numberOfScreens", headerName: "Screens", flex: 1 },
    {
      field: "totalSeats",
      headerName: "Total Seats",
      flex: 1,
    },
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

  return (
    <>
      <Typography variant="h5" mb={2}>
        Manage Theaters
      </Typography>
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{
          mb: 2,
          backgroundColor: "#1976d2",
          color: "white",
          "&:hover": {
            backgroundColor: "#1565c0",
            color: "white",
          },
        }}
      >
        + Add Theater
      </Button>
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} />

      {/* Add Theater Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Theater</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newTheater.name}
            onChange={(e) =>
              setNewTheater({ ...newTheater, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="City"
            fullWidth
            value={newTheater.city}
            onChange={(e) =>
              setNewTheater({ ...newTheater, city: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            value={newTheater.address}
            onChange={(e) =>
              setNewTheater({ ...newTheater, address: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Total Seats"
            type="number"
            fullWidth
            value={newTheater.totalSeats}
            onChange={(e) =>
              setNewTheater({ ...newTheater, totalSeats: Number(e.target.value) })
            }
          />
          <TextField
            margin="dense"
            label="Number of Screens"
            type="number"
            fullWidth
            value={newTheater.numberOfScreens}
            onChange={(e) =>
              setNewTheater({ ...newTheater, numberOfScreens: Number(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: "#d32f2f",
              "&:hover": {
                background: "#ffebee",
                color: "#b71c1c",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
                color: "white",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Theater Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Theater</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={editTheater.name}
            onChange={(e) =>
              setEditTheater({ ...editTheater, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="City"
            fullWidth
            value={editTheater.city}
            onChange={(e) =>
              setEditTheater({ ...editTheater, city: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            value={editTheater.address}
            onChange={(e) =>
              setEditTheater({ ...editTheater, address: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Total Seats"
            type="number"
            fullWidth
            value={editTheater.totalSeats}
            onChange={(e) =>
              setEditTheater({ ...editTheater, totalSeats: Number(e.target.value) })
            }
          />
          <TextField
            margin="dense"
            label="Number of Screens"
            type="number"
            fullWidth
            value={editTheater.numberOfScreens}
            onChange={(e) =>
              setEditTheater({ ...editTheater, numberOfScreens: Number(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            sx={{
              color: "#d32f2f",
              "&:hover": {
                background: "#ffebee",
                color: "#b71c1c",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
                color: "white",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TheaterManagement;