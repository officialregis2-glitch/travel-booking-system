import api from './api';

export const bookingService = {
  list: (params) => api.get('/bookings', { params }).then((r) => r.data),
  get: (id) => api.get(`/bookings/${id}`).then((r) => r.data),
  create: (data) => api.post('/bookings', data).then((r) => r.data),
  update: (id, data) => api.put(`/bookings/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/bookings/${id}`).then((r) => r.data),
  updateStatus: (id, status) =>
    api.patch(`/bookings/${id}/status`, { status }).then((r) => r.data),
};