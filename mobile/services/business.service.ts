import { api } from './api';

interface ListParams {
  page?: number;
  category?: string;
  district?: string;
}

interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
}

export const businessService = {
  getAll: (params?: ListParams) =>
    api.get('/businesses', { params }),

  getById: (id: string) =>
    api.get(`/businesses/${id}`),

  getNearby: (params: NearbyParams) =>
    api.get('/businesses/nearby', { params }),

  create: (data: Record<string, unknown>) =>
    api.post('/businesses', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/businesses/${id}`, data),

  addReview: (
    id: string,
    data: {
      rating: number;
      comment?: string;
      photos?: string[];
    }
  ) => api.post(`/businesses/${id}/review`, data),
};
