import { useState, useMemo } from "react";
import {
  Container,
  TextField,
  Grid,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";


import {
  FaInstagram,
  FaFacebook,
  FaBug,
  FaLightbulb,
  FaComments,
} from "react-icons/fa";
import { contactUsAPI } from "../services/contactus";
import "../styles/contactus.css";

const contactTypes = [
  { value: "general", label: "General Contact", icon: <FaComments style={{ marginRight: 8 }} /> },
  { value: "bug", label: "Bug Report", icon: <FaBug style={{ marginRight: 8 }} /> },
  { value: "feature", label: "Feature Request", icon: <FaLightbulb style={{ marginRight: 8 }} /> },
];

function ContactUs() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    social_media: "",
    phone: "",
    feedback_type: "general",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const isFormValid = useMemo(() => {
    return formData.first_name && formData.last_name && formData.email && formData.message;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let digitsOnly = e.target.value.replace(/\D/g, "");

    if (digitsOnly.length > 10) {
      digitsOnly = digitsOnly.slice(0, 10);
    }

    let formatted = digitsOnly;
    if (digitsOnly.length > 6) {
      formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length > 3) {
      formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    }

    setFormData((prev) => ({ ...prev, phone: formatted }));
    setPhoneError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (formData.phone && formData.phone.replace(/\D/g, "").length !== 10) {
      setPhoneError("Phone number must be 10 digits.");
      return;
    }

    setPhoneError("");
    setLoading(true);
    setError("");

    try {
      await contactUsAPI.create(formData);
      setSubmitted(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        social_media: "",
        phone: "",
        feedback_type: "general",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting contactus:", err);
      setError("There was an error submitting your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6, textAlign: "center" }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Thank you for your feedback!
            </Typography>
            <Typography>We'll be in touch soon!</Typography>
            <Button onClick={() => setSubmitted(false)} variant="contained" sx={{ mt: 2 }}>
              Submit Another
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="contact-container">
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" align="center" className="contact-intro-text" gutterBottom sx={{fontSize: ".9rem"}}>
        Have questions? Our team is here to provide the support and guidance you need.
      </Typography>

      <form onSubmit={handleSubmit} id="contact-form">
        <Card className="contact-card">
          <CardContent>
            <Box sx={{ px: 1 }}>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                {/* First + Last Name */}
                <Grid item xs={12} sx={{width: "90%"}}>
                  <Box sx={{ display: "flex", gap: "8px", width: "100%" }}>
                    <TextField
                      fullWidth
                      required
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      required
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </Box>
                </Grid>

                {/* Email + Contact Reason */}
                <Grid item xs={12} sx={{width: "90%"}}>
                  <Box sx={{ display: "flex", gap: "8px", width: "100%" }}>
                    <TextField
                      fullWidth
                      required
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />

                      <FormControl sx={{ display: "flex", gap: "8px", width: "100%" }}>
                        <InputLabel id="contactus-type-label">Contact Reason</InputLabel>
                        <Select
                          labelId="contactus-type-label"
                          name="contactus_type"
                          value={formData.contactus_type}
                          label="Contact Reason"
                          onChange={handleChange}
                        >
                          {contactTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box sx={{ display: "flex", gap: "8px", width: "100%" }}>
                                {type.icon}
                                {type.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                {/* Social Media + Phone */}
                <Grid item xs={12} sx={{width: "90%"}}>
                  <Box sx={{ display: "flex", gap: "8px", width: "100%" }}>
                    <TextField
                      fullWidth
                      label="Social Media Handle"
                      name="social_media"
                      value={formData.social_media}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      placeholder="000-000-0000"
                      type="tel"
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 12,
                      }}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      error={Boolean(phoneError)}
                      helperText={phoneError}
                    />
                  </Box>
                </Grid>

                {/* Message */}
                <Grid item xs={12} sx={{width: "90%"}}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={5}
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>

                {error && (
                  <Grid item xs={12}>
                    <Typography color="error" align="center">{error}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Social + Submit */}
        <Box className="bottom-controls">
          <Box className="social-icons">
            <a href="https://www.instagram.com/dewitlogistics" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaInstagram className="social-icon instagram" />
            </a>
            <a href="https://www.facebook.com/dewitlogistics" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaFacebook className="social-icon facebook" />
            </a>
          </Box>
          <Button
            type="submit"
            form="contact-form"
            variant="contained"
            color="primary"
            disabled={!isFormValid || loading}
            size="large"
            className="submit-button"
          >
            {loading ? <CircularProgress size={24} /> : "Submit Message"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default ContactUs;
