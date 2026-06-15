import { useState, useMemo, useCallback } from 'react';
import { Task, TaskFormData, Status, SortField, FieldError, ApiError } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';
import { useKeyboardShortcuts, getTaskShortcuts } from '../hooks/useKeyboardShortcuts';
import { FilterConfig, filterTasks } from '../utils/filter';
import { SortConfig, sortTasks } from '../utils/sort';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { TaskDetailModal } from './TaskDetailModal';
import { ConfirmDialog } from './ConfirmDialog';
import { FilterBar } from './FilterBar';
import { SortControls } from './SortControls';
import { LoadingSkeleton } from './LoadingSkeleton';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import './TaskListPage.css';

export function TaskListPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, updateStatus, refresh } = useTasks();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Persist filters and sort config in localStorage
  const [filters, setFilters] = useLocalStorage<FilterConfig>('taskFilters', { status: null, priority: null });
  const [sortConfig, setSortConfig] = useLocalStorage<SortConfig>('taskSortConfig', { field: 'createdAt' as SortField, ascending: false });

  // Debounce filter changes for better performance
  const debouncedFilters = useDebounce(filters, 300);
  const debouncedSortConfig = useDebounce(sortConfig, 300);

  const displayedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, debouncedFilters);
    return sortTasks(filtered, debouncedSortConfig.field, debouncedSortConfig.ascending);
  }, [tasks, debouncedFilters, debouncedSortConfig]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleCreateNew = useCallback(() => {
    setFormErrors([]);
    setShowForm(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ status: null, priority: null });
    showToast('Filters cleared', 'success');
  }, [setFilters, showToast]);

  // Keyboard shortcuts
  const shortcuts = getTaskShortcuts({
    createTask: handleCreateNew,
    refresh: refresh,
    clearFilters: handleClearFilters,
  });

  useKeyboardShortcuts([
    ...shortcuts,
    {
      key: '?',
      shift: true,
      action: () => setShowShortcuts(true),
      description: 'Show keyboard shortcuts',
    },
  ]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setFormErrors([]);
      await createTask(data);
      setShowForm(false);
      showToast('Task created successfully', 'success');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.fieldErrors) {
        setFormErrors(apiError.fieldErrors);
      } else {
        showToast(apiError.message || 'Failed to create task', 'error');
      }
      throw err;
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      setFormErrors([]);
      await updateTask(editingTask.id, data);
      setEditingTask(null);
      setViewingTask(null);
      showToast('Task updated successfully', 'success');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.fieldErrors) {
        setFormErrors(apiError.fieldErrors);
      } else {
        showToast(apiError.message || 'Failed to update task', 'error');
      }
      throw err;
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      setViewingTask(null);
      showToast('Task deleted successfully', 'success');
    } catch (err) {
      const apiError = err as ApiError;
      showToast(apiError.message || 'Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (task: Task, status: Status) => {
    try {
      await updateStatus(task.id, status);
    } catch (err) {
      const apiError = err as ApiError;
      showToast(apiError.message || 'Failed to update status', 'error');
    }
  };

  const handleEdit = (task: Task) => {
    setFormErrors([]);
    setEditingTask(task);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormErrors([]);
  };

  return (
    <div className="task-list-page">
      <header className="task-list-page__header">
        <h1 className="task-list-page__title">Task Management</h1>
        <div className="task-list-page__header-actions">
          <button 
            className="btn btn--icon" 
            onClick={() => setShowShortcuts(true)}
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            ⌨️
          </button>
          <button 
            className="btn btn--secondary" 
            onClick={refresh}
            aria-label="Refresh tasks"
            title="Refresh (R)"
          >
            ↻ Refresh
          </button>
          <button 
            className="btn btn--primary" 
            onClick={handleCreateNew}
            title="New task (N)"
          >
            + New Task
          </button>
        </div>
      </header>

      {error && <div className="task-list-page__error">{error}</div>}

      <FilterBar filters={filters} onFilterChange={setFilters} />
      <SortControls sortConfig={sortConfig} onSortChange={setSortConfig} />

      {loading ? (
        <LoadingSkeleton count={5} />
      ) : displayedTasks.length === 0 ? (
        <div className="task-list-page__empty">
          <h3>No tasks found</h3>
          <p>{tasks.length === 0 ? 'Create your first task to get started. Press N to create a new task.' : 'Try adjusting your filters. Press Esc to clear filters.'}</p>
        </div>
      ) : (
        <ul className="task-list">
          {displayedTasks.map((task) => (
            <li key={task.id}>
              <TaskItem
                task={task}
                onEdit={handleEdit}
                onDelete={setDeletingTask}
                onStatusChange={handleStatusChange}
                onView={setViewingTask}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="task-list-page__footer">
        <span className="task-count">
          {displayedTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {(showForm || editingTask) && (
        <div className="modal-overlay" onClick={handleCancelForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCancelForm}
              errors={formErrors}
            />
          </div>
        </div>
      )}

      {viewingTask && !editingTask && (
        <TaskDetailModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={handleEdit}
          onDelete={setDeletingTask}
        />
      )}

      {deletingTask && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteTask}
          onCancel={() => setDeletingTask(null)}
        />
      )}

      {showShortcuts && (
        <KeyboardShortcutsHelp
          shortcuts={shortcuts}
          onClose={() => setShowShortcuts(false)}
        />
      )}

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
