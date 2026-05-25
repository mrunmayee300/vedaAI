import axios from "axios";
import type { Assignment } from "@/types/assignment";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
});

export const assignmentApi = {
  async list() {
    const response = await api.get<ApiEnvelope<{ assignments: Assignment[] }>>("/assignments");
    return response.data.data.assignments;
  },
  async get(id: string) {
    const response = await api.get<ApiEnvelope<{ assignment: Assignment }>>(`/assignments/${id}`);
    return response.data.data.assignment;
  },
  async create(formData: FormData) {
    const response = await api.post<ApiEnvelope<{ assignment: Assignment }>>("/assignments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data.assignment;
  },
  async regenerate(id: string) {
    const response = await api.post<ApiEnvelope<{ assignment: Assignment }>>(`/assignments/${id}/regenerate`);
    return response.data.data.assignment;
  },
  exportUrl(id: string) {
    return `${api.defaults.baseURL}/assignments/${id}/export`;
  },
};
