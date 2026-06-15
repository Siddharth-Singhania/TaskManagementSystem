import { Task, Status, Priority } from '../types';

export function filterByStatus(tasks: Task[], status: Status | null): Task[] {
  if (!status) return tasks;
  return tasks.filter((task) => task.status === status);
}

export function filterByPriority(tasks: Task[], priority: Priority | null): Task[] {
  if (!priority) return tasks;
  return tasks.filter((task) => task.priority === priority);
}

export interface FilterConfig {
  status: Status | null;
  priority: Priority | null;
}

export function filterTasks(tasks: Task[], config: FilterConfig): Task[] {
  let filtered = tasks;
  
  if (config.status) {
    filtered = filterByStatus(filtered, config.status);
  }
  
  if (config.priority) {
    filtered = filterByPriority(filtered, config.priority);
  }
  
  return filtered;
}
