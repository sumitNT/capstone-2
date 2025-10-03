import axios from "axios";

export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8765/partnerservice/api";

export const API_URLS = {
  getPartnerList: async () => {
    try {
        const res = await axios.get('/api/partners')
        console.log('Partners API response:', res);
        return res.data.partners;
    } catch(err) {
        console.log('Partners API error:', err);
        throw err;
    }
  },

  getPartnerLoaderConfigList: async (partnerId: string) => {
    try {
        // Use GET request with query parameters to match the actual backend API
        const res = await axios.get(`/api/partner-loader-config?partnerId=${partnerId}&loaderType=Xdk&page=0&size=5`);
        console.log('Partner loader config API response:', res);
        return res.data.content || []; // Return the content array from the paginated response
    } catch(err) {
        console.log('Partner loader config API error:', err);
        throw err;
    }
  },

  uploadExcelFile: async (partnerId: string, loaderConfigId: string, file: File) => {
    try {
        const formData = new FormData();
        formData.append('partnerId', partnerId);
        formData.append('loaderConfigId', loaderConfigId);
        formData.append('file', file);

        console.log('API: Uploading file with:', {
          partnerId,
          loaderConfigId,
          fileName: file.name,
          fileSize: file.size
        });

        const res = await axios.post('/api/upload-excel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return res.data;
    } catch(err) {
        console.log('API Upload Error:', err);
        throw err;
    }
  },

  downloadTemplate: async (configId: string, partnerId: string) => {
    try {
        console.log('API: Downloading template for configId:', configId, 'partnerId:', partnerId);
        
        const response = await fetch(`/api/download-template?configId=${configId}&partnerId=${partnerId}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API: Download failed:', errorData);
            throw new Error(`Download failed: ${errorData.message || 'Unknown error'}`);
        }

        // Create blob from response
        const blob = await response.blob();
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `template_${configId}.xlsx`;
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }

        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('API: Template downloaded successfully:', filename);
        return { success: true, filename };
        
    } catch(err) {
        console.log('API Download Error:', err);
        throw err;
    }
  }
};
