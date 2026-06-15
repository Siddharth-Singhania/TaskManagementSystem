import { useState, FormEvent } from 'react';
import { Task, TaskFormData, Priority, FieldError } from '../types';
import './TaskForm.css';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  errors?: FieldError[];
}

export function TaskForm({ task, onSubmit, onCancel, errors = [] }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'MEDIUM');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!task;

  const getFieldError = (field: string) => {
    return errors.find((e) => e.field === field)?.message;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description: description || undefined,
        priority,
        dueDate: dueDate || undefined,
        status: task?.status,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form__title">{isEdit ? 'Edit Task' : 'Create Task'}</h2>
      
      <div className={`form-group ${getFieldError('title') ? 'form-group--error' : ''}`}>
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={255}
          placeholder="Enter task title"
        />
        {getFieldError('title') && <div className="form-error">{getFieldError('title')}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          placeholder="Enter task description (optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="task-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
