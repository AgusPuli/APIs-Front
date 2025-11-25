import axios from 'axios';

// ============================================================
// CONFIGURACIÓN BASE
// ============================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// INTERCEPTOR DE REQUEST
// ============================================================

api.interceptors.request.use(
  (config) => {
    // Agregar token automáticamente desde Redux Persist
    const persistedState = localStorage.getItem('persist:root');
    
    if (persistedState) {
      try {
        const parsedState = JSON.parse(persistedState);
        const userState = JSON.parse(parsedState.user || '{}');
        const token = userState.token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error al obtener token:', error);
      }
    }
    
    // Log de requests en desarrollo
    if (import.meta.env.DEV) {
      console.log('📡 Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// ============================================================
// INTERCEPTOR DE RESPONSE - MANEJO CENTRALIZADO DE ERRORES
// ============================================================

api.interceptors.response.use(
  // ✅ Respuesta exitosa
  (response) => {
    // Log de responses en desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.config.url, response.status);
    }
    return response;
  },
  
  // ❌ Manejo de errores
  (error) => {
    // Estructura de error personalizada
    const customError = {
      message: 'Error desconocido',
      status: null,
      data: null,
      originalError: error
    };

    // Caso 1: Error con respuesta del servidor
    if (error.response) {
      const { status, data } = error.response;
      customError.status = status;
      customError.data = data;
      
      // Extraer mensaje de error del backend
      if (typeof data === 'string') {
        customError.message = data;
      } else if (data?.message) {
        customError.message = data.message;
      } else if (data?.error) {
        customError.message = data.error;
      }

      // Manejo específico por código HTTP
      switch (status) {
        case 400:
          console.error('❌ Bad Request:', customError.message);
          customError.message = customError.message || 'Solicitud incorrecta';
          break;

        case 401:
          console.error('❌ No autorizado - Token inválido o expirado');
          customError.message = 'Sesión expirada. Por favor, inicia sesión nuevamente';
          
          // Limpiar localStorage y redirigir a login
          localStorage.removeItem('persist:root');
          
          // Evitar múltiples redirecciones
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          console.error('❌ Acceso denegado');
          customError.message = 'No tienes permisos para realizar esta acción';
          break;

        case 404:
          console.error('❌ Recurso no encontrado:', error.config?.url);
          customError.message = 'Recurso no encontrado';
          break;

        case 409:
          console.warn('⚠️ Conflicto:', customError.message);
          customError.message = customError.message || 'El recurso ya existe';
          break;

        case 422:
          console.error('❌ Error de validación:', customError.message);
          customError.message = customError.message || 'Datos inválidos';
          break;

        case 429:
          console.error('❌ Demasiadas solicitudes');
          customError.message = 'Has realizado demasiadas solicitudes. Intenta más tarde';
          break;

        case 500:
          console.error('❌ Error interno del servidor');
          customError.message = 'Error del servidor. Intenta nuevamente más tarde';
          break;

        case 502:
          console.error('❌ Bad Gateway');
          customError.message = 'Error de conexión con el servidor';
          break;

        case 503:
          console.error('❌ Servicio no disponible');
          customError.message = 'El servicio no está disponible temporalmente';
          break;

        default:
          console.error(`❌ Error HTTP ${status}:`, customError.message);
          customError.message = customError.message || `Error del servidor (${status})`;
      }
    } 
    // Caso 2: Error de red (sin respuesta del servidor)
    else if (error.request) {
      console.error('❌ Error de red - No se recibió respuesta del servidor');
      customError.message = 'Error de conexión. Verifica tu conexión a internet';
      customError.status = 0;
    } 
    // Caso 3: Error al configurar la petición
    else {
      console.error('❌ Error al configurar la petición:', error.message);
      customError.message = error.message || 'Error al procesar la solicitud';
    }

    // Log completo en desarrollo
    if (import.meta.env.DEV) {
      console.group('🔍 Detalles del Error');
      console.log('URL:', error.config?.url);
      console.log('Método:', error.config?.method?.toUpperCase());
      console.log('Status:', customError.status);
      console.log('Mensaje:', customError.message);
      console.log('Data:', customError.data);
      console.groupEnd();
    }

    // Rechazar con error estructurado
    return Promise.reject(customError);
  }
);

// ============================================================
// HELPERS PARA MANEJO DE ERRORES
// ============================================================

/**
 * Verifica si el error es de un tipo específico
 */
export const isErrorType = (error, statusCode) => {
  return error?.status === statusCode;
};

/**
 * Obtiene mensaje de error legible
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  return error?.message || 'Error desconocido';
};

/**
 * Verifica si hay un error de red
 */
export const isNetworkError = (error) => {
  return error?.status === 0 || !error?.status;
};

/**
 * Verifica si el token expiró (401)
 */
export const isAuthError = (error) => {
  return error?.status === 401;
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default api;