import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTasks } from '../useTasks';
import { apiClient } from '../../api/client';
import { Task } from '../../types';

// Mock the API client
vi.mock('../../api/client', () => ({
  apiClient: {
    getAllTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Task 2',
    description: null,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2024-06-15',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

describe('useTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial fetch', () => {
    it('fetches tasks on mount', async () => {
      vi.mocked(apiClient.getAllTasks).mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTasks());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(apiClient.getAllTasks).toHaveBeenCalledTimes(1);
      expect(result.current.tasks).toEqual(mockTasks);
    });

    it('sets error state on fetch failure', async () => {
      vi.mocked(apiClient.getAllTasks).mockRejectedValue({
        error: 'Network error',
        message: 'Failed to fetch',
      });

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch');
      expect(result.current.tasks).toEqual([]);
    });
  });

  describe('createTask', () => {
    it('creates task and adds to list', async () => {
      vi.mocked(apiClient.getAllTasks).mockResolvedValue([]);
      const newTask: Task = {
        id: 3,
        title: 'New Task',
        description: null,
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      };
      vi.mocked(apiClient.createTask).mockResolvedValue(newTask);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.createTask({ title: 'New Task' });
      });

      expect(apiClient.createTask).toHaveBeenCalledWith({ title: 'New Task' });
      expect(result.current.tasks).toContainEqual(newTask);
    });
  });

  describe('updateTask', () => {
    it('updates task in list', async () => {
      vi.mocked(apiClient.getAllTasks).mockResolvedValue(mockTasks);
      const updatedTask = { ...mockTasks[0], title: 'Updated Title' };
      vi.mocked(apiClient.updateTask).mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updateTask(1, { title: 'Updated Title' });
      });

      expect(apiClient.updateTask).toHaveBeenCalledWith(1, { title: 'Updated Title' });
      expect(result.current.tasks.find(t => t.id === 1)?.title).toBe('Updated Title');
    });

    it('rolls back on update failure', async () => {
      vi.mocked(apiClient.getAllTasks).mockResolvedValue(mockTasks);
      vi.mocked(apiClient.updateTask).mockRejectedValue({ error: 'Update failed' });

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      try {
        await act(async () => {
          await result.current.updateTask(1, { title: 'Updated Title' });
        });
      } catch (e) {
        // Expected to throw
      }

      expect(result.current.tasks.find(t => t.id === 1)?.title).toBe('Task 1');
    });
  });

  describe('deleteTask', () => {
    it('removes task from list', async () => {
      vi.mocked(apiClient.getAllTasks).mockResolvedValue(mockTasks);
      vi.mocked(apiClient.deleteTask).mockResolvedValue(undefined);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteTask(1);
      });

      expect(apiClient.deleteTask).toHaveBeenCalledWith(1);
      expect(result.current.tasks.find(t => t.id === 1)).toBeUndefined();
      expect(result.current.tasks).toHaveLength(1);
    });

    it('rolls back on delete failure', async () => {
      vi.mocked(apiClient.getAllTasks).mockResolvedValue(mockTasks);
      vi.mocked(apiClient.deleteTask).mockRejectedValue({ error: 'Delete failed' });

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      try {
        await act(async () => {
          await result.current.deleteTask(1);
        });
      } catch (e) {
        // Expected to throw
      }

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks.find(t => t.id === 1)).toBeDefined();
    });
  });

  describe('updateStatus', () => {
    it('updates task status', async () => {
      vi.mocked(apiClient.getAllTasks).mockResolvedValue(mockTasks);
      const updatedTask = { ...mockTasks[0], status: 'DONE' as const };
      vi.mocked(apiClient.updateTask).mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updateStatus(1, 'DONE');
      });

      expect(result.current.tasks.find(t => t.id === 1)?.status).toBe('DONE');
    });
  });

  describe('refresh', () => {
    it('refetches all tasks', async () => {
      vi.mocked(apiClient.getAllTasks).mockResolvedValueOnce(mockTasks);

      const { result } = renderHook(() => useTasks());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updatedTasks = [...mockTasks, {
        id: 3,
        title: 'Task 3',
        description: null,
        status: 'TODO' as const,
        priority: 'LOW' as const,
        dueDate: null,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      }];
      vi.mocked(apiClient.getAllTasks).mockResolvedValueOnce(updatedTasks);

      await act(async () => {
        await result.current.refresh();
      });

      expect(apiClient.getAllTasks).toHaveBeenCalledTimes(2);
      expect(result.current.tasks).toHaveLength(3);
    });
  });
});
