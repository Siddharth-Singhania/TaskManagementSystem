import { SortField } from '../types';
import { SortConfig } from '../utils/sort';
import './SortControls.css';

interface SortControlsProps {
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
}

const fieldLabels: Record<SortField, string> = {
  dueDate: 'Due Date',
  priority: 'Priority',
  status: 'Status',
  createdAt: 'Created Date',
};

export function SortControls({ sortConfig, onSortChange }: SortControlsProps) {
  const handleFieldChange = (value: string) => {
    onSortChange({
      ...sortConfig,
      field: value as SortField,
    });
  };

  const toggleDirection = () => {
    onSortChange({
      ...sortConfig,
      ascending: !sortConfig.ascending,
    });
  };

  return (
    <div className="sort-controls">
      <div className="sort-controls__group">
        <label className="sort-controls__label" htmlFor="sort-field">Sort by:</label>
        <select
          id="sort-field"
          className="sort-controls__select"
          value={sortConfig.field}
          onChange={(e) => handleFieldChange(e.target.value)}
        >
          {Object.entries(fieldLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <button
        className="btn btn--secondary sort-controls__direction"
        onClick={toggleDirection}
        aria-label={sortConfig.ascending ? 'Sort descending' : 'Sort ascending'}
      >
        {sortConfig.ascending ? '↑ Ascending' : '↓ Descending'}
      </button>

      <span className="sort-controls__current">
        Sorted by {fieldLabels[sortConfig.field]} ({sortConfig.ascending ? 'asc' : 'desc'})
      </span>
    </div>
  );
}
