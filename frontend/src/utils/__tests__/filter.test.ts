import { describe, it, expect } from 'vitest';
import { filterByStatus, filterByPriority, filterTasks, FilterConfig } from '../filter';
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

describe('filterByStatus', () => {
  const tasks: Task[] = [
    createTask({ id: 1, status: 'TODO' }),
    createTask({ id: 2, status: 'IN_PROGRESS' }),
    createTask({ id: 3, status: 'DONE' }),
    createTask({ id: 4, status: 'TODO' }),
  ];

  it('returns all tasks when status is null', () => {
    const result = filterByStatus(tasks, null);
    expect(result).toHaveLength(4);
  });

  it('filters tasks by TODO status', () => {
    const result = filterByStatus(tasks, 'TODO');
    expect(result).toHaveLength(2);
    expect(result.every(t => t.status === 'TODO')).toBe(true);
  });

  it('filters tasks by IN_PROGRESS status', () => {
    const result = filterByStatus(tasks, 'IN_PROGRESS');
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('IN_PROGRESS');
  });

  it('filters tasks by DONE status', () => {
    const result = filterByStatus(tasks, 'DONE');
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('DONE');
  });

  it('returns empty array when no tasks match', () => {
    const todoOnlyTasks = [createTask({ status: 'TODO' })];
    const result = filterByStatus(todoOnlyTasks, 'DONE');
    expect(result).toHaveLength(0);
  });
});

describe('filterByPriority', () => {
  const tasks: Task[] = [
    createTask({ id: 1, priority: 'LOW' }),
    createTask({ id: 2, priority: 'MEDIUM' }),
    createTask({ id: 3, priority: 'HIGH' }),
    createTask({ id: 4, priority: 'HIGH' }),
  ];

  it('returns all tasks when priority is null', () => {
    const result = filterByPriority(tasks, null);
    expect(result).toHaveLength(4);
  });

  it('filters tasks by LOW priority', () => {
    const result = filterByPriority(tasks, 'LOW');
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe('LOW');
  });

  it('filters tasks by MEDIUM priority', () => {
    const result = filterByPriority(tasks, 'MEDIUM');
    expect(result).toHaveLength(1);
  });

  it('filters tasks by HIGH priority', () => {
    const result = filterByPriority(tasks, 'HIGH');
    expect(result).toHaveLength(2);
    expect(result.every(t => t.priority === 'HIGH')).toBe(true);
  });
});

describe('filterTasks', () => {
  const tasks: Task[] = [
    createTask({ id: 1, status: 'TODO', priority: 'HIGH' }),
    createTask({ id: 2, status: 'TODO', priority: 'LOW' }),
    createTask({ id: 3, status: 'IN_PROGRESS', priority: 'HIGH' }),
    createTask({ id: 4, status: 'DONE', priority: 'MEDIUM' }),
  ];

  it('returns all tasks with no filters', () => {
    const config: FilterConfig = { status: null, priority: null };
    const result = filterTasks(tasks, config);
    expect(result).toHaveLength(4);
  });

  it('filters by status only', () => {
    const config: FilterConfig = { status: 'TODO', priority: null };
    const result = filterTasks(tasks, config);
    expect(result).toHaveLength(2);
    expect(result.every(t => t.status === 'TODO')).toBe(true);
  });

  it('filters by priority only', () => {
    const config: FilterConfig = { status: null, priority: 'HIGH' };
    const result = filterTasks(tasks, config);
    expect(result).toHaveLength(2);
    expect(result.every(t => t.priority === 'HIGH')).toBe(true);
  });

  it('filters by both status and priority', () => {
    const config: FilterConfig = { status: 'TODO', priority: 'HIGH' };
    const result = filterTasks(tasks, config);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('TODO');
    expect(result[0].priority).toBe('HIGH');
  });

  it('returns empty array when combined filters match nothing', () => {
    const config: FilterConfig = { status: 'DONE', priority: 'HIGH' };
    const result = filterTasks(tasks, config);
    expect(result).toHaveLength(0);
  });
});
