import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Resolve API URL based on environment. 
// Fallback for local Android emulator is 10.0.2.2, iOS simulator is localhost.
// In production, this should point to api.chefuinc.com
const getApiBaseUrl = () => {
  if (__DEV__) {
    const isEmulator = !Constants.isDevice;
    if (isEmulator && Platform.OS === 'android') {
      return 'http://10.0.2.2:3000'; // Default NestJS port on Android emulator
    }
    return 'http://localhost:3000';
  }
  return 'https://api.chefuinc.com'; 
};

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client': 'chefu-academy-mobile',
  },
});

// Request interceptor to attach JWT token to every request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@chefu_auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., token expired)
      // We will hook this up to our auth context to force logout later
      console.warn('Unauthorized access. Token may have expired.');
    }
    return Promise.reject(error);
  }
);
