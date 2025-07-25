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
  TextFields as TextIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchContactData, fetchWaitlistData } from '../services/adminApi';
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
  
  // File management state
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [draggedFile, setDraggedFile] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [showMoveSuccess, setShowMoveSuccess] = useState(false);
  const [moveMessage, setMoveMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // { type: 'file' | 'folder', id: number, name: string }
  const [editName, setEditName] = useState('');

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
          size: file.file_size || file.size || 0,
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
      
      console.log('Raw files data:', filesArray);
      console.log('Raw folders data:', foldersArray);
      console.log('Converted files:', convertedFiles);
      console.log('Converted folders:', convertedFolders);
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

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
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

  // File management functions
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PdfIcon />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <ExcelIcon />;
      case 'doc':
      case 'docx':
        return <WordIcon />;
      case 'ppt':
      case 'pptx':
        return <PowerPointIcon />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'bmp':
      case 'tiff':
      case 'webp':
      case 'ico':
        return <ImageIcon />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
        return <VideoIcon />;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
        return <AudioIcon />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <ArchiveIcon />;
      case 'txt':
      case 'md':
      case 'rtf':
        return <TextIcon />;
      default:
        return <FileIcon />;
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
    // Validate all files before starting upload
    for (const file of uploadedFiles) {
      // Check for duplicate file names
      if (checkDuplicateFileName(file.name, currentPath)) {
        setError(`File "${file.name}" already exists in this location. Please rename the file or choose a different location.`);
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
    
    setUploadingFiles(uploadedFiles.map(file => ({ file, progress: 0 })));
    setError(''); // Clear any previous errors
    
    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadingFiles(prev => 
            prev.map((f, index) => 
              index === i ? { ...f, progress } : f
            )
          );
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Upload file to backend
        await fileApi.uploadFile(file, currentPath);
      }
      
      // Reload file data from backend
      await loadFileData();
      const locationText = currentPath === '/' ? 'root directory' : `folder "${currentPath}"`;
      setMoveMessage(`${uploadedFiles.length} file(s) uploaded successfully to ${locationText}!`);
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
      setError('Failed to upload files. Please try again.');
      console.error('Error uploading files:', error);
    } finally {
      setUploadingFiles([]);
      setFileUploadDialogOpen(false);
      event.target.value = ''; // Reset file input
    }
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

  const handleDeleteFile = async () => {
    if (selectedFile) {
      try {
        await fileApi.deleteFile(selectedFile.id);
        
        // Reload file data from backend
        await loadFileData();
        setMoveMessage(`"${selectedFile.name}" deleted successfully`);
        setShowMoveSuccess(true);
        setTimeout(() => setShowMoveSuccess(false), 3000);
        handleFileMenuClose();
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
        console.error('Error deleting file:', error);
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
    if (!folderToDelete) return;
    
    try {
      await fileApi.deleteFolder(folderToDelete.id);
      
      // Reload file data from backend
      await loadFileData();
      setMoveMessage(`"${folderToDelete.name}" deleted successfully`);
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
      setFolderToDelete(null);
    }
  };

  const cancelDeleteFolder = () => {
    setShowDeleteConfirm(false);
    setFolderToDelete(null);
  };

  // Inline editing functions
  const startEditing = (item, type) => {
    setEditingItem({ type, id: item.id, name: item.name });
    setEditName(item.name);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName('');
  };

  const handleRename = async () => {
    if (!editingItem || !editName.trim()) {
      cancelEditing();
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

    // Check for duplicates
    const isDuplicate = editingItem.type === 'file'
      ? checkDuplicateFileName(newName, currentPath)
      : checkDuplicateFolderName(newName, currentPath);
    
    if (isDuplicate) {
      setError(`${editingItem.type === 'file' ? 'File' : 'Folder'} "${newName}" already exists in this location.`);
      return;
    }

    try {
      if (editingItem.type === 'file') {
        await fileApi.renameFile(editingItem.id, newName);
        setMoveMessage(`File renamed to "${newName}" successfully!`);
      } else {
        await fileApi.renameFolder(editingItem.id, newName);
        setMoveMessage(`Folder renamed to "${newName}" successfully!`);
      }
      
      // Reload file data from backend
      await loadFileData();
      setShowMoveSuccess(true);
      setTimeout(() => setShowMoveSuccess(false), 3000);
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
      cancelEditing();
    }
  };

  const handleDownloadFile = async () => {
    if (selectedFile) {
      try {
        const blob = await fileApi.downloadFile(selectedFile.id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        handleFileMenuClose();
      } catch (error) {
        if (error.message === 'Authentication required. Please log in again.') {
          // Clear tokens and redirect to login
          localStorage.removeItem('adminToken');
          localStorage.removeItem('token');
          localStorage.removeItem('adminEmail');
          window.location.href = '/signin';
          return;
        }
        setError('Failed to download file. Please try again.');
        console.error('Error downloading file:', error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validation functions
  const checkDuplicateFileName = (fileName, currentPath = '/') => {
    const filesInCurrentPath = files.filter(file => file.path === currentPath);
    return filesInCurrentPath.some(file => file.name.toLowerCase() === fileName.toLowerCase());
  };

  const checkDuplicateFolderName = (folderName, currentPath = '/') => {
    const foldersInCurrentPath = folders.filter(folder => folder.path === currentPath);
    return foldersInCurrentPath.some(folder => folder.name.toLowerCase() === folderName.toLowerCase());
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
    // Check for duplicate folder names in current path
    const duplicateFolder = folders.find(folder => 
      folder.name.toLowerCase() === folderName.toLowerCase() && 
      folder.id !== editingItem?.id
    );
    if (duplicateFolder) {
      return 'A folder with this name already exists in this location';
    }
    return null;
  };

  // LocalStorage functions for file persistence


  // Drag and drop handlers
  const handleFileDragStart = (e, file) => {
    console.log('Drag start:', file);
    setDraggedFile(file);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', file.id);
  };

  const handleFileDragEnd = () => {
    console.log('Drag end');
    setDraggedFile(null);
    setDragOverFolder(null);
  };

  const handleFolderDragOver = (e, folder) => {
    console.log('Drag over folder:', folder.name);
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folder);
  };

  const handleFolderDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleFolderDrop = async (e, folder) => {
    console.log('Drop on folder:', folder.name);
    console.log('Dragged file:', draggedFile);
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
    console.log('Drop on file panel');
    console.log('Dragged file:', draggedFile);
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DashboardIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                Admin Dashboard
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 200px)' }}>
          {/* File Management Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              sx={{
                width: 300,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* File Panel Header */}
              <Box sx={{ 
                p: 2, 
                background: 'rgba(0, 0, 0, 0.2)', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  File Manager
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Upload Files">
                    <IconButton
                      size="small"
                      onClick={() => setFileUploadDialogOpen(true)}
                      sx={{ color: '#3b82f6' }}
                    >
                      <UploadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Create Folder">
                    <IconButton
                      size="small"
                      onClick={() => setFolderDialogOpen(true)}
                      sx={{ color: '#22c55e' }}
                    >
                      <CreateFolderIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

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

              {/* File Panel Content */}
              <Box 
                sx={{ flex: 1, overflow: 'auto', p: 1 }}
                onDragOver={handleFileDragOver}
                onDrop={handleFileDrop}
              >
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

                {/* Folders */}
                {folders.filter(folder => {
                  // Compare folder path with current path
                  const matches = folder.path === currentPath;
                  return matches;
                }).map((folder) => {
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
                                          <ListItemIcon sx={{ color: '#22c55e', minWidth: 36 }}>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        editingItem && editingItem.type === 'folder' && editingItem.id === folder.id ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyPress={handleEditKeyPress}
                              onBlur={handleRename}
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
                              onClick={cancelEditing}
                              sx={{ color: '#ef4444', p: 0.5 }}
                            >
                              <Box sx={{ fontSize: '0.75rem' }}>✕</Box>
                            </IconButton>
                          </Box>
                        ) : (
                          <Box
                            onClick={() => startEditing(folder, 'folder')}
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
                      primaryTypographyProps={{
                        sx: { color: 'white', fontSize: '0.875rem' }
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteFolder(folder)}
                        sx={{ 
                          color: '#ef4444',
                          width: 24,
                          height: 24,
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)'
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            border: '1.5px solid #ef4444',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '6px',
                              height: '1.5px',
                              backgroundColor: '#ef4444',
                              borderRadius: '1px'
                            }
                          }}
                        />
                      </IconButton>
                    </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}

                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Files */}
                {files.filter(file => {
                  // Compare file path with current path
                  const matches = file.path === currentPath;
                  return matches;
                }).map((file) => {
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
                        <AddIcon />
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
                              onBlur={handleRename}
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
                              onClick={cancelEditing}
                              sx={{ color: '#ef4444', p: 0.5 }}
                            >
                              <Box sx={{ fontSize: '0.75rem' }}>✕</Box>
                            </IconButton>
                          </Box>
                        ) : (
                          <Box
                            onClick={() => startEditing(file, 'file')}
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
                            {file.name}
                          </Box>
                        )
                      }
                      secondary={formatFileSize(file.size)}
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
          </motion.div>

          {/* Main Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
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
              minWidth: 300
            }}
            onClose={() => setShowMoveSuccess(false)}
          >
            {moveMessage}
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
          </Box>
        </Box>

        {/* File Upload Dialog */}
        <Dialog
          open={fileUploadDialogOpen}
          onClose={() => setFileUploadDialogOpen(false)}
          maxWidth="sm"
          fullWidth
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

        {/* File Menu */}
        <Menu
          anchorEl={fileMenuAnchor}
          open={Boolean(fileMenuAnchor)}
          onClose={handleFileMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'white'
            }
          }}
        >
          <MenuItem onClick={() => {
            startEditing(selectedFile, 'file');
            handleFileMenuClose();
          }}>
            <ListItemIcon>
              <Box sx={{ color: '#22c55e', fontSize: '1.2rem' }}>✏️</Box>
            </ListItemIcon>
            <ListItemText>Rename</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDownloadFile}>
            <ListItemIcon>
              <DownloadIcon sx={{ color: '#3b82f6' }} />
            </ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteFile}>
            <ListItemIcon>
              <DeleteIcon sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

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

        {/* Custom Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteConfirm}
          onClose={cancelDeleteFolder}
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
                Delete Folder
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ color: '#374151', mb: 1 }}>
              Are you sure you want to delete the folder
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
              "{folderToDelete?.name}"
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              This action cannot be undone. All files and subfolders inside this folder will also be deleted.
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
              onClick={confirmDeleteFolder}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                }
              }}
            >
              Delete Folder
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 