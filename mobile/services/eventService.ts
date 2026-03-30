import { api } from './api';

export const eventService = {
  getAll: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get('/events', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/events/${id}`).then((r) => r.data),
  attend: (id: string) => api.post(`/events/${id}/attend`).then((r) => r.data),
};
