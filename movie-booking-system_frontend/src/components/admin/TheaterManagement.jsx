import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { getAllTheaters, createTheater } from "../../services/adminService";

const totalSeats=260;
const TheaterManagement = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTheater, setNewTheater] = useState({ name: "", location: "" });

  useEffect(() => {
    getAllTheaters().then((res) => {
      setRows(res.data.map((t) => ({ id: t.id, ...t })));
    });
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewTheater({ name: "", location: "" });
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      await createTheater(newTheater);
      handleClose();
      // Refresh list
      const res = await getAllTheaters();
      setRows(res.data.map((t) => ({ id: t.id, ...t })));
    } catch (err) {
      alert("Error creating theater");
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
    valueGetter: () => totalSeats,
  },
  ];

  return (
    <>
      <Typography variant="h5" mb={2}>Manage Theaters</Typography>
      <Button onClick={handleOpen} variant="contained" sx={{ mb: 2,"&:hover": {
            color: "white", backgroundColor:"grey"
          }, }}>
        + Add Theater
      </Button>
      <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Theater</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newTheater.name}
            onChange={(e) => setNewTheater({ ...newTheater, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={newTheater.location}
            onChange={(e) => setNewTheater({ ...newTheater, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TheaterManagement;
