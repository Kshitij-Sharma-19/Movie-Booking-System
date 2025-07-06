import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/adminService";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

const UserManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAllUsers().then((res) => {
      setRows(
        res.data.map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          phoneNumber: u.phoneNumber,
          dateOfBirth: u.dateOfBirth,
          address: u.address,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        }))
      );
    });
  }, []);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone", flex: 1 },
    { field: "dateOfBirth", headerName: "DOB", flex: 1 },
    { field: "address", headerName: "Address", flex: 1.5 },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 170 },
    { field: "updatedAt", headerName: "Updated At", flex: 1, minWidth: 170 },
  ];

  return (
    <>
      <Typography variant="h5" mb={2}>Manage Users</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        pageSize={5}
        getRowId={(row) => row.id}
      />
    </>
  );
};

export default UserManagement;