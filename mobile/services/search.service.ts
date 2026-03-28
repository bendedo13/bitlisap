import { api } from './api';

export const searchService = {
  global: (q: string, limit = 20) =>
    api.get('/search', { params: { q, limit } }),
};
