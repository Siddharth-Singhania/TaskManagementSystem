import { describe, it, expect } from 'vitest';
import { sortTasks } from '../sort';
import { Task } from '../../types';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Test Task',
  description: null,
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('sortTasks', () => {
  describe('sort by dueDate', () => {
    const tasks: Task[] = [
      createTask({ id: 1, dueDate: '2024-03-15' }),
      createTask({ id: 2, dueDate: '2024-01-10' }),
      createTask({ id: 3, dueDate: '2024-02-20' }),
      createTask({ id: 4, dueDate: null }),
    ];

    it('sorts by dueDate ascending', () => {
      const result = sortTasks(tasks, 'dueDate', true);
      expect(result[0].dueDate).toBe('2024-01-10');
      expect(result[1].dueDate).toBe('2024-02-20');
      expect(result[2].dueDate).toBe('2024-03-15');
      expect(result[3].dueDate).toBe(null);
    });

    it('sorts by dueDate descending', () => {
      const result = sortTasks(tasks, 'dueDate', false);
      expect(result[0].dueDate).toBe(null);
      expect(result[1].dueDate).toBe('2024-03-15');
      expect(result[2].dueDate).toBe('2024-02-20');
    });

    it('handles null values appropriately', () => {
      const result = sortTasks(tasks, 'dueDate', true);
      expect(result[result.length - 1].dueDate).toBe(null);
    });
  });

  describe('sort by priority', () => {
    const tasks: Task[] = [
      createTask({ id: 1, priority: 'LOW' }),
      createTask({ id: 2, priority: 'HIGH' }),
      createTask({ id: 3, priority: 'MEDIUM' }),
    ];

    it('sorts by priority ascending (LOW to HIGH)', () => {
      const result = sortTasks(tasks, 'priority', true);
      expect(result[0].priority).toBe('LOW');
      expect(result[1].priority).toBe('MEDIUM');
      expect(result[2].priority).toBe('HIGH');
    });

    it('sorts by priority descending (HIGH to LOW)', () => {
      const result = sortTasks(tasks, 'priority', false);
      expect(result[0].priority).toBe('HIGH');
      expect(result[1].priority).toBe('MEDIUM');
      expect(result[2].priority).toBe('LOW');
    });
  });

  describe('sort by status', () => {
    const tasks: Task[] = [
      createTask({ id: 1, status: 'DONE' }),
      createTask({ id: 2, status: 'TODO' }),
      createTask({ id: 3, status: 'IN_PROGRESS' }),
    ];

    it('sorts by status ascending (TODO -> IN_PROGRESS -> DONE)', () => {
      const result = sortTasks(tasks, 'status', true);
      expect(result[0].status).toBe('TODO');
      expect(result[1].status).toBe('IN_PROGRESS');
      expect(result[2].status).toBe('DONE');
    });

    it('sorts by status descending (DONE -> IN_PROGRESS -> TODO)', () => {
      const result = sortTasks(tasks, 'status', false);
      expect(result[0].status).toBe('DONE');
      expect(result[1].status).toBe('IN_PROGRESS');
      expect(result[2].status).toBe('TODO');
    });
  });

  describe('sort by createdAt', () => {
    const tasks: Task[] = [
      createTask({ id: 1, createdAt: '2024-03-01T10:00:00Z' }),
      createTask({ id: 2, createdAt: '2024-01-15T08:00:00Z' }),
      createTask({ id: 3, createdAt: '2024-02-20T14:00:00Z' }),
    ];

    it('sorts by createdAt ascending', () => {
      const result = sortTasks(tasks, 'createdAt', true);
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(3);
      expect(result[2].id).toBe(1);
    });

    it('sorts by createdAt descending', () => {
      const result = sortTasks(tasks, 'createdAt', false);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
      expect(result[2].id).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('returns empty array for empty input', () => {
      const result = sortTasks([], 'dueDate', true);
      expect(result).toHaveLength(0);
    });

    it('does not mutate original array', () => {
      const tasks = [
        createTask({ id: 1, priority: 'LOW' }),
        createTask({ id: 2, priority: 'HIGH' }),
      ];
      const original = [...tasks];
      sortTasks(tasks, 'priority', false);
      expect(tasks[0].id).toBe(original[0].id);
    });

    it('handles single item array', () => {
      const tasks = [createTask({ id: 1 })];
      const result = sortTasks(tasks, 'priority', true);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });
});
