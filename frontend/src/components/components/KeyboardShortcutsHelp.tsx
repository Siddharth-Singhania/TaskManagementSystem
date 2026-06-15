import './KeyboardShortcutsHelp.css';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  description: string;
}

interface KeyboardShortcutsHelpProps {
  shortcuts: Shortcut[];
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ shortcuts, onClose }: KeyboardShortcutsHelpProps) {
  const formatKey = (shortcut: Shortcut) => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    parts.push(shortcut.key === 'Escape' ? 'Esc' : shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal keyboard-shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Keyboard Shortcuts</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="modal__content">
          <ul className="shortcuts-list">
            {shortcuts.map((shortcut, index) => (
              <li key={index} className="shortcut-item">
                <kbd className="shortcut-key">{formatKey(shortcut)}</kbd>
                <span className="shortcut-description">{shortcut.description}</span>
              </li>
            ))}
            <li className="shortcut-item">
              <kbd className="shortcut-key">?</kbd>
              <span className="shortcut-description">Show keyboard shortcuts</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
