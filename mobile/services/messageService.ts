import { api } from './api';

export const messageService = {
  getConversations: () => api.get('/messages/conversations').then((r) => r.data),
  getConversation: (id: string) => api.get(`/messages/conversations/${id}`).then((r) => r.data),
  sendMessage: (conversationId: string, content: string) =>
    api.post(`/messages/conversations/${conversationId}`, { content }).then((r) => r.data),
  createConversation: (listingId: string, receiverId: string) =>
    api.post('/messages/conversations', { listingId, receiverId }).then((r) => r.data),
};
