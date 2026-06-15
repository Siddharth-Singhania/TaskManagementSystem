import { Status, Priority } from '../types';
import { FilterConfig } from '../utils/filter';
import './FilterBar.css';

interface FilterBarProps {
  filters: FilterConfig;
  onFilterChange: (filters: FilterConfig) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const hasActiveFilters = filters.status !== null || filters.priority !== null;

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value ? (value as Status) : null,
    });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({
      ...filters,
      priority: value ? (value as Priority) : null,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({ status: null, priority: null });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          className="filter-bar__select"
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="priority-filter">Priority:</label>
        <select
          id="priority-filter"
          className="filter-bar__select"
          value={filters.priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {hasActiveFilters && (
        <>
          <span className="filter-bar__active">Filters active</span>
          <button className="btn btn--secondary filter-bar__clear" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </>
      )}
    </div>
  );
}
