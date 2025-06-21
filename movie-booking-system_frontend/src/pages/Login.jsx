import React from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuthContext();

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      alert("Login failed. Check credentials.");
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
        border: "1px solid rgba(23, 22, 22, 0.18)",
      }}
    >
      <Typography variant="h5" mb={2} fontWeight="bold" textAlign="center">
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          {...register("email", { required: true })}
          InputProps={{
            sx: {
              backgroundColor: "rgba(255, 255, 255, 0.85)",
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
              backgroundColor: "rgba(255, 255, 255, 0.85)",
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
          Login
        </Button>
      </form>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Don’t have an account?{" "}
          <Link component={RouterLink} to="/register" sx={{ color: "#DA1212" }}>
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
