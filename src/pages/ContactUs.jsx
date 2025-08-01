import { useState, useMemo, useEffect, useRef } from "react";
import {
  Container,
  TextField,
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
  Stack,
} from "@mui/material";


import {
  FaInstagram,
  FaFacebook,
  FaBug,
  FaLightbulb,
  FaComments,
  FaQuestion,
} from "react-icons/fa";
import { contactUsAPI } from "../services/contactus";
import { validateContactEmail, validateEmailRealTime } from "../utils/emailValidation";
import "../styles/contactus.css";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";


const contactTypes = [
  { value: "general", label: "General Inquiry", icon: <FaComments style={{ marginRight: 8 }} /> },
  { value: "bug", label: "Bug Report", icon: <FaBug style={{ marginRight: 8 }} /> },
  { value: "feature", label: "Feature Request", icon: <FaLightbulb style={{ marginRight: 8 }} /> },
  { value: "other", label: "Other", icon: <FaQuestion style={{ marginRight: 8 }} /> },
];

function ContactUs() {

  const [width, height] = useWindowSize();
  const headerRef = useRef(null);
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const iconsRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isIconsVisible, setIsIconsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

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
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const isFormValid = useMemo(() => {
    const emailValidation = validateContactEmail(formData.email);
    return formData.first_name && 
           formData.last_name && 
           formData.email && 
           formData.message && 
           emailValidation.isValid;
  }, [formData]);

  // Intersection Observer for header animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    };

    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHeaderVisible(true);
          }
        });
      },
      observerOptions
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current);
      }
    };
  }, []);

  // Intersection Observer for card animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCardVisible(true);
            
            // Trigger icons animation after card animation completes
            setTimeout(() => {
              setIsIconsVisible(true);
              
              // Trigger button animation after icons animation completes
              setTimeout(() => {
                setIsButtonVisible(true);
              }, 800); // 0.8s delay to match icons animation duration
            }, 1200); // 1.2s delay to match card animation duration
          }
        });
      },
      observerOptions
    );

    if (cardRef.current) {
      cardObserver.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        cardObserver.unobserve(cardRef.current);
      }
    };
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing after a failed submission
    if (hasAttemptedSubmit) {
      if (name === 'email') {
        setEmailError("");
      }
      setError("");
    }
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
    
    // Clear phone errors when user starts typing after a failed submission
    if (hasAttemptedSubmit) {
      setPhoneError("");
      setError("");
    }
  };

  const handleCloseOverlay = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsClosing(false);
    }, 500); // Match the CSS animation duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
  
    const missingFields = [];
    if (!formData.first_name) missingFields.push("First Name");
    if (!formData.last_name) missingFields.push("Last Name");
    if (!formData.email) missingFields.push("Email");
    if (!formData.message) missingFields.push("Message");
  
    if (missingFields.length > 0) {
      setError(`Please fill in the following required field(s): ${missingFields.join(", ")}`);
      return;
    }
  
    // Validate email with comprehensive validation
    const emailValidation = validateContactEmail(formData.email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      return;
    }
  
    if (formData.phone && formData.phone.replace(/\D/g, "").length !== 10) {
      setPhoneError("Phone number must be 10 digits.");
      return;
    }
  
    setPhoneError("");
    setEmailError("");
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
      <>
        {/* Continue showing the contact form in the background */}
        <Container maxWidth="sm" className="contact-container">
          <Box ref={headerRef} className="contact-header-section">
            <Typography 
              ref={headerRef} 
              variant="h3" 
              component="h1" 
              className={`contact-header ${isHeaderVisible ? 'animate' : ''}`}
            >
              Contact Us
            </Typography>
          </Box>
          
          <Card ref={cardRef} className={`contact-card ${isCardVisible ? 'animate' : ''}`}>
            <CardContent>
              <Box component="form" id="contact-form" onSubmit={handleSubmit}>
                <Stack spacing={3} alignItems="center">
                  {/* Form content - simplified for background display */}
                  <Typography variant="h6" color="textSecondary">
                    Form submitted successfully!
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Container>

        {/* Success message overlay with same animation as waitlist */}
        <Box 
          sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: submitted && !isClosing ? 'slideInUp 0.6s ease-out' : isClosing ? 'slideOutDown 0.5s ease-in' : 'none'
          }}
        >
          <Confetti width={width} height={height} numberOfPieces={250} recycle={false} />
          
          {/* Overlay background - clickable to close */}
          <Box
            onClick={handleCloseOverlay}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              cursor: 'pointer'
            }}
          />

          {/* Close X button - top right of screen */}
          <Box
            onClick={handleCloseOverlay}
            sx={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              zIndex: 10000,
              padding: '10px',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            ×
          </Box>

          {/* Close text button - bottom right of screen */}
          <Box
            onClick={handleCloseOverlay}
            sx={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              zIndex: 10000,
              padding: '10px 15px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Close
          </Box>
          
          {/* Success message card */}
          <Box 
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'relative',
              zIndex: 10000,
              animation: submitted && !isClosing ? 'contentSlideIn 0.7s ease-out 0.3s both' : isClosing ? 'contentSlideOut 0.5s ease-in both' : 'none'
            }}
          >
            <Card className="thank-you-card">
              <CardContent sx={{ textAlign: 'center', padding: '2rem' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Thank you for your feedback!
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mb: 4, mt: 2 }}>
                  We'll be in touch soon!
                </Typography>
      
                <Button
                  onClick={handleCloseOverlay}
                  variant="contained"
                  color="primary"
                  size="large"
                  className="submit-button animate"
                >
                  Submit Another
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <Container maxWidth="sm" className="contact-container">
      <Box ref={headerRef} className="contact-header-section">
        <Typography 
          variant="h4" 
          align="center" 
          fontWeight="bold" 
          gutterBottom
          className={`contact-header-title ${isHeaderVisible ? 'animate' : ''}`}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          className={`contact-intro-text ${isHeaderVisible ? 'animate' : ''}`}
          gutterBottom 
          sx={{fontSize: ".9rem"}}
        >
          Have questions? Our team is here to provide the support and guidance you need.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} id="contact-form">
        <Card ref={cardRef} className={`contact-card ${isCardVisible ? 'animate' : ''}`}>
          <CardContent>
            <Box sx={{ px: 1 }}>
              <Stack spacing={2} alignItems="center">
                {/* First + Last Name */}
                <Box sx={{ display: "flex", gap: "8px", width: "90%" }}>
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

                {/* Email + Contact Reason */}
                <Box sx={{ display: "flex", gap: "8px", width: "90%" }}>
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
                        <InputLabel id="feedback-type-label">Contact Reason</InputLabel>
                        <Select
                          labelId="feedback-type-label"
                          name="feedback_type"
                          value={formData.feedback_type}
                          label="Contact Reason"
                          onChange={handleChange}
                          renderValue={(value) => {
                            const selectedType = contactTypes.find(type => type.value === value);
                            const label = selectedType ? selectedType.label : "General Inquiry";
                            return (
                              <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%'
                              }}>
                                {label}
                              </div>
                            );
                          }}
                          sx={{
                            '& .MuiSelect-select': {
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }
                          }}
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

                {/* Social Media + Phone */}
                <Box sx={{ display: "flex", gap: "8px", width: "90%" }}>
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
                        maxLength: 12,
                      }}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                    />
                </Box>

                {/* Message */}
                <Box sx={{ width: "90%" }}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="message-text-field"
                    inputProps={{
                      maxLength: 150,
                    }}
                    helperText={`${formData.message.length}/150 characters`}
                  />
                </Box>


              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Error Messages - Only show after submission attempt */}
        {hasAttemptedSubmit && (error || emailError || phoneError) && (
          <Box sx={{ 
            width: '100%', 
            maxWidth: '600px', 
            margin: '20px auto', 
            padding: '16px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px'
          }}>
            {error && (
              <Typography color="error" align="center" sx={{ marginBottom: emailError || phoneError ? '8px' : '0' }}>
                {error}
              </Typography>
            )}
            {emailError && (
              <Typography color="error" align="center" sx={{ marginBottom: phoneError ? '8px' : '0' }}>
                Email Error: {emailError}
              </Typography>
            )}
            {phoneError && (
              <Typography color="error" align="center">
                Phone Error: {phoneError}
              </Typography>
            )}
          </Box>
        )}

        {/* Social + Submit */}
        <Box className="bottom-controls">
          <Box ref={iconsRef} className={`social-icons ${isIconsVisible ? 'animate' : ''}`}>
                          <a href={import.meta.env.VITE_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaInstagram className="social-icon instagram" />
            </a>
                          <a href={import.meta.env.VITE_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaFacebook className="social-icon facebook" />
            </a>
          </Box>
          <Button
            ref={buttonRef}
            type="submit"
            form="contact-form"
            variant="contained"
            color="primary"
            size="large"
            className={`submit-button ${isButtonVisible ? 'animate' : ''}`}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Message"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default ContactUs;
