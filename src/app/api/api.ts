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
  }

  
};
