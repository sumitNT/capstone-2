import axios from "axios";

export const API_BASE_URL = "https://localhost:8080/api/";

export const API_URLS = {
  getPartnerList: async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/partners`)
        return res.data.partners; // It will returns partners array
    } catch(err) {
        console.log(err);
        throw err;
    }
  },

  getPartnerLoaderConfigList: async (partnerId: string) => {
    try {
        // business logic
        const res = await axios.post(`${API_BASE_URL}/partner-loader-config`, { partnerId: partnerId });
        return res.data.data; 
    } catch(err) {
        console.log(err);
        throw err;
    }
  },

  uploadExcelFile: async (partnerId: string, loaderConfigId: string, file: File) => {
    try {
        // Create FormData for file upload
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

        // Post to the local API route first, which will handle the backend integration
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
  }
};
