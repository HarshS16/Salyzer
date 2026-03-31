import axios from 'axios'

// Get API base URL from Vite environment variable
// In development, this defaults to empty string (local proxy)
// In production on Vercel, set VITE_API_BASE_URL to your backend's URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Create specialized axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add interceptor to automatically add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
