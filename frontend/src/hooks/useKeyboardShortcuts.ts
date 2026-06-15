import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !(event.ctrlKey || event.metaKey);
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return shortcuts;
}

// Predefined shortcuts for the task management app
export const getTaskShortcuts = (actions: {
  createTask: () => void;
  refresh: () => void;
  clearFilters: () => void;
  focusSearch?: () => void;
}) => [
  {
    key: 'n',
    action: actions.createTask,
    description: 'Create new task',
  },
  {
    key: 'r',
    action: actions.refresh,
    description: 'Refresh task list',
  },
  {
    key: 'Escape',
    action: actions.clearFilters,
    description: 'Clear all filters',
  },
  ...(actions.focusSearch ? [{
    key: '/',
    action: actions.focusSearch,
    description: 'Focus search',
  }] : []),
];
