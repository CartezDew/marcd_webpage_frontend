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
      console.error('Error fetching files:', error);
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
      console.error('Error fetching folders:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file, path = '/') => {
    try {
      console.log(`Uploading file "${file.name}" to path: ${path}`);
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
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
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
      console.error('Error creating folder:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Move file
  moveFile: async (fileId, folderId) => {
    try {
      console.log(`Attempting to move file ${fileId} to folder ${folderId}`);
      console.log(`Making PATCH request to: /api/files/${fileId}/`);
      
      // Prepare request body - folder can be null for root, or a folder ID
      const requestBody = folderId ? { folder: folderId } : { folder: null };
      console.log(`Request body:`, requestBody);
      
      // Backend expects PATCH to /api/files/{id}/ with folder field
      const response = await api.patch(`/api/files/${fileId}/`, requestBody);
      
      console.log('Move file response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error moving file:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error config:', error.config);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Invalid request';
        throw new Error(`Bad request: ${errorMessage}`);
      }
      
      if (error.response?.status === 500) {
        console.error('Full error response:', error.response);
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
      console.error('Error deleting file:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Delete folder
  deleteFolder: async (folderId) => {
    try {
      console.log(`Attempting to delete folder ${folderId}`);
      const response = await api.delete(`/api/folders/${folderId}/`);
      console.log('Delete folder response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting folder:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
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
      const response = await api.get(`/api/files/${fileId}/download/`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading file:', error);
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
      console.error('Error renaming file:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  },

  // Rename folder
  renameFolder: async (folderId, newName) => {
    try {
      console.log(`Renaming folder ${folderId} to "${newName}"`);
      const response = await api.patch(`/api/folders/${folderId}/`, {
        name: newName
      });
      console.log('Rename folder response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error renaming folder:', error);
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
      console.error('Error updating file:', error);
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
      console.error('Error searching files:', error);
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
      console.error('Error getting files by tags:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw error;
    }
  }
};

export default fileApi; 