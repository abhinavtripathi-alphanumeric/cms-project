import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Only access localStorage on the client-side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export const authAPI = {
  signup: (userData: { username: string; email: string; password: string }) =>
    api.post("/api/auth/signup", userData),

  login: (credentials: { email: string; password: string }) =>
    api.post("/api/auth/login", credentials),
};

export const articlesAPI = {
  create: (data: { title: string; content: string }) => {
    return api.post("/api/articles", data);
  },
  getAll: () => api.get("/api/articles"),

  getById: (id: string | number) => api.get(`/api/articles/${id}`),

  update: (id: number, data: { title: string; content: string }) =>
    api.put(`/api/articles/${id}`, data),

  delete: (id: number) => api.delete(`/api/articles/${id}`),
};

export default api;
