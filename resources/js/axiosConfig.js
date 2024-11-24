import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This allows cookies to be sent with requests
});

// Automatically add the CSRF token to every request
const csrfTokenMetaTag = document.head.querySelector('meta[name="csrf-token"]');
if (csrfTokenMetaTag) {
  instance.defaults.headers.common['X-CSRF-TOKEN'] = csrfTokenMetaTag.content;
} else {
  console.error('CSRF token not found');
}

// Intercept each request to include the Authorization header if a token exists
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setupAxiosInterceptors = (navigate) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 500) {
        navigate('/500'); 
      }
      if (error.response?.status === 404) {
        navigate('/404'); 
      }
      return Promise.reject(error);
    }
  );
};

export default instance;
