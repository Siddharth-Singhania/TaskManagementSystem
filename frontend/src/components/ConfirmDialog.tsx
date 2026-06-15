import './Modal.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="modal-overlay" onClick={onCancel} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 id="confirm-title" className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onCancel} aria-label="Close">&times;</button>
        </div>
        <div className="modal__content">
          <p id="confirm-message">{message}</p>
          <div className="confirm-dialog__actions">
            <button className="btn btn--secondary" onClick={onCancel}>{cancelLabel}</button>
            <button className="btn btn--danger" onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
