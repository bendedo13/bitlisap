import { api } from './api';

interface ListParams {
  page?: number;
  category?: string;
  district?: string;
  sort?: string;
}

interface CreateListingData {
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  isNegotiable?: boolean;
  photos?: string[];
  district?: string;
}

export const listingService = {
  getAll: (params?: ListParams) =>
    api.get('/listings', { params }),

  getById: (id: string) =>
    api.get(`/listings/${id}`),

  create: (data: CreateListingData) =>
    api.post('/listings', data),

  update: (id: string, data: Partial<CreateListingData>) =>
    api.put(`/listings/${id}`, data),

  delete: (id: string) =>
    api.delete(`/listings/${id}`),

  makePremium: (id: string, days: number) =>
    api.post(`/listings/${id}/premium`, { days }),
};
