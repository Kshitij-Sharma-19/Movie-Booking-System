import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  InputLabel,
  Paper,
  Stack
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    from_name: "",
    reply_to: "",
    message: "",
  });
  const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";
  const [file, setFile] = useState(null);
  const [base64File, setBase64File] = useState(null);
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Remove the prefix
      setBase64File(base64String);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);

    try {
      await axios.post(
        `${baseURL}/booking-service/api/email/send`,
        {
          toEmail: "cineshowtimeapp@gmail.com",
          subject: `User Inquiry from ${formData.from_name}`,
          body: `Name: ${formData.from_name}\nEmail: ${formData.reply_to}\n\nMessage:\n${formData.message}`,
          base64Pdf: base64File,
          fileName: fileName || null,
        }
      );
      setSuccess(true);
      setFormData({ from_name: "", reply_to: "", message: "" });
      setFile(null);
      setBase64File(null);
      setFileName("");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Contact Us
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Have questions or feedback? Fill out the form below.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Your Name"
              name="from_name"
              fullWidth
              required
              value={formData.from_name}
              onChange={handleChange}
            />
            <TextField
              label="Your Email"
              name="reply_to"
              type="email"
              fullWidth
              required
              value={formData.reply_to}
              onChange={handleChange}
            />
            <TextField
              label="Your Message"
              name="message"
              multiline
              rows={4}
              fullWidth
              required
              value={formData.message}
              onChange={handleChange}
            />

            <Box>
              <InputLabel sx={{ mb: 1 }}>Attach File (optional)</InputLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderStyle: "dashed",
                  borderColor: "#ccc",
                  p: 2,
                  width: "100%",
                  justifyContent: "flex-start",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {fileName || "Upload a PDF or Image"}
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            <Button type="submit" variant="contained" color="primary" size="large" sx={{
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}>
              Send Message
            </Button>

            {success && <Alert severity="success">Message sent successfully!</Alert>}
            {error && <Alert severity="error">Failed to send message. Try again later.</Alert>}
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactUs;
