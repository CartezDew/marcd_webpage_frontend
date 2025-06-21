import { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  FaComments, 
  FaBug, 
  FaLightbulb, 
  FaEnvelope 
} from 'react-icons/fa';
import { feedbackAPI } from '../services/feedback';

function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback_type: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await feedbackAPI.create(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        feedback_type: 'general',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('There was an error submitting your feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: <FaBug style={{ marginRight: 8 }} /> },
    { value: 'feature', label: 'Feature Request', icon: <FaLightbulb style={{ marginRight: 8 }} /> },
    { value: 'general', label: 'General Feedback', icon: <FaComments style={{ marginRight: 8 }} /> }
  ];

  if (submitted) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <FaEnvelope style={{ fontSize: '3rem', color: 'success.main', marginBottom: '1rem' }} />
          <Typography variant="h4" component="h2" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your feedback has been submitted successfully. We appreciate your input!
          </Typography>
          <Button 
            onClick={() => setSubmitted(false)}
            variant="contained"
          >
            Submit Another Feedback
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'transparent' }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight={300}>
          Send Feedback
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Help us improve Marc'd by sharing your thoughts
        </Typography>

        <Grid container spacing={4}>
          <Grid xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <TextField
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="feedback-type-label">Feedback Type</InputLabel>
                      <Select
                        labelId="feedback-type-label"
                        id="feedback_type"
                        name="feedback_type"
                        value={formData.feedback_type}
                        label="Feedback Type"
                        onChange={handleChange}
                      >
                        {feedbackTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {type.icon}
                              {type.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      fullWidth
                      required
                      multiline
                      rows={6}
                    />
                  </Grid>
                  {error && (
                    <Grid xs={12}>
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  )}
                  <Grid xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  What kind of feedback can you provide?
                </Typography>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaBug style={{ color: '#e74c3c', marginRight: 16, fontSize: 24 }} />
                    <Box>
                      <Typography variant="h6">Bug Report</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Report any issues or problems you've encountered.
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaLightbulb style={{ color: '#f39c12', marginRight: 16, fontSize: 24 }} />
                    <Box>
                      <Typography variant="h6">Feature Request</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Suggest new features or improvements.
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FaComments style={{ color: '#3498db', marginRight: 16, fontSize: 24 }} />
                    <Box>
                      <Typography variant="h6">General Feedback</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Share your overall experience or any other thoughts.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Feedback; 