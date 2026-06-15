import { Task, TaskFormData, ApiError } from '../types';

const API_BASE_URL = '/api/v1';

class ApiClient {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      let error: ApiError;
      try {
        error = await response.json();
      } catch {
        error = { error: 'Network error', message: 'Unable to connect to server' };
      }
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async createTask(data: TaskFormData): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks');
  }

  async getTaskById(id: number): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async updateTask(id: number, data: TaskFormData): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
