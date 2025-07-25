import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ContactMail as ContactMailIcon,
  People as PeopleIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchContactData, fetchWaitlistData } from '../services/adminApi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [contactData, setContactData] = useState([]);
  const [waitlistData, setWaitlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contactData, waitlistData] = await Promise.all([
        fetchContactData(),
        fetchWaitlistData()
      ]);

      setContactData(contactData);
      setWaitlistData(waitlistData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
    setSearchTerm('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleLogout = () => {
    // Clear admin token and redirect to signin
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.location.href = '/signin';
  };

  const filterData = (data) => {
    if (!searchTerm) return data;
    
    return data.filter(entry => {
      const searchLower = searchTerm.toLowerCase();
      if (activeTab === 0) {
        // Contact data
        return (
          entry.first_name?.toLowerCase().includes(searchLower) ||
          entry.last_name?.toLowerCase().includes(searchLower) ||
          entry.email?.toLowerCase().includes(searchLower) ||
          entry.feedback_type?.toLowerCase().includes(searchLower)
        );
      } else {
        // Waitlist data
        return entry.email?.toLowerCase().includes(searchLower);
      }
    });
  };

  const getFilteredData = () => {
    const data = activeTab === 0 ? contactData : waitlistData;
    return filterData(data);
  };

  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  };

  const getFeedbackTypeColor = (type) => {
    const colors = {
      'general': 'success',
      'bug': 'error',
      'feature': 'primary',
      'support': 'warning',
      'other': 'info'
    };
    return colors[type?.toLowerCase()] || 'success';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box 
        className="admin-dashboard-container"
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  return (
    <Box 
      className={`admin-dashboard-container ${isVisible ? 'animate' : ''}`}
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white'
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DashboardIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                Admin Dashboard
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: '#3b82f6',
                borderColor: '#3b82f6',
                '&:hover': {
                  borderColor: '#60a5fa',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
            <Paper
              sx={{
                p: 3,
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <ContactMailIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                  {contactData.length}
                </Typography>
                <Typography variant="body1" sx={{ color: '#a1a1aa' }}>
                  Contact Submissions
                </Typography>
              </Box>
            </Paper>

            <Paper
              sx={{
                p: 3,
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <PeopleIcon sx={{ fontSize: 40, color: '#22c55e' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                  {waitlistData.length}
                </Typography>
                <Typography variant="body1" sx={{ color: '#a1a1aa' }}>
                  Waitlist Entries
                </Typography>
              </Box>
            </Paper>
          </Box>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Paper
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                background: 'rgba(0, 0, 0, 0.2)',
                '& .MuiTab-root': {
                  color: '#a1a1aa',
                  '&.Mui-selected': {
                    color: '#3b82f6'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#3b82f6'
                }
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ContactMailIcon />
                    <span>Contact Submissions</span>
                    <Badge badgeContent={contactData.length} color="primary" />
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon />
                    <span>Waitlist Entries</span>
                    <Badge badgeContent={waitlistData.length} color="success" />
                  </Box>
                }
              />
            </Tabs>

            {/* Search Bar */}
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <TextField
                fullWidth
                placeholder={`Search ${activeTab === 0 ? 'contacts' : 'waitlist entries'}...`}
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#a1a1aa' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(59, 130, 246, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6'
                    }
                  }
                }}
                sx={{
                  '& .MuiInputBase-input::placeholder': {
                    color: '#a1a1aa',
                    opacity: 1
                  }
                }}
              />
            </Box>

            {/* Data Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    {activeTab === 0 ? (
                      <>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Created</TableCell>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Actions</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Created</TableCell>
                        <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>Actions</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((entry, index) => (
                    <TableRow
                      key={activeTab === 0 ? entry.contact_id : entry.id}
                      sx={{
                        '&:hover': {
                          background: 'rgba(59, 130, 246, 0.05)'
                        }
                      }}
                    >
                      {activeTab === 0 ? (
                        <>
                          <TableCell sx={{ color: 'white' }}>
                            {entry.first_name} {entry.last_name}
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>{entry.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={entry.feedback_type}
                              color={getFeedbackTypeColor(entry.feedback_type)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={entry.is_read ? 'Read' : 'Unread'}
                              color={entry.is_read ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {formatDate(entry.created_at)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleViewDetails(entry)}
                              sx={{ color: '#3b82f6' }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell sx={{ color: 'white' }}>{entry.email}</TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {formatDate(entry.created_at)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleViewDetails(entry)}
                              sx={{ color: '#3b82f6' }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={getFilteredData().length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: '#a1a1aa',
                '& .MuiTablePagination-select': {
                  color: 'white'
                },
                '& .MuiTablePagination-selectIcon': {
                  color: '#a1a1aa'
                }
              }}
            />
          </Paper>
        </motion.div>

        {/* Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'white'
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {activeTab === 0 ? 'Contact Details' : 'Waitlist Entry Details'}
            </Typography>
            <IconButton onClick={handleCloseDialog} sx={{ color: '#a1a1aa' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedEntry && (
              <Box sx={{ mt: 2 }}>
                {activeTab === 0 ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Contact ID
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {selectedEntry.contact_id}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Name
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {selectedEntry.first_name} {selectedEntry.last_name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {selectedEntry.email}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Feedback Type
                      </Typography>
                      <Chip
                        label={selectedEntry.feedback_type}
                        color={getFeedbackTypeColor(selectedEntry.feedback_type)}
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          '& .MuiChip-label': {
                            color: 'white',
                            fontWeight: '600'
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Status
                      </Typography>
                      <Chip
                        label={selectedEntry.is_read ? 'Read' : 'Unread'}
                        color={selectedEntry.is_read ? 'success' : 'warning'}
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Message
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white', whiteSpace: 'pre-wrap' }}>
                        {selectedEntry.message}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Created At
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {formatDate(selectedEntry.created_at)}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        ID
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {selectedEntry.id}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {selectedEntry.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Created At
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {formatDate(selectedEntry.created_at)}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: '#a1a1aa' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 