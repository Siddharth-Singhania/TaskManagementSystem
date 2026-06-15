import { Task, SortField, Priority, Status } from '../types';

const priorityOrder: Record<Priority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const statusOrder: Record<Status, number> = {
  TODO: 1,
  IN_PROGRESS: 2,
  DONE: 3,
};

function compareValues<T>(a: T, b: T, ascending: boolean): number {
  if (a === null && b === null) return 0;
  if (a === null) return ascending ? 1 : -1;
  if (b === null) return ascending ? -1 : 1;
  
  if (a < b) return ascending ? -1 : 1;
  if (a > b) return ascending ? 1 : -1;
  return 0;
}

export function sortTasks(tasks: Task[], field: SortField, ascending: boolean): Task[] {
  return [...tasks].sort((a, b) => {
    let aValue: string | number | null;
    let bValue: string | number | null;

    switch (field) {
      case 'dueDate':
        aValue = a.dueDate;
        bValue = b.dueDate;
        break;
      case 'priority':
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'status':
        aValue = statusOrder[a.status];
        bValue = statusOrder[b.status];
        break;
      case 'createdAt':
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
      default:
        return 0;
    }

    return compareValues(aValue, bValue, ascending);
  });
}

export interface SortConfig {
  field: SortField;
  ascending: boolean;
}
