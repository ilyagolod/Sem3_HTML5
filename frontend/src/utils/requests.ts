import axios from 'axios';

export const axiosInst = axios.create({
   baseURL: 'http://localhost:5001/',
   headers: {
      'Content-Type': 'application/json',
   },
   timeout: 5000,
   withCredentials: false,
});

export const apiClient = axiosInst;
