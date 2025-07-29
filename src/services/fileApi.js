import { devLog } from "../utils/logger";
import api from './apiConfig';

// File and Folder API endpoints
export const fileApi = {
  // Get all files
  getFiles: async () => {
    try {
      const response = await api.get('/api/files/');
      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      } else if (response.data && Array.isArray(response.data.files)) {
        return response.data.files;
      } else {
        return [];
      }
    } catch (error) {
      devLog('Error fetching files:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Get all folders
  getFolders: async () => {
    try {
      const response = await api.get('/api/folders/');
      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      } else if (response.data && Array.isArray(response.data.folders)) {
        return response.data.folders;
      } else {
        return [];
      }
    } catch (error) {
      devLog('Error fetching folders:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file, path = '/') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Backend expects folder_id, not path
      // For now, we'll send the path and let the backend handle it
      // The backend should parse the path and find/create the appropriate folder
      formData.append('path', path);
      
      const response = await api.post('/api/files/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      devLog('Error uploading file:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Create folder
  createFolder: async (folderData) => {
    try {
      // Backend expects 'name' and 'parent' (folder_id), not 'path'
      // We need to convert our path-based structure to the backend's relational structure
      const backendData = {
        name: folderData.name,
        // If path is '/', parent should be null (root folder)
        // Otherwise, we need to find the parent folder by path
        parent: folderData.path === '/' ? null : undefined // TODO: Find parent folder by path
      };
      
      const response = await api.post('/api/folders/', backendData);
      return response.data;
    } catch (error) {
      devLog('Error creating folder:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Move file
  moveFile: async (fileId, folderId) => {
    try {
      // Prepare request body - folder can be null for root, or a folder ID
      const requestBody = folderId ? { folder: folderId } : { folder: null };
      
      // Backend expects PATCH to /api/files/{id}/ with folder field
      const response = await api.patch(`/api/files/${fileId}/`, requestBody);
      
      return response.data;
    } catch (error) {
      devLog('Error moving file:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Invalid request';
        throw new Error(`Bad request: ${errorMessage}`);
      }
      
      if (error.response?.status === 500) {
        throw new Error('Server error: The backend encountered an error while moving the file.');
      }
      
      throw error;
    }
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/api/files/${fileId}/`);
      return response.data;
    } catch (error) {
      devLog('Error deleting file:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Delete folder
  deleteFolder: async (folderId) => {
    try {
      const response = await api.delete(`/api/folders/${folderId}/`);
      return response.data;
    } catch (error) {
      devLog('Error deleting folder:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        throw new Error('Server error: The folder may contain files or there is a backend issue.');
      }
      
      if (error.response?.status === 400) {
        throw new Error('Cannot delete folder: It may contain files or be in use.');
      }
      
      throw error;
    }
  },

  // Download file
  downloadFile: async (fileId) => {
    try {
      console.log('fileApi.downloadFile called with fileId:', fileId);
      
      // First, get the file details to get the file URL
      console.log('Getting file details first...');
      const fileResponse = await api.get(`/api/files/${fileId}/`);
      console.log('File details response:', fileResponse.data);
      
      const fileUrl = fileResponse.data.file;
      console.log('File URL from response:', fileUrl);
      
      if (!fileUrl) {
        throw new Error('File URL not found in response');
      }
      
      // Try different download endpoints
      const endpoints = [
        `/api/files/${fileId}/download/`,
        `/api/files/${fileId}/`,
        fileUrl, // Direct file URL
        `/media/uploads/${fileResponse.data.name}` // Media URL
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying download endpoint:', endpoint);
          response = await api.get(endpoint, {
            responseType: 'blob'
          });
          console.log('Download successful from endpoint:', endpoint);
          break;
        } catch (error) {
          console.log('Failed endpoint:', endpoint, 'Error:', error.response?.status);
          lastError = error;
        }
      }
      
      if (!response) {
        throw lastError || new Error('All download endpoints failed');
      }
      
      console.log('fileApi.downloadFile response received:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data type:', typeof response.data);
      console.log('Response data size:', response.data ? response.data.size : 'undefined');
      
      return response;
    } catch (error) {
      console.error('fileApi.downloadFile error:', error);
      console.error('Error response:', error.response);
      devLog('Error downloading file:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Rename file
  renameFile: async (fileId, newName) => {
    try {
      const response = await api.patch(`/api/files/${fileId}/`, {
        name: newName
      });
      return response.data;
    } catch (error) {
      devLog('Error renaming file:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Rename folder
  renameFolder: async (folderId, newName) => {
    try {
      const response = await api.patch(`/api/folders/${folderId}/`, {
        name: newName
      });
      return response.data;
    } catch (error) {
      devLog('Error renaming folder:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Update file properties
  updateFile: async (fileId, updates) => {
    try {
      const response = await api.patch(`/api/files/${fileId}/`, updates);
      return response.data;
    } catch (error) {
      devLog('Error updating file:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Search files
  searchFiles: async (query) => {
    try {
      const response = await api.get('/api/files/search/', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      devLog('Error searching files:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Get files by tags
  getFilesByTags: async (tagIds) => {
    try {
      const response = await api.get('/api/files/by-tags/', {
        params: { tags: tagIds.join(',') }
      });
      return response.data;
    } catch (error) {
      devLog('Error getting files by tags:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Duplicate file
  duplicateFile: async (fileId) => {
    try {
      const response = await api.post(`/api/files/${fileId}/duplicate/`);
      return response.data;
    } catch (error) {
      devLog('Error duplicating file:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.response?.status === 404) {
        throw new Error('Duplicate feature is not yet implemented on the backend. Please contact the development team.');
      }
      throw error;
    }
  },

  // Duplicate folder
  duplicateFolder: async (folderId) => {
    try {
      const response = await api.post(`/api/folders/${folderId}/duplicate/`);
      return response.data;
    } catch (error) {
      devLog('Error duplicating folder:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (error.response?.status === 404) {
        throw new Error('Duplicate feature is not yet implemented on the backend. Please contact the development team.');
      }
      throw error;
    }
  }
};

export default fileApi; 