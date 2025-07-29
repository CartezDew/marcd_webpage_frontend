import React, { useState, useEffect, useRef } from 'react';
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
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Input
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
  Add as AddIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  CreateNewFolder as CreateFolderIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as WordIcon,
  ArrowBack as ArrowBackIcon,
  Slideshow as PowerPointIcon,
  VideoFile as VideoIcon,
  Audiotrack as AudioIcon,
  Archive as ArchiveIcon,
  TextFields as TextIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  UnfoldMore as UnfoldMoreIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchContactData, fetchWaitlistData, updateContactStatus } from '../services/adminApi';
import fileApi from '../services/fileApi';

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
  
  // Sorting state - default to created column descending (most recent first)
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // File sorting state
  const [fileSortField, setFileSortField] = useState('created');
  const [fileSortDirection, setFileSortDirection] = useState('desc');
  
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    email: true,
    type: true,
    status: true,
    created: true,
    actions: true
  });
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  
  // 1. Add folderSortField/folderSortDirection state after fileSortField/fileSortDirection
  const [folderSortField, setFolderSortField] = useState('created');
  const [folderSortDirection, setFolderSortDirection] = useState('desc');
  
  // File management state
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [folderMenuAnchor, setFolderMenuAnchor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [draggedFile, setDraggedFile] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [showMoveSuccess, setShowMoveSuccess] = useState(false);
  const [moveMessage, setMoveMessage] = useState('');
  const [feedbackPosition, setFeedbackPosition] = useState({ x: 0, y: 0 });
  const [showLocalFeedback, setShowLocalFeedback] = useState(false);
  const [localFeedbackMessage, setLocalFeedbackMessage] = useState('');
  const [editingItem, setEditingItem] = useState(null); // { type: 'file' | 'folder', id: number, name: string }
  const [editName, setEditName] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null); // Store the actual item being deleted
  
  // File upload confirmation state
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [pendingUploadFiles, setPendingUploadFiles] = useState([]);
  const [duplicateFileName, setDuplicateFileName] = useState('');
  const [uploadAction, setUploadAction] = useState(''); // 'replace' or 'duplicate'
  
  // File manager container ref
  const fileManagerRef = useRef(null);
  
  // Animation state (set to true to make visible)
  const [fileManagerVisible, setFileManagerVisible] = useState(true);
  
  const prevPathRef = useRef('/');

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchData();
    loadFileData();
  }, []);

  // Debug file menu state
  useEffect(() => {
  }, [fileMenuAnchor, selectedFile]);

  // Clear editing state when path changes
  useEffect(() => {
    if (editingItem && currentPath !== prevPathRef.current) {
      cancelEditing();
    }
    prevPathRef.current = currentPath;
  }, [currentPath]);

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

  const loadFileData = async () => {
    try {
      const [filesData, foldersData] = await Promise.all([
        fileApi.getFiles(),
        fileApi.getFolders()
      ]);
      
      // Ensure we have arrays
      const filesArray = Array.isArray(filesData) ? filesData : [];
      const foldersArray = Array.isArray(foldersData) ? foldersData : [];
      
      // Convert backend data structure to frontend expected structure
      const convertedFiles = filesArray.map(file => {

        // Backend provides full_path field, use it to determine the path
        let path = '/';
        
        if (file.full_path) {
          // Extract the folder path from full_path
          const pathParts = file.full_path.split('/');
          if (pathParts.length > 1) {
            // Remove the filename and join the folder parts
            const folderPath = pathParts.slice(0, -1).join('/');
            path = '/' + folderPath;
          } else {
            // File is in root
            path = '/';
          }
        } else if (file.folder) {
          // Fallback: if full_path is not available, use folder info
          if (typeof file.folder === 'object' && file.folder.full_path) {
            path = '/' + file.folder.full_path;
          } else if (typeof file.folder === 'object' && file.folder.name) {
            path = '/' + file.folder.name;
          } else if (typeof file.folder === 'number') {
            // Folder is just an ID, we need to find the folder name
            const folderObj = foldersArray.find(f => f.id === file.folder);
            if (folderObj) {
              path = folderObj.full_path ? '/' + folderObj.full_path : '/' + folderObj.name;
            }
          }
        }
        
        return {
          ...file,
          path: path,
          size: file.file_size || 0,
          // Ensure we have all required fields
          id: file.id,
          name: file.name,
          uploaded_at: file.uploaded_at,
          uploaded_by: file.uploaded_by
        };
      });
      
      const convertedFolders = foldersArray.map(folder => {
        // Backend provides full_path field, use it to determine parent path
        let path = '/';
        if (folder.parent) {
          // Folder has a parent, use parent's full_path
          if (folder.parent.full_path) {
            path = '/' + folder.parent.full_path;
          } else if (folder.parent.name) {
            path = '/' + folder.parent.name;
          }
        } else {
          // Folder is in root directory
          path = '/';
        }
        
        return {
          ...folder,
          path: path,
          // Ensure we have all required fields
          id: folder.id,
          name: folder.name,
          created_at: folder.created_at,
          created_by: folder.created_by
        };
      });
      
      // Files and folders loaded successfully
      setFiles(convertedFiles);
      setFolders(convertedFolders);
    } catch (err) {
      console.error('Error loading file data:', err);
      if (err.message === 'Authentication required. Please log in again.') {
        // Clear tokens and redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        window.location.href = '/signin';
        return;
      }
      // Set empty arrays on error to prevent undefined issues
      setFiles([]);
      setFolders([]);
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

  const handleSort = (field) => {
    if (sortField === field) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a different field, set it and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(0); // Reset to first page when sorting
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <Tooltip title={`Sort by ${field}`} placement="top">
          <UnfoldMoreIcon className="admin-sort-icon-inactive" />
        </Tooltip>
      );
    }
    
    const isCreatedField = field === 'created';
    const iconClass = isCreatedField ? 'admin-sort-icon-active-red' : 'admin-sort-icon-active-blue';
    
    if (sortDirection === 'asc') {
      return (
        <Tooltip title={`Sort by ${field} descending`} placement="top">
          <ArrowUpwardIcon className={iconClass} />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={`Sort by ${field} ascending`} placement="top">
          <ArrowDownwardIcon className={iconClass} />
        </Tooltip>
      );
    }
  };

  // File sorting functions
  const handleFileSort = (field) => {
    if (fileSortField === field) {
      // If clicking the same field, toggle direction
      setFileSortDirection(fileSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a different field, set it and default to ascending
      setFileSortField(field);
      setFileSortDirection('asc');
    }
  };

  const getFileSortIcon = (field) => {
    if (fileSortField !== field) {
      return <UnfoldMoreIcon className="admin-sort-icon-inactive" sx={{ fontSize: '1.2rem' }} />;
    }
    
    const iconClass = 'admin-sort-icon-active-blue';
    
    if (fileSortDirection === 'asc') {
      return <ArrowUpwardIcon className={iconClass} sx={{ fontSize: '1.2rem' }} />;
    } else {
      return <ArrowDownwardIcon className={iconClass} sx={{ fontSize: '1.2rem' }} />;
    }
  };

  const getSortedFiles = () => {
    const currentFiles = files.filter(file => file.path === currentPath);
    return currentFiles.sort((a, b) => {
      let aValue, bValue;
      switch (fileSortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
          aValue = a.created_at || a.uploaded_at || '';
          bValue = b.created_at || b.uploaded_at || '';
          break;
        case 'type':
          aValue = (a.file_type || '').toLowerCase();
          bValue = (b.file_type || '').toLowerCase();
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return fileSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return fileSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = async () => {
    // If this is a contact submission and it's unread, mark it as read when closing
    if (activeTab === 0 && selectedEntry && !selectedEntry.is_read) {
      try {
        await updateContactStatus(selectedEntry.id, true);
        
        // Update the local state to reflect the change
        setContactData(prevData => 
          prevData.map(contact => 
            contact.id === selectedEntry.id 
              ? { ...contact, is_read: true }
              : contact
          )
        );
      } catch (error) {
        console.error('Error marking contact as read:', error);
        // Don't show error to user, just log it
      }
    }

    setDetailDialogOpen(false);
    setSelectedEntry(null);
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
    const filtered = filterData(data);
    
    // Sort the filtered data
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = activeTab === 0 ? `${a.first_name} ${a.last_name}`.toLowerCase() : '';
          bValue = activeTab === 0 ? `${b.first_name} ${b.last_name}`.toLowerCase() : '';
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'type':
          aValue = a.feedback_type?.toLowerCase() || '';
          bValue = b.feedback_type?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.is_read ? 'read' : 'unread';
          bValue = b.is_read ? 'read' : 'unread';
          break;
        case 'created':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
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

  const formatTableDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // File management functions
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PdfIcon className="admin-file-icon-pdf" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <ExcelIcon className="admin-file-icon-excel" />;
      case 'doc':
      case 'docx':
        return <WordIcon className="admin-file-icon-word" />;
      case 'ppt':
      case 'pptx':
        return <PowerPointIcon className="admin-file-icon-powerpoint" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'bmp':
      case 'tiff':
      case 'webp':
      case 'ico':
        return <ImageIcon className="admin-file-icon-image" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
        return <VideoIcon className="admin-file-icon-video" />;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
        return <AudioIcon className="admin-file-icon-audio" />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <ArchiveIcon className="admin-file-icon-archive" />;
      case 'txt':
      case 'md':
      case 'rtf':
        return <TextIcon className="admin-file-icon-text" />;
      default:
        return <FileIcon className="admin-file-icon-default" />;
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
    // Validate all files before starting upload
    for (const file of uploadedFiles) {
      // Check file type
      if (!validateFileType(file.name)) {
        const allowedTypes = 'PDF, Excel (.xlsx, .xls, etc.), Word (.docx, .doc), PowerPoint (.pptx, .ppt), and image files (.png, .jpg, .jpeg, .gif, .bmp, .tiff, .svg, .webp, .ico, .jfif, .pjpeg, .pjp)';
        setLocalFeedbackMessage(`File type not allowed. Only ${allowedTypes} are supported.`);
        setShowLocalFeedback(true);
        setTimeout(() => setShowLocalFeedback(false), 5000);
        event.target.value = ''; // Reset file input
        return;
      }

      // Validate file name
      const validationError = validateFileName(file.name);
      if (validationError) {
        setError(validationError);
        event.target.value = ''; // Reset file input
        return;
      }
    }
    
    // Let the backend handle duplicate detection and conflict resolution
    await performFileUpload(uploadedFiles, event);
  };

  // Perform the actual file upload
  const performFileUpload = async (filesToUpload, event, conflictResolution = null) => {
    setUploadingFiles(filesToUpload.map(file => ({ file, progress: 0 })));
    setError(''); // Clear any previous errors
    
    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadingFiles(prev => 
            prev.map((f, index) => 
              index === i ? { ...f, progress } : f
            )
          );
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        try {
                  // Upload file to backend with folder ID and conflict resolution parameter
        const currentFolderId = getCurrentFolderId();
        await fileApi.uploadFile(file, currentFolderId, conflictResolution);
        } catch (uploadError) {
          console.log('Upload error response:', uploadError.response?.data);
          console.log('Upload error status:', uploadError.response?.status);
          console.log('Upload error options:', uploadError.response?.data?.options);
          
          // Check if this is a conflict error from the backend
          if (uploadError.response?.status === 400 && uploadError.response?.data?.error?.includes('already exists')) {
            // Show conflict resolution modal
            setDuplicateFileName(file.name);
            setPendingUploadFiles([file]);
            setShowUploadConfirm(true);
            setUploadingFiles([]);
            if (event) event.target.value = ''; // Reset file input
            return; // Exit early, let the modal handle the conflict
          }
          throw uploadError; // Re-throw other errors
        }
      }
      
      // Reload file data from backend
      await loadFileData();
      const locationText = currentPath === '/' ? 'root directory' : `folder "${currentPath}"`;
      setLocalFeedbackMessage(`${filesToUpload.length} file(s) uploaded successfully to ${locationText}!`);
      setShowLocalFeedback(true);
      setTimeout(() => setShowLocalFeedback(false), 3000);
    } catch (error) {
      if (error.message === 'Authentication required. Please log in again.') {
        // Clear tokens and redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        window.location.href = '/signin';
        return;
      }
      
      // Log detailed error information
      console.error('Error uploading files:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Show more specific error message
      let errorMessage = 'Failed to upload files. Please try again.';
      if (error.response?.data?.detail) {
        errorMessage = `Upload failed: ${error.response.data.detail}`;
      } else if (error.response?.data?.error) {
        errorMessage = `Upload failed: ${error.response.data.error}`;
      } else if (error.message) {
        errorMessage = `Upload failed: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setUploadingFiles([]);
      setFileUploadDialogOpen(false);
      if (event) event.target.value = ''; // Reset file input
    }
  };

  // Handle upload confirmation
  const handleUploadConfirm = async () => {
    try {
      if (uploadAction === 'replace') {
        // Upload with replace_existing parameter
        await performFileUpload(pendingUploadFiles, null, 'replace_existing');
      } else if (uploadAction === 'duplicate') {
        // Upload with upload_as_duplicate parameter
        await performFileUpload(pendingUploadFiles, null, 'upload_as_duplicate');
      }
      
      // Reset confirmation state
      setShowUploadConfirm(false);
      setPendingUploadFiles([]);
      setDuplicateFileName('');
      setUploadAction('');
    } catch (error) {
      console.error('Error in handleUploadConfirm:', error);
      setError('Failed to upload file. Please try again.');
    }
  };

  // Handle upload confirmation cancel
  const handleUploadCancel = () => {
    setShowUploadConfirm(false);
    setPendingUploadFiles([]);
    setDuplicateFileName('');
    setUploadAction('');
  };

  const handleCreateFolder = async () => {
    const folderName = newFolderName.trim();
    
    if (!folderName) {
      setError('Folder name cannot be empty');
      return;
    }

    // Validate folder name
    const validationError = validateFolderName(folderName);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check for duplicate folder names
    if (checkDuplicateFolderName(folderName, currentPath)) {
      setError(`Folder "${folderName}" already exists in this location. Please choose a different name.`);
      return;
    }

    try {
      const folderData = {
        name: folderName,
        path: currentPath
      };
      
      await fileApi.createFolder(folderData);
      
      // Reload file data from backend
      await loadFileData();
      setNewFolderName('');
      setFolderDialogOpen(false);
      setError(''); // Clear any previous errors
      setMoveMessage(`Folder "${folderName}" created successfully!`);
      setShowMoveSuccess(true);
      setTimeout(() => setShowMoveSuccess(false), 3000);
    } catch (error) {
      if (error.message === 'Authentication required. Please log in again.') {
        // Clear tokens and redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        window.location.href = '/signin';
        return;
      }
      setError('Failed to create folder. Please try again.');
      console.error('Error creating folder:', error);
    }
  };

  const handleFileMenuOpen = (event, file) => {
    setFileMenuAnchor(event.currentTarget);
    setSelectedFile(file);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
    setSelectedFile(null);
  };

  const handleFolderMenuOpen = (event, folder) => {
    setFolderMenuAnchor(event.currentTarget);
    setSelectedFolder(folder);
  };

  const handleFolderMenuClose = () => {
    setFolderMenuAnchor(null);
    setSelectedFolder(null);
  };

  const handleDeleteFile = async () => {
    if (itemToDelete) {
      try {
        await fileApi.deleteFile(itemToDelete.id);
        
        // Reload file data from backend
        await loadFileData();
        setMoveMessage(`"${itemToDelete.name}" deleted successfully`);
        setShowMoveSuccess(true);
        setTimeout(() => setShowMoveSuccess(false), 3000);
      } catch (error) {
        if (error.message === 'Authentication required. Please log in again.') {
          // Clear tokens and redirect to login
          localStorage.removeItem('adminToken');
          localStorage.removeItem('token');
          localStorage.removeItem('adminEmail');
          window.location.href = '/signin';
          return;
        }
        setError('Failed to delete file. Please try again.');
      } finally {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        setDeleteType(null);
      }
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!folder || !folder.id) return;
    
    // Show custom confirmation dialog
    setFolderToDelete(folder);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteFolder = async () => {
    if (!itemToDelete) return;
    
    try {
      await fileApi.deleteFolder(itemToDelete.id);
      
      // Reload file data from backend
      await loadFileData();
      setMoveMessage(`"${itemToDelete.name}" deleted successfully`);
      setShowMoveSuccess(true);
      setTimeout(() => setShowMoveSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting folder:', error);
      if (error.message === 'Authentication required. Please log in again.') {
        // Clear tokens and redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        window.location.href = '/signin';
        return;
      }
      
      // Show more specific error message
      if (error.message.includes('Server error') || error.message.includes('Cannot delete folder')) {
        setError(error.message);
      } else {
        setError('Failed to delete folder. Please try again.');
      }
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const cancelDeleteFolder = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setSelectedFile(null);
    setDeleteType(null);
  };

  // Inline editing functions
  const startEditing = (item, type) => {
    setEditingItem({ type, id: item.id, name: item.name });
    
    // For files, show name without extension in input field
    if (type === 'file') {
      const lastDotIndex = item.name.lastIndexOf('.');
      const nameWithoutExtension = lastDotIndex > 0 ? item.name.substring(0, lastDotIndex) : item.name;
      setEditName(nameWithoutExtension);
    } else {
      setEditName(item.name);
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName('');
  };

  const handleCancelRename = () => {
    cancelEditing();
    setLocalFeedbackMessage('Name change canceled');
    setShowLocalFeedback(true);
    setTimeout(() => setShowLocalFeedback(false), 3000);
  };

    const handleRename = async () => {
    if (!editingItem || !editName.trim()) {
      return;
    }

    const newName = editName.trim();
    
    // Validate the new name
    const validationError = editingItem.type === 'file' 
      ? validateFileName(newName) 
      : validateFolderName(newName);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // For files, check duplicates with the final name (including extension)
    let finalName = newName;
    if (editingItem.type === 'file') {
      const originalName = editingItem.name;
      const lastDotIndex = originalName.lastIndexOf('.');
      const originalExtension = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : '';
      finalName = newName + originalExtension;
    }
    
    // Check for duplicates
    const isDuplicate = editingItem.type === 'file'
      ? checkDuplicateFileName(finalName, currentPath, editingItem.id)
      : checkDuplicateFolderName(newName, currentPath, editingItem.id);
    
    if (isDuplicate) {
      setError(`${editingItem.type === 'file' ? 'File' : 'Folder'} "${newName}" already exists in this location.`);
      return;
    }

    try {
      // For files, preserve the original extension
      let finalName = newName;
      if (editingItem.type === 'file') {
        const originalName = editingItem.name;
        const lastDotIndex = originalName.lastIndexOf('.');
        const originalExtension = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : '';
        finalName = newName + originalExtension;
      }
      
      // Check if the name actually changed
      const originalName = editingItem.name;
      if (finalName === originalName) {
        const message = `${editingItem.type === 'file' ? 'File' : 'Folder'} name unchanged`;
        setLocalFeedbackMessage(message);
        setShowLocalFeedback(true);
        setTimeout(() => setShowLocalFeedback(false), 3000);
        cancelEditing();
        return;
      }

      if (editingItem.type === 'file') {
        await fileApi.renameFile(editingItem.id, finalName);
        setLocalFeedbackMessage(`File renamed to "${finalName}" successfully!`);
      } else {
        await fileApi.renameFolder(editingItem.id, finalName);
        setLocalFeedbackMessage(`Folder renamed to "${finalName}" successfully!`);
      }
      
      // Reload file data from backend
      await loadFileData();
      setShowLocalFeedback(true);
      setTimeout(() => setShowLocalFeedback(false), 3000);
      cancelEditing();
    } catch (error) {
      if (error.message === 'Authentication required. Please log in again.') {
        // Clear tokens and redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        window.location.href = '/signin';
        return;
      }
      setError(`Failed to rename ${editingItem.type}. Please try again.`);
      console.error('Error renaming item:', error);
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const handleDownloadFile = async () => {
    console.log('=== handleDownloadFile START ===');
    console.log('Download button clicked for file:', selectedFile);
    
    if (!selectedFile) {
      return;
    }
    

    
    try {
      const response = await fileApi.downloadFile(selectedFile.id);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      // Alternative download method if blob size is 0
      if (blob.size === 0) {
        // Try direct download using the API URL
        const downloadUrl = `/api/files/${selectedFile.id}/download/`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = selectedFile.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedFile.name;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
      handleFileMenuClose();
    } catch (error) {
      setError('Failed to download file. Please try again.');
    }
  };

  const handleDuplicateFile = async () => {
    if (!selectedFile) return;
    
    try {
      await fileApi.duplicateFile(selectedFile.id);
      // Refresh the file list to show the new duplicate
      await loadFileData();
      handleFileMenuClose();
      setError(null);
    } catch (error) {
      console.error('Error duplicating file:', error);
      setError('Failed to duplicate file. Please try again.');
    }
  };

  const handleDuplicateFolder = async () => {
    if (!selectedFolder) return;
    
    try {
      await fileApi.duplicateFolder(selectedFolder.id);
      // Refresh the folder list to show the new duplicate
      await loadFileData();
      handleFolderMenuClose();
      setError(null);
    } catch (error) {
      console.error('Error duplicating folder:', error);
      setError('Failed to duplicate folder. Please try again.');
    }
  };

  const handleDownloadFolder = async () => {
    if (!selectedFolder) return;
    
    try {
      // Use the fileApi to download the folder with proper authentication
      const response = await fileApi.downloadFolder(selectedFolder.id);
      
      // Create a blob from the response
      const blob = new Blob([response.data], { 
        type: 'application/zip' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedFolder.name}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      handleFolderMenuClose();
    } catch (error) {
      if (error.message === 'Authentication required. Please log in again.') {
        // Clear tokens and redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        window.location.href = '/signin';
        return;
      }
      setError('Failed to download folder. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validation functions
  const checkDuplicateFileName = (fileName, currentPath = '/', excludeId = null) => {
    const filesInCurrentPath = files.filter(file => file.path === currentPath);
    return filesInCurrentPath.some(file => 
      file.name.toLowerCase() === fileName.toLowerCase() && 
      (!excludeId || file.id !== excludeId)
    );
  };

  const checkDuplicateFolderName = (folderName, currentPath = '/', excludeId = null) => {
    const foldersInCurrentPath = folders.filter(folder => folder.path === currentPath);
    return foldersInCurrentPath.some(folder => 
      folder.name.toLowerCase() === folderName.toLowerCase() && 
      (!excludeId || folder.id !== excludeId)
    );
  };

  const validateFileName = (fileName) => {
    if (!fileName || fileName.trim() === '') {
      return 'File name cannot be empty';
    }
    if (fileName.length > 255) {
      return 'File name is too long (maximum 255 characters)';
    }
    // Check for invalid characters (matching backend validation)
    const invalidChars = ['<', '>', ':', '"', '|', '?', '*', '\\', '/'];
    for (const char of invalidChars) {
      if (fileName.includes(char)) {
        return `File name cannot contain: ${char}`;
      }
    }
    // Check for reserved names (matching backend validation)
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    if (reservedNames.includes(fileName.toUpperCase())) {
      return `'${fileName}' is a reserved name and cannot be used`;
    }
    return null;
  };

  const validateFolderName = (folderName) => {
    if (!folderName || folderName.trim() === '') {
      return 'Folder name cannot be empty';
    }
    if (folderName.length > 255) {
      return 'Folder name is too long (maximum 255 characters)';
    }
    // Check for invalid characters (matching backend validation)
    const invalidChars = ['<', '>', ':', '"', '|', '?', '*', '\\', '/'];
    for (const char of invalidChars) {
      if (folderName.includes(char)) {
        return `Folder name cannot contain: ${char}`;
      }
    }
    // Check for reserved names (matching backend validation)
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    if (reservedNames.includes(folderName.toUpperCase())) {
      return `'${folderName}' is a reserved name and cannot be used`;
    }
    return null;
  };

  // File type validation for uploads
  const validateFileType = (fileName) => {
    const allowedExtensions = [
      // PDF files
      '.pdf',
      // Excel files
      '.xlsx', '.xls', '.xlsm', '.xlsb', '.xltx', '.xltm',
      // Word files
      '.docx', '.doc', '.docm', '.dotx', '.dotm',
      // PowerPoint files
      '.pptx', '.ppt', '.pptm', '.potx', '.potm',
      // Image files
      '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.svg', '.webp', '.ico', '.jfif', '.pjpeg', '.pjp'
    ];
    
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
      return false; // No extension or file ends with dot
    }
    
    const fileExtension = fileName.toLowerCase().substring(lastDotIndex);
    return allowedExtensions.includes(fileExtension);
  };

  // Generate numbered filename for duplicates
  const generateNumberedFileName = (originalName, existingFiles) => {
    const lastDotIndex = originalName.lastIndexOf('.');
    const nameWithoutExt = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;
    const extension = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : '';
    
    let counter = 1;
    let newName = `${nameWithoutExt} (${counter})${extension}`;
    
    // Check if this numbered name also exists
    while (existingFiles.some(file => file.name === newName)) {
      counter++;
      newName = `${nameWithoutExt} (${counter})${extension}`;
    }
    
    return newName;
  };

  // Get current folder ID based on current path
  const getCurrentFolderId = () => {
    if (currentPath === '/') {
      return null; // Root folder
    }
    
    // Find folder by path
    const folder = folders.find(f => {
      if (f.full_path) {
        return '/' + f.full_path === currentPath;
      }
      return '/' + f.name === currentPath;
    });
    
    return folder ? folder.id : null;
  };

  // Sort files and folders based on current sort settings
  const getSortedFilesAndFolders = () => {
    const currentFiles = files.filter(file => file.path === currentPath);
    const currentFolders = folders.filter(folder => folder.path === currentPath);
    
    const sortedItems = [...currentFolders, ...currentFiles].sort((a, b) => {
      let aValue, bValue;
      
      switch (fileSortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
          aValue = a.created_at || a.uploaded_at || '';
          bValue = b.created_at || b.uploaded_at || '';
          break;
        case 'type':
          // For folders, use 'folder', for files, use file extension
          aValue = a.type === 'folder' ? 'folder' : (a.file_type || '').toLowerCase();
          bValue = b.type === 'folder' ? 'folder' : (b.file_type || '').toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) {
        return fileSortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return fileSortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sortedItems;
  };

  // LocalStorage functions for file persistence


  // Drag and drop handlers
  const handleFileDragStart = (e, file) => {
    setDraggedFile(file);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', file.id);
  };

  const handleFileDragEnd = () => {
    setDraggedFile(null);
    setDragOverFolder(null);
  };

  const handleFolderDragOver = (e, folder) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folder);
  };

  const handleFolderDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleFolderDrop = async (e, folder) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling to parent drop zones
    
    if (draggedFile && draggedFile.id) {
      // Check if moving to the same location
      if (draggedFile.folder === folder.id) {
        setError(`File "${draggedFile.name}" is already in the "${folder.name}" folder.`);
        setDraggedFile(null);
        setDragOverFolder(null);
        return;
      }

      // Check for duplicate file names in the target folder
      const targetFolderPath = folder.full_path ? '/' + folder.full_path : '/' + folder.name;
      if (checkDuplicateFileName(draggedFile.name, targetFolderPath)) {
        setError(`A file named "${draggedFile.name}" already exists in the "${folder.name}" folder. Please rename the file first.`);
        setDraggedFile(null);
        setDragOverFolder(null);
        return;
      }

      try {
        // Backend expects folder_id, not path
        // We need to send the folder ID to move the file to that specific folder
        await fileApi.moveFile(draggedFile.id, folder.id);
        
        // Reload file data from backend
        await loadFileData();
        setMoveMessage(`"${draggedFile.name}" moved to "${folder.name}" folder`);
        setShowMoveSuccess(true);
        setTimeout(() => setShowMoveSuccess(false), 3000);
      } catch (error) {
        if (error.message === 'Authentication required. Please log in again.') {
          // Clear tokens and redirect to login
          localStorage.removeItem('adminToken');
          localStorage.removeItem('token');
          localStorage.removeItem('adminEmail');
          window.location.href = '/signin';
          return;
        }
        // Show more specific error message
        if (error.message.includes('Bad request') || error.message.includes('Server error')) {
          setError(error.message);
        } else {
          setError('Failed to move file. Please try again.');
        }
        console.error('Error moving file:', error);
      }
    }
    setDraggedFile(null);
    setDragOverFolder(null);
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    if (draggedFile && draggedFile.id) {
      // Check if moving to the same location (already in root)
      if (!draggedFile.folder) {
        setError(`File "${draggedFile.name}" is already in the current directory.`);
        setDraggedFile(null);
        return;
      }

      // Check for duplicate file names in the root directory
      if (checkDuplicateFileName(draggedFile.name, '/')) {
        setError(`A file named "${draggedFile.name}" already exists in the current directory. Please rename the file first.`);
        setDraggedFile(null);
        return;
      }

      try {
        // For moving to current directory (root), send null as folder_id
        // This will move the file to the root level (no folder)
        await fileApi.moveFile(draggedFile.id, null);
        
        // Reload file data from backend
        await loadFileData();
        setMoveMessage(`"${draggedFile.name}" moved to current directory`);
        setShowMoveSuccess(true);
        setTimeout(() => setShowMoveSuccess(false), 3000);
      } catch (error) {
        if (error.message === 'Authentication required. Please log in again.') {
          // Clear tokens and redirect to login
          localStorage.removeItem('adminToken');
          localStorage.removeItem('token');
          localStorage.removeItem('adminEmail');
          window.location.href = '/signin';
          return;
        }
        // Show more specific error message
        if (error.message.includes('Bad request') || error.message.includes('Server error')) {
          setError(error.message);
        } else {
          setError('Failed to move file. Please try again.');
        }
        console.error('Error moving file:', error);
      }
    }
    setDraggedFile(null);
  };

  // 2. Add handleFolderSort, getFolderSortIcon, and getSortedFolders functions after getFileSortIcon
  const handleFolderSort = (field) => {
    if (folderSortField === field) {
      setFolderSortDirection(folderSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setFolderSortField(field);
      setFolderSortDirection('asc');
    }
  };
  const getFolderSortIcon = (field) => {
    if (folderSortField !== field) {
      return <UnfoldMoreIcon className="admin-sort-icon-inactive" sx={{ fontSize: '1.2rem' }} />;
    }
    const iconClass = 'admin-sort-icon-active-blue';
    if (folderSortDirection === 'asc') {
      return <ArrowUpwardIcon className={iconClass} sx={{ fontSize: '1.2rem' }} />;
    } else {
      return <ArrowDownwardIcon className={iconClass} sx={{ fontSize: '1.2rem' }} />;
    }
  };
  const getSortedFolders = () => {
    const currentFolders = folders.filter(folder => folder.path === currentPath);
    return currentFolders.sort((a, b) => {
      let aValue, bValue;
      switch (folderSortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
          aValue = a.created_at || '';
          bValue = b.created_at || '';
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return folderSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return folderSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Handle clicks outside file manager to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileManagerRef.current && !fileManagerRef.current.contains(event.target)) {
        if (fileMenuAnchor || folderMenuAnchor) {
          // Add closing animation class before closing
          const menuElements = document.querySelectorAll('.admin-custom-menu');
          menuElements.forEach(menu => {
            menu.classList.add('closing');
          });
          
          // Close menus after animation
          setTimeout(() => {
            handleFileMenuClose();
            handleFolderMenuClose();
          }, 200);
        }
      }
    };

    if (fileMenuAnchor || folderMenuAnchor) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fileMenuAnchor, folderMenuAnchor]);

  if (loading) {
    return (
      <Box className="admin-dashboard-loading">
        <CircularProgress size={60} className="admin-loading-spinner" />
      </Box>
    );
  }

  return (
    <Box className={`admin-dashboard-main ${isVisible ? 'animate' : ''}`}>
      <Container maxWidth="xl" className="admin-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
          transition={{ duration: 0.6 }}
        >
          <Box className="admin-header">
            <Box className="admin-header-content">
              <DashboardIcon className="admin-dashboard-icon" />
              <Typography variant="h3" className="admin-title">
                Admin Dashboard
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Main Content Area */}
        <Box className="admin-main-content">
          {/* Main Content */}
          <Box className="admin-content-area">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Box className="admin-stats-grid">
                <Paper className="admin-stats-card-contact">
                  <ContactMailIcon className="admin-stats-icon-contact" />
                  <Box>
                    <Typography variant="h4" className="admin-stats-number">
                      {contactData.length}
                    </Typography>
                    <Typography variant="body1" className="admin-stats-label">
                      Contact Submissions
                    </Typography>
                  </Box>
                </Paper>

                <Paper className="admin-stats-card-waitlist">
                  <PeopleIcon className="admin-stats-icon-waitlist" />
                  <Box>
                    <Typography variant="h4" className="admin-stats-number">
                      {waitlistData.length}
                    </Typography>
                    <Typography variant="body1" className="admin-stats-label">
                      Waitlist Entries
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </motion.div>

        {/* Error Display */}
        {error && (
          <Alert severity="error" className="admin-error-alert">
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {showMoveSuccess && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 9999,
              minWidth: 300,
              animation: 'successMessageFloat 3s ease-in-out forwards'
            }}
            onClose={() => setShowMoveSuccess(false)}
          >
            {moveMessage}
          </Alert>
        )}

        {/* Tabs and Content */}
        <Paper className="admin-tabs-container">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className="admin-tabs-header"
            TabIndicatorProps={{
              className: 'admin-tabs-indicator'
            }}
          >
            <Tab
              className="admin-tab"
              label={
                <Box className="admin-tab-content">
                  <span>Contact Submissions</span>
                  <Badge badgeContent={contactData.length} color="error" />
                </Box>
              }
            />
            <Tab
              className="admin-tab"
              label={
                <Box className="admin-tab-content">
                  <span>Waitlist Entries</span>
                  <Badge badgeContent={waitlistData.length} color="success" />
                </Box>
              }
            />
          </Tabs>

            {/* Search Bar */}
            <Box className="admin-search-container">
              <TextField
                fullWidth
                placeholder={`Search ${activeTab === 0 ? 'contacts' : 'waitlist entries'}...`}
                value={searchTerm}
                onChange={handleSearchChange}
                className="admin-search-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="admin-search-icon" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Data Table */}
            <TableContainer className="admin-table-container">
              <Table>
                <TableHead>
                  <TableRow className="admin-table-header">
                    {activeTab === 0 ? (
                      <>
                        <TableCell className="admin-table-header-cell admin-column-name">
                          <Box className="admin-header-with-sort" onClick={() => handleSort('name')}>
                            <span>Name</span>
                            {getSortIcon('name')}
                          </Box>
                        </TableCell>
                        <TableCell className="admin-table-header-cell admin-column-email">
                          <Box className="admin-header-with-sort" onClick={() => handleSort('email')}>
                            <span>Email</span>
                            {getSortIcon('email')}
                          </Box>
                        </TableCell>
                        <TableCell className="admin-table-header-cell admin-column-type">
                          <Box className="admin-header-with-sort" onClick={() => handleSort('type')}>
                            <span>Type</span>
                            {getSortIcon('type')}
                          </Box>
                        </TableCell>
                        <TableCell className="admin-table-header-cell admin-column-status">
                          <Box className="admin-header-with-sort" onClick={() => handleSort('status')}>
                            <span>Status</span>
                            {getSortIcon('status')}
                          </Box>
                        </TableCell>
                        <TableCell className="admin-table-header-cell admin-column-created">
                          <Box className="admin-header-with-sort" onClick={() => handleSort('created')}>
                            <span>Created</span>
                            {getSortIcon('created')}
                          </Box>
                        </TableCell>
                        <TableCell className="admin-table-header-cell admin-column-actions">Actions</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="admin-table-header-cell admin-column-email">
                          <Box className="admin-header-with-sort" onClick={() => handleSort('email')}>
                            <span>Email</span>
                            {getSortIcon('email')}
                          </Box>
                        </TableCell>
                        <TableCell className="admin-table-header-cell admin-column-created">
                          <Box className="admin-header-with-sort" onClick={() => handleSort('created')}>
                            <span>Created</span>
                            {getSortIcon('created')}
                          </Box>
                        </TableCell>
                        <TableCell className="admin-table-header-cell admin-column-actions">Actions</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((entry) => (
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
                              className={`admin-feedback-chip-${entry.feedback_type.toLowerCase()}`}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={entry.is_read ? 'Read' : 'Unread'}
                              className={entry.is_read ? 'admin-status-chip-read' : 'admin-status-chip-unread'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {formatTableDate(entry.created_at)}
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
          </Box>

          {/* Modern Faded Divider between Main Content and File Manager */}
          <Divider className="admin-modern-divider" />

          {/* File Management Panel - Now below the content area */}
          <Box className="admin-file-manager-container" ref={fileManagerRef} sx={{ position: 'relative' }}>
            <Paper className="admin-file-manager-paper">
              {/* File Panel Header */}
              <Box className="admin-file-manager-header">
                <Typography variant="h6" className="admin-file-manager-title">
                  File Manager
                </Typography>
                <Box className="admin-file-manager-actions">
                  <Tooltip title="Upload Files">
                    <IconButton
                      size="small"
                      onClick={() => setFileUploadDialogOpen(true)}
                      className="admin-upload-button"
                    >
                      <UploadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Create Folder">
                    <IconButton
                      size="small"
                      onClick={() => setFolderDialogOpen(true)}
                      className="admin-create-folder-button"
                    >
                      <CreateFolderIcon className="admin-create-folder-icon" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Local Feedback Message */}
              {showLocalFeedback && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10000,
                    background: 'rgba(34, 197, 94, 0.9)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                    animation: 'successMessageFloat 3s ease-in-out forwards',
                    pointerEvents: 'none',
                    minWidth: '200px',
                    textAlign: 'center'
                  }}
                >
                  {localFeedbackMessage}
                </Box>
              )}

              {/* File Manager Content - Always visible */}
              <Box 
                sx={{ flex: 1, overflow: 'auto', p: 1 }}
                onDragOver={handleFileDragOver}
                onDrop={handleFileDrop}
              >
                  {/* Drag Drop Instructions */}
                  {files.filter(file => file.path === currentPath).length > 0 && (
                    <Box sx={{ 
                      p: 1, 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <Typography variant="caption" sx={{ color: '#3b82f6', fontSize: '0.75rem' }}>
                        💡 Drag files to folders or drop in current directory
                      </Typography>
                    </Box>
                  )}

                {/* Current Path */}
                <Box sx={{ 
                  p: 1.5, 
                  mb: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  backgroundColor: currentPath !== '/' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1,
                  border: currentPath !== '/' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {currentPath !== '/' && (
                    <Tooltip title="Back">
                      <IconButton
                        size="small"
                        onClick={() => {
                          const pathParts = currentPath.split('/').filter(part => part);
                          const newPath = pathParts.length > 1 
                            ? '/' + pathParts.slice(0, -1).join('/')
                            : '/';
                          setCurrentPath(newPath);
                        }}
                        sx={{ color: '#a1a1aa' }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {currentPath !== '/' && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#3b82f6',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    >
                      📁 {currentPath}
                    </Typography>
                  )}
                </Box>

                {/* Folders - Only show in root directory */}
                {currentPath === '/' && (
                  <Box sx={{ mb: 2 }}>
                    {/* Folders Sort Bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', fontWeight: 600, mr: 1 }}>Folders</Typography>
                      <Tooltip title="Sort by Name">
                        <IconButton size="small" onClick={() => handleFolderSort('name')} sx={{ color: '#a1a1aa' }}>
                          {getFolderSortIcon('name')}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sort by Created Date">
                        <IconButton size="small" onClick={() => handleFolderSort('created')} sx={{ color: '#a1a1aa' }}>
                          {getFolderSortIcon('created')}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {/* Folders List */}
                    {getSortedFolders().map((folder) => {
                      return (
                        <ListItem
                          key={folder.id}
                          sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            cursor: 'pointer',
                            backgroundColor: dragOverFolder?.id === folder.id ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                            border: dragOverFolder?.id === folder.id ? '3px dashed #3b82f6' : '2px solid transparent',
                            transition: 'all 0.2s ease',
                            transform: dragOverFolder?.id === folder.id ? 'scale(1.02)' : 'scale(1)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                          onClick={(e) => {
                            // Only navigate if not dragging a file
                            if (!draggedFile) {
                              setCurrentPath(currentPath === '/' ? `/${folder.name}` : `${currentPath}/${folder.name}`);
                            }
                          }}
                          onDrop={(e) => handleFolderDrop(e, folder)}
                          onDragOver={(e) => handleFolderDragOver(e, folder)}
                          onDragLeave={handleFolderDragLeave}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <FolderIcon className="admin-folder-icon" />
                          </ListItemIcon>
                        <ListItemText
                          primary={
                            editingItem && editingItem.type === 'folder' && editingItem.id === folder.id ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyPress={handleEditKeyPress}
                                  autoFocus
                                    sx={{
                                      color: 'white',
                                      fontSize: '0.875rem',
                                      '& .MuiInput-input': {
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        padding: '4px 8px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 1,
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        '&:focus': {
                                          borderColor: '#3b82f6',
                                          backgroundColor: 'rgba(255, 255, 255, 0.15)'
                                        }
                                      }
                                    }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={handleRename}
                                    sx={{ color: '#22c55e', p: 0.5 }}
                                >
                                    <Box sx={{ fontSize: '0.75rem' }}>✓</Box>
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={handleCancelRename}
                                    sx={{ color: '#ef4444', p: 0.5 }}
                                >
                                    <Box sx={{ fontSize: '0.75rem' }}>✕</Box>
                                </IconButton>
                              </Box>
                            ) : (
                              <Box
                                onClick={() => {
                                  // Navigate into the folder instead of editing
                                  setCurrentPath(folder.full_path ? '/' + folder.full_path : '/' + folder.name);
                                }}
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                      borderRadius: 1,
                                      padding: '2px 4px',
                                      margin: '-2px -4px'
                                    }
                                  }}
                              >
                                {folder.name}
                              </Box>
                            )
                          }
                            secondary={
                              folder.created_at ? `📅 Created ${formatDate(folder.created_at)}` : ''
                            }
                          primaryTypographyProps={{
                              sx: { color: 'white', fontSize: '0.875rem' }
                          }}
                          secondaryTypographyProps={{
                              sx: { color: '#a1a1aa', fontSize: '0.75rem' }
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                              onClick={(e) => handleFolderMenuOpen(e, folder)}
                              sx={{ color: '#a1a1aa' }}
                          >
                              <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </Box>
                )}
                <Box>
                  {/* Files Sort Bar */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#a1a1aa', fontWeight: 600, mr: 1 }}>Files</Typography>
                    <Tooltip title="Sort by Name">
                      <IconButton size="small" onClick={() => handleFileSort('name')} sx={{ color: '#a1a1aa' }}>
                        {getFileSortIcon('name')}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sort by Created Date">
                      <IconButton size="small" onClick={() => handleFileSort('created')} sx={{ color: '#a1a1aa' }}>
                        {getFileSortIcon('created')}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sort by File Type">
                      <IconButton size="small" onClick={() => handleFileSort('type')} sx={{ color: '#a1a1aa' }}>
                        {getFileSortIcon('type')}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {/* Files List */}
                  {getSortedFiles().map((file) => {
                    return (
                    <ListItem
                      key={file.id}
                      draggable
                      onDragStart={(e) => handleFileDragStart(e, file)}
                      onDragEnd={handleFileDragEnd}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        cursor: 'grab',
                        opacity: draggedFile?.id === file.id ? 0.3 : 1,
                        backgroundColor: draggedFile?.id === file.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        border: draggedFile?.id === file.id ? '2px solid #3b82f6' : '2px solid transparent',
                        transform: draggedFile?.id === file.id ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        },
                        '&:active': {
                          cursor: 'grabbing'
                        }
                      }}
                      secondaryAction={
                        <IconButton
                          size="small"
                                                      onClick={(e) => handleFileMenuOpen(e, file)}
                          sx={{ color: '#a1a1aa' }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon sx={{ color: '#3b82f6', minWidth: 36 }}>
                        {getFileIcon(file.name)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          editingItem && editingItem.type === 'file' && editingItem.id === file.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyPress={handleEditKeyPress}
                                autoFocus
                                sx={{
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  '& .MuiInput-input': {
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    padding: '4px 8px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 1,
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    '&:focus': {
                                      borderColor: '#3b82f6',
                                      backgroundColor: 'rgba(255, 255, 255, 0.15)'
                                    }
                                  }
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={handleRename}
                                sx={{ color: '#22c55e', p: 0.5 }}
                              >
                                <Box sx={{ fontSize: '0.75rem' }}>✓</Box>
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={handleCancelRename}
                                sx={{ color: '#ef4444', p: 0.5 }}
                              >
                                <Box sx={{ fontSize: '0.75rem' }}>✕</Box>
                              </IconButton>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                cursor: 'default',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  borderRadius: 1,
                                  padding: '2px 4px',
                                  margin: '-2px -4px'
                                }
                              }}
                            >
                              {file.name}
                            </Box>
                          )
                        }
                        secondary={
                          `${formatFileSize(file.size)}${file.uploaded_at ? ` • 📅 ${formatDate(file.uploaded_at)}` : ''}`
                        }
                        primaryTypographyProps={{
                          sx: { color: 'white', fontSize: '0.875rem' }
                        }}
                        secondaryTypographyProps={{
                          sx: { color: '#a1a1aa', fontSize: '0.75rem' }
                        }}
                      />
                    </ListItem>
                  );
                  })}
                </Box>
                {files.filter(file => file.path === currentPath).length === 0 && 
                 folders.filter(folder => folder.path === currentPath).length === 0 && (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      No files or folders
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Custom Menu Container - Inside file manager */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: fileMenuAnchor || folderMenuAnchor ? 'all' : 'none',
                zIndex: 1300,
                padding: '2px'
              }}
              onClick={(e) => {
                // Close menu if clicking on backdrop
                if (e.target === e.currentTarget) {
                  handleFileMenuClose();
                  handleFolderMenuClose();
                }
              }}
            >
              {/* File Menu */}
              {fileMenuAnchor && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'all',
                    background: 'rgba(15, 15, 35, 0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 1,
                    minWidth: 180,
                    maxWidth: 200,
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    animation: 'slideInFromRight 0.2s ease-out',
                    transformOrigin: 'top right'
                  }}
                  className="admin-custom-menu"
                >
                  <MenuItem onClick={() => {
                    startEditing(selectedFile, 'file');
                    handleFileMenuClose();
                  }} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <ListItemIcon>
                      <Box sx={{ color: '#22c55e', fontSize: '1.2rem' }}>✏️</Box>
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleDownloadFile();
                    handleFileMenuClose();
                  }} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <ListItemIcon>
                      <DownloadIcon sx={{ color: '#3b82f6' }} />
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleDuplicateFile();
                    handleFileMenuClose();
                  }} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <ListItemIcon>
                      <Box sx={{ color: '#22c55e', fontSize: '1.2rem' }}>📋</Box>
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    // Store the file being deleted
                    setItemToDelete(selectedFile);
                    setDeleteType('file');
                    setShowDeleteConfirm(true);
                    handleFileMenuClose();
                  }} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <ListItemIcon>
                      <DeleteIcon sx={{ color: '#ef4444' }} />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </Box>
              )}

              {/* Folder Menu */}
              {folderMenuAnchor && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'all',
                    background: 'rgba(15, 15, 35, 0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 1,
                    minWidth: 180,
                    maxWidth: 200,
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    animation: 'slideInFromRight 0.2s ease-out',
                    transformOrigin: 'top right'
                  }}
                  className="admin-custom-menu"
                >
                  <MenuItem onClick={() => {
                    startEditing(selectedFolder, 'folder');
                    handleFolderMenuClose();
                  }} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <ListItemIcon>
                      <Box sx={{ color: '#22c55e', fontSize: '1.2rem' }}>✏️</Box>
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleDownloadFolder();
                    handleFolderMenuClose();
                  }} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <ListItemIcon>
                      <DownloadIcon sx={{ color: '#3b82f6' }} />
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleDuplicateFolder();
                    handleFolderMenuClose();
                  }} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <ListItemIcon>
                      <Box sx={{ color: '#22c55e', fontSize: '1.2rem' }}>📋</Box>
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setItemToDelete(selectedFolder);
                    setDeleteType('folder');
                    setShowDeleteConfirm(true);
                    handleFolderMenuClose();
                  }} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <ListItemIcon>
                      <DeleteIcon sx={{ color: '#ef4444' }} />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </Box>
              )}
            </Box>
          </Box>
        </Box>



        {/* File Upload Dialog */}
        <Dialog
          open={fileUploadDialogOpen}
          onClose={() => setFileUploadDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          disableEnforceFocus
          disableAutoFocus
          disableRestoreFocus
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'white'
            }
          }}
        >
          <DialogTitle>
            Upload Files
            {currentPath !== '/' && (
              <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 1, fontWeight: 'normal' }}>
                Files will be uploaded to: {currentPath}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
            {currentPath !== '/' && (
                <Box sx={{ 
                  mb: 2, 
                  p: 2, 
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                  borderRadius: 1,
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 500 }}>
                  📁 Uploading to folder: {currentPath}
                </Typography>
              </Box>
            )}
            <Input
              type="file"
              inputProps={{ 
                multiple: true,
                accept: ".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg,.bmp,.tiff,.webp,.ico,.mp4,.avi,.mov,.wmv,.flv,.webm,.mp3,.wav,.flac,.aac,.ogg,.zip,.rar,.7z,.tar,.gz,.txt,.md,.rtf"
              }}
              onChange={handleFileUpload}
                sx={{ color: 'white' }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#a1a1aa', 
                  mt: 1, 
                  display: 'block',
                  fontSize: '0.75rem'
                }}
              >
              Supported formats: PDF, Word, Excel, PowerPoint, Images, Videos, Audio, Archives, Text files
            </Typography>
            {uploadingFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: '#a1a1aa', fontSize: '0.75rem', mb: 1, display: 'block' }}>
                  📅 Upload started at {formatDate(new Date().toISOString())}
                </Typography>
                {uploadingFiles.map((file, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                      {file.file.name}
                    </Typography>
                      <Box sx={{ width: '100%', bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
                        <Box
                          sx={{
                            width: `${file.progress}%`,
                            height: 4,
                            bgcolor: '#3b82f6',
                            borderRadius: 1,
                            transition: 'width 0.3s ease'
                          }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFileUploadDialogOpen(false)} sx={{ color: '#a1a1aa' }}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Folder Dialog */}
        <Dialog
          open={folderDialogOpen}
          onClose={() => setFolderDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          disableEnforceFocus
          disableAutoFocus
          disableRestoreFocus
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'white'
            }
          }}
        >
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
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
              InputLabelProps={{
                sx: { color: '#a1a1aa' }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFolderDialogOpen(false)} sx={{ color: '#a1a1aa' }}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} sx={{ color: '#3b82f6' }}>
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          disableEnforceFocus
          disableAutoFocus
          disableRestoreFocus
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
                        className={`admin-feedback-chip-${selectedEntry.feedback_type.toLowerCase()}`}
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Status
                      </Typography>
                      <Chip
                        label={selectedEntry.is_read ? 'Read' : 'Unread'}
                        className={selectedEntry.is_read ? 'admin-status-chip-read' : 'admin-status-chip-unread'}
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

        {/* Custom Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteConfirm}
          onClose={cancelDeleteFolder}
          disableEnforceFocus
          disableAutoFocus
          disableRestoreFocus
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              minWidth: 400,
              maxWidth: 500
            }
          }}
        >
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <DeleteIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600 }}>
                Delete {deleteType === 'file' ? 'File' : 'Folder'}
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ color: '#374151', mb: 1 }}>
              Are you sure you want to delete the {deleteType === 'file' ? 'file' : 'folder'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#1f2937', 
                fontWeight: 600, 
                mb: 2,
                backgroundColor: '#f3f4f6',
                padding: 1,
                borderRadius: 1,
                display: 'inline-block'
              }}
            >
              "{itemToDelete?.name}"
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {deleteType === 'file' 
                ? 'This action cannot be undone. The file will be permanently deleted.'
                : 'This action cannot be undone. All files and subfolders inside this folder will also be deleted.'
              }
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={cancelDeleteFolder}
              sx={{
                color: '#6b7280',
                border: '1px solid #d1d5db',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#9ca3af'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteType === 'file' ? handleDeleteFile : confirmDeleteFolder}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #0a0909, #be0303, #be0303)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 500,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #be0303, #0a0909, #be0303)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }
              }}
            >
              Delete {deleteType === 'file' ? 'File' : 'Folder'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* File Upload Confirmation Dialog */}
        <Dialog
          open={showUploadConfirm}
          onClose={handleUploadCancel}
          disableEnforceFocus
          disableAutoFocus
          disableRestoreFocus
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              minWidth: 400,
              maxWidth: 500
            }
          }}
        >
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <Box sx={{ color: 'white', fontSize: 24 }}>📁</Box>
              </Box>
              <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600 }}>
                File Already Exists
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ color: '#374151', mb: 2 }}>
              A file named <strong>"{duplicateFileName}"</strong> already exists in this location.
            </Typography>
            
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
              Choose what you'd like to do with the uploaded file:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                onClick={() => setUploadAction('replace')}
                variant={uploadAction === 'replace' ? 'contained' : 'outlined'}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  border: uploadAction === 'replace' ? '2px solid #3b82f6' : '1px solid #d1d5db',
                  backgroundColor: uploadAction === 'replace' ? '#3b82f6' : 'transparent',
                  color: uploadAction === 'replace' ? 'white' : '#374151',
                  '&:hover': {
                    backgroundColor: uploadAction === 'replace' ? '#2563eb' : '#f9fafb',
                    borderColor: uploadAction === 'replace' ? '#2563eb' : '#9ca3af'
                  }
                }}
              >
                <Box sx={{ mr: 2, fontSize: '1.2rem' }}>🔄</Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Replace existing file
                  </Typography>
                  <Typography variant="caption" sx={{ color: uploadAction === 'replace' ? 'rgba(255,255,255,0.8)' : '#6b7280' }}>
                    The existing file will be permanently deleted and replaced with the new one.
                  </Typography>
                </Box>
              </Button>
              
              <Button
                onClick={() => setUploadAction('duplicate')}
                variant={uploadAction === 'duplicate' ? 'contained' : 'outlined'}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  border: uploadAction === 'duplicate' ? '2px solid #22c55e' : '1px solid #d1d5db',
                  backgroundColor: uploadAction === 'duplicate' ? '#22c55e' : 'transparent',
                  color: uploadAction === 'duplicate' ? 'white' : '#374151',
                  '&:hover': {
                    backgroundColor: uploadAction === 'duplicate' ? '#16a34a' : '#f9fafb',
                    borderColor: uploadAction === 'duplicate' ? '#16a34a' : '#9ca3af'
                  }
                }}
              >
                <Box sx={{ mr: 2, fontSize: '1.2rem' }}>📋</Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Upload as duplicate
                  </Typography>
                  <Typography variant="caption" sx={{ color: uploadAction === 'duplicate' ? 'rgba(255,255,255,0.8)' : '#6b7280' }}>
                    The file will be uploaded with a numbered suffix (e.g., "file (1).pdf").
                  </Typography>
                </Box>
              </Button>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleUploadCancel}
              sx={{
                color: '#6b7280',
                border: '1px solid #d1d5db',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#9ca3af'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadConfirm}
              variant="contained"
              disabled={!uploadAction}
              sx={{
                background: 'linear-gradient(135deg, #0a0909, #be0303, #be0303)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: 500,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #be0303, #0a0909, #be0303)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                },
                '&:disabled': {
                  background: '#d1d5db',
                  color: '#6b7280',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {uploadAction === 'replace' ? 'Replace File' : uploadAction === 'duplicate' ? 'Upload Duplicate' : 'Continue'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 