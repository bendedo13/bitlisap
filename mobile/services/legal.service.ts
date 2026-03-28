import { api } from './api';

export const legalService = {
  privacy: () => api.get('/legal/privacy'),
  terms: () => api.get('/legal/terms'),
};
