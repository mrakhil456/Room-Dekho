import api from './api';

/**
 * Lightweight backend health check. This intentionally does not attach auth
 * requirements beyond the normal axios interceptor.
 */
export const checkBackendHealth = async () => {
  const response = await api.get('/health', { timeout: 10000 });
  return response.data;
};
