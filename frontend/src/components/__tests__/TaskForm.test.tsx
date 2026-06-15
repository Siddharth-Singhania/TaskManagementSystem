import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../TaskForm';
import { Task } from '../../types';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Existing Task',
  description: 'Existing description',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '2024-06-15',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('TaskForm', () => {
  const defaultProps = {
    onSubmit: vi.fn().mockResolvedValue(undefined),
    onCancel: vi.fn(),
    errors: [],
  };

  describe('Create mode', () => {
    it('renders create form title', () => {
      render(<TaskForm {...defaultProps} />);
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });

    it('renders empty form fields', () => {
      render(<TaskForm {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/Title/);
      const descriptionInput = screen.getByLabelText(/Description/);
      
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });

    it('defaults priority to MEDIUM', () => {
      render(<TaskForm {...defaultProps} />);
      
      const prioritySelect = screen.getByLabelText(/Priority/);
      expect(prioritySelect).toHaveValue('MEDIUM');
    });

    it('shows Create Task button', () => {
      render(<TaskForm {...defaultProps} />);
      expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
    });
  });

  describe('Edit mode', () => {
    it('renders edit form title', () => {
      render(<TaskForm {...defaultProps} task={createTask()} />);
      expect(screen.getByText('Edit Task')).toBeInTheDocument();
    });

    it('pre-populates form with task values', () => {
      render(<TaskForm {...defaultProps} task={createTask()} />);
      
      expect(screen.getByLabelText(/Title/)).toHaveValue('Existing Task');
      expect(screen.getByLabelText(/Description/)).toHaveValue('Existing description');
      expect(screen.getByLabelText(/Priority/)).toHaveValue('MEDIUM');
    });

    it('shows Update Task button', () => {
      render(<TaskForm {...defaultProps} task={createTask()} />);
      expect(screen.getByRole('button', { name: /Update Task/i })).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('requires title field', () => {
      render(<TaskForm {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/Title/);
      expect(titleInput).toBeRequired();
    });

    it('displays field errors', () => {
      const errors = [{ field: 'title', message: 'Title is required' }];
      render(<TaskForm {...defaultProps} errors={errors} />);
      
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    it('calls onSubmit with form data', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<TaskForm {...defaultProps} onSubmit={onSubmit} />);
      
      await userEvent.type(screen.getByLabelText(/Title/), 'New Task');
      await userEvent.type(screen.getByLabelText(/Description/), 'Task description');
      await userEvent.selectOptions(screen.getByLabelText(/Priority/), 'HIGH');
      
      fireEvent.submit(screen.getByRole('button', { name: /Create Task/i }));
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Task',
            description: 'Task description',
            priority: 'HIGH',
          })
        );
      });
    });

    it('disables buttons while submitting', async () => {
      const onSubmit = vi.fn().mockImplementation(() => new Promise(() => {}));
      render(<TaskForm {...defaultProps} onSubmit={onSubmit} />);
      
      await userEvent.type(screen.getByLabelText(/Title/), 'Test');
      fireEvent.submit(screen.getByRole('button', { name: /Create Task/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Saving/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
      });
    });
  });

  describe('Cancel action', () => {
    it('calls onCancel when clicking cancel button', () => {
      const onCancel = vi.fn();
      render(<TaskForm {...defaultProps} onCancel={onCancel} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
      
      expect(onCancel).toHaveBeenCalled();
    });
  });
});
