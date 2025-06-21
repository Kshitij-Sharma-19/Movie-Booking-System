import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { getUserProfile, updateUserProfile } from "../../services/userService";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    if (editMode) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await updateUserProfile(profile);
      setMessage("Profile updated successfully!");
      setProfile(res.data);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">Unable to load profile.</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: "auto" }}>
        <Typography variant="h4" gutterBottom>User Profile</Typography>
        <Divider sx={{ mb: 2 }} />

        {message && (
          <Alert severity={message.includes("successfully") ? "success" : "error"} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <TextField
          label="First Name"
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: !editMode }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: !editMode }}
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: !editMode }}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={profile.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: !editMode }}
        />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={profile.dateOfBirth}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          InputProps={{ readOnly: !editMode }}
        />
        <TextField
          label="Address"
          name="address"
          value={profile.address}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          InputProps={{ readOnly: !editMode }}
        />

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="contained"
            onClick={() => setEditMode(true)}
            sx={{
              backgroundColor: "#041562",
              "&:hover": {
                backgroundColor: "#11468F",
              },
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!editMode || saving}
            sx={{
              backgroundColor: "#041562",
              "&:hover": {
                backgroundColor: "#11468F",
              },
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;
