// services/api.js
import axios from 'axios';

// Crear una instancia de Axios con una configuración base
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`, // Reemplaza con la URL base de tu API
  headers: {
    'Content-Type': 'application/json', // Header común para todas las solicitudes
  },
});

// Interceptores de solicitud (opcional)
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Verificar si la solicitud requiere token (no es pública)
    if (config.requiresAuth && token) {
      config.headers.Authorization = `Bearer ${token}`; // Agregar el token al header
    }

    // Si se proporcionan headers personalizados, sobrescribir los headers por defecto
    if (config.customHeaders) {
      config.headers = {
        ...config.headers, // Mantener los headers por defecto
        ...config.customHeaders, // Sobrescribir con los headers personalizados
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

// Interceptores de respuesta (opcional)
api.interceptors.response.use(
  (response) => {
    // Puedes modificar la respuesta antes de que se resuelva la promesa
    return response;
  },
  (error) => {
    // Puedes manejar errores globales aquí, como redirigir al usuario si recibe un 401
    if (error.response && error.response.status === 401) {
      // Redirigir al usuario a la página de login o hacer algo más
      console.error('Error 401: No autorizado');
      // Ejemplo: Redirigir al usuario a la página de login
      // window.location.href = '/login';
    }
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

// Métodos para hacer las llamadas a la API
const apiService = {
  get: (url, params, requiresAuth = true, customHeaders = {}) =>
    api.get(url, { params, requiresAuth, customHeaders }), // Por defecto requiere autenticación
  post: (url, data, requiresAuth = true, customHeaders = {}) =>
    api.post(url, data, { requiresAuth, customHeaders }), // Por defecto requiere autenticación
  put: (url, data, requiresAuth = true, customHeaders = {}) =>
    api.put(url, data, { requiresAuth, customHeaders }), // Por defecto requiere autenticación
  delete: (url, requiresAuth = true, customHeaders = {}) =>
    api.delete(url, { requiresAuth, customHeaders }), // Por defecto requiere autenticación
  patch: (url, data, requiresAuth = true, customHeaders = {}) =>
    api.patch(url, data, { requiresAuth, customHeaders }), // Por defecto requiere autenticación
};

export default apiService;