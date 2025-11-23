
import apiClient from './client';
import { AuthResponse, User } from '../api-schema';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/token/', {
      email,
      password,
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await apiClient.post<{ access: string }>('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  verify: async (token: string): Promise<void> => {
    await apiClient.post('/auth/token/verify/', { token });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },
};
