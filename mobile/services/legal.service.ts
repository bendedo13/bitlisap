import { api } from './api';

export const legalService = {
  privacy: () => api.get('/legal/privacy'),
  terms: () => api.get('/legal/terms'),
  kvkk: () => api.get('/legal/kvkk'),
  about: () => api.get('/legal/about'),
};
