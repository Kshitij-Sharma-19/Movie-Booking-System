import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

const Register = () => {
  const { register, handleSubmit } = useForm();
  const { register: registerUser } = useAuthContext();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        borderRadius: 3,
        backgroundColor: "#EEEEEE",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      <Typography variant="h5" mb={2} fontWeight="bold" textAlign="center">
        Register
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="First Name"
          margin="normal"
          {...register("firstName", { required: true })}
          InputProps={{
            sx: {
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: 1,
            },
          }}
        />
        <TextField
          fullWidth
          label="Last Name"
          margin="normal"
          {...register("lastName", { required: true })}
          InputProps={{
            sx: {
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: 1,
            },
          }}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          {...register("email", { required: true })}
          InputProps={{
            sx: {
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: 1,
            },
          }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          {...register("password", { required: true })}
          InputProps={{
            sx: {
              backgroundColor: "rgb(255, 255, 255)",
              borderRadius: 1,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#1a1a1a",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
            },
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          Register
        </Button>
      </form>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" sx={{ color: "#DA1212" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
