import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData, Status, ApiError } from '../types';
import { apiClient } from '../api/client';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (data: TaskFormData) => Promise<Task>;
  updateTask: (id: number, data: TaskFormData) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  updateStatus: (id: number, status: Status) => Promise<Task>;
  refresh: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getAllTasks();
      setTasks(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || apiError.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: TaskFormData): Promise<Task> => {
    const newTask = await apiClient.createTask(data);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (id: number, data: TaskFormData): Promise<Task> => {
    const previousTasks = tasks;
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    try {
      const updated = await apiClient.updateTask(id, data);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      return updated;
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      throw err;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    const previousTasks = tasks;
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await apiClient.deleteTask(id);
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      throw err;
    }
  };

  const updateStatus = async (id: number, status: Status): Promise<Task> => {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    return updateTask(id, { ...task, status });
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateStatus,
    refresh: fetchTasks,
  };
}
