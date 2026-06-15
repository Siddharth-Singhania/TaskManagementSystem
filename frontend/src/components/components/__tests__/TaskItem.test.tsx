import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from '../TaskItem';
import { Task } from '../../types';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Test Task',
  description: 'Test description',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '2024-06-15',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

describe('TaskItem', () => {
  const defaultProps = {
    task: createTask(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onStatusChange: vi.fn(),
    onView: vi.fn(),
  };

  it('renders task title', () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('renders priority badge', () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders due date when present', () => {
    render(<TaskItem {...defaultProps} />);
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  it('does not render due date when null', () => {
    const task = createTask({ dueDate: null });
    render(<TaskItem {...defaultProps} task={task} />);
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('calls onView when clicking the task item', () => {
    const onView = vi.fn();
    render(<TaskItem {...defaultProps} onView={onView} />);
    
    fireEvent.click(screen.getByText('Test Task'));
    expect(onView).toHaveBeenCalledWith(defaultProps.task);
  });

  it('calls onEdit when clicking edit button', () => {
    const onEdit = vi.fn();
    render(<TaskItem {...defaultProps} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByLabelText('Edit task'));
    expect(onEdit).toHaveBeenCalledWith(defaultProps.task);
  });

  it('calls onDelete when clicking delete button', () => {
    const onDelete = vi.fn();
    render(<TaskItem {...defaultProps} onDelete={onDelete} />);
    
    fireEvent.click(screen.getByLabelText('Delete task'));
    expect(onDelete).toHaveBeenCalledWith(defaultProps.task);
  });

  it('calls onStatusChange when changing status dropdown', () => {
    const onStatusChange = vi.fn();
    render(<TaskItem {...defaultProps} onStatusChange={onStatusChange} />);
    
    const select = screen.getByLabelText('Change task status');
    fireEvent.change(select, { target: { value: 'IN_PROGRESS' } });
    
    expect(onStatusChange).toHaveBeenCalledWith(defaultProps.task, 'IN_PROGRESS');
  });

  it('renders with done styling when status is DONE', () => {
    const task = createTask({ status: 'DONE' });
    render(<TaskItem {...defaultProps} task={task} />);
    
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows correct status options in dropdown', () => {
    render(<TaskItem {...defaultProps} />);
    
    const select = screen.getByLabelText('Change task status');
    expect(select).toHaveValue('TODO');
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('To Do');
    expect(options[1]).toHaveTextContent('In Progress');
    expect(options[2]).toHaveTextContent('Done');
  });
});
