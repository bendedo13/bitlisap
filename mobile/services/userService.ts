import { api } from './api';

export const userService = {
  updateMe: (data: { fullName?: string; district?: string; avatarUrl?: string }) =>
    api.put('/users/me', data).then((r) => r.data),
  getMe: () => api.get('/users/me').then((r) => r.data),
};
