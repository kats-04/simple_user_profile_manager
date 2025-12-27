import api from './axios'

export const register = (payload) => api.post('/auth/register', payload).then(r => r.data)
export const login = (payload) => api.post('/auth/login', payload).then(r => r.data)
export const refreshToken = (payload) => api.post('/auth/refresh', payload).then(r => r.data)
