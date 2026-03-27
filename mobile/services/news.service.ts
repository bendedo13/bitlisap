import { api } from './api';

interface ListParams {
  page?: number;
  category?: string;
}

export const newsService = {
  getAll: (params?: ListParams) =>
    api.get('/news', { params }),

  getById: (id: string) =>
    api.get(`/news/${id}`),

  getBreaking: () =>
    api.get('/news/breaking'),

  like: (id: string) =>
    api.post(`/news/${id}/like`),
};
