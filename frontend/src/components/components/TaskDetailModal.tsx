import { Task, Status } from '../types';
import './Modal.css';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
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

export function TaskDetailModal({ task, onClose, onEdit, onDelete }: TaskDetailModalProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString();
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="task-detail-title">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 id="task-detail-title" className="modal__title">Task Details</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        <div className="modal__content">
          <div className="task-detail">
            <h3 className="task-detail__title">{task.title}</h3>
            
            <div className="task-detail__field">
              <strong>Status:</strong> {statusLabels[task.status]}
            </div>
            
            <div className="task-detail__field">
              <strong>Priority:</strong> {priorityLabels[task.priority]}
            </div>
            
            <div className="task-detail__field">
              <strong>Due Date:</strong> {formatDate(task.dueDate)}
            </div>
            
            <div className="task-detail__field">
              <strong>Description:</strong>
              <p className="task-detail__description">{task.description || 'No description'}</p>
            </div>
            
            <div className="task-detail__field">
              <strong>Created:</strong> {formatDateTime(task.createdAt)}
            </div>
            
            <div className="task-detail__field">
              <strong>Updated:</strong> {formatDateTime(task.updatedAt)}
            </div>
            
            <div className="task-detail__actions">
              <button className="btn btn--secondary" onClick={() => onEdit(task)}>Edit</button>
              <button className="btn btn--danger" onClick={() => onDelete(task)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
