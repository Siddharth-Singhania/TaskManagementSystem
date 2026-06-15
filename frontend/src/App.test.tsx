import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API client to prevent actual API calls
vi.mock('./api/client', () => ({
  apiClient: {
    getAllTasks: vi.fn().mockResolvedValue([]),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

describe('App', () => {
  it('renders the task list page', async () => {
    render(<App />);
    
    // The TaskListPage renders "Task Management" as the main heading
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Task Management');
  });

  it('renders the new task button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /New Task/i })).toBeInTheDocument();
  });
});
