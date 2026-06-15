import { Task, Status } from '../types';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: Status) => void;
  onView: (task: Task) => void;
}

const statusLabels: Record<Status, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export function TaskItem({ task, onEdit, onDelete, onStatusChange, onView }: TaskItemProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className={`task-item task-item--${task.status.toLowerCase()}`} onClick={() => onView(task)}>
      <div className="task-item__content">
        <h3 className="task-item__title">{task.title}</h3>
        <div className="task-item__badges">
          <span className={`badge badge--status badge--${task.status.toLowerCase()}`}>
            {statusLabels[task.status]}
          </span>
          <span className={`badge badge--priority badge--${task.priority.toLowerCase()}`}>
            {priorityLabels[task.priority]}
          </span>
          {task.dueDate && (
            <span className="task-item__due-date">Due: {formatDate(task.dueDate)}</span>
          )}
        </div>
      </div>
      <div className="task-item__actions" onClick={(e) => e.stopPropagation()}>
        <select
          className="task-item__status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as Status)}
          aria-label="Change task status"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button className="btn btn--secondary" onClick={() => onEdit(task)} aria-label="Edit task">
          Edit
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(task)} aria-label="Delete task">
          Delete
        </button>
      </div>
    </div>
  );
}
