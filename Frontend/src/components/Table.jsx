import { Database } from 'lucide-react';
import { Button } from './Button';
import './Table.css';

const SkeletonRow = ({ cols }) => (
  <tr className="skeleton-row">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i}>
        <div className="skeleton-cell" style={{ width: i === 0 ? '60px' : `${60 + (i * 17) % 40}%` }} />
      </td>
    ))}
  </tr>
);

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  onRowClick,
  page,
  totalPages,
  totalElements,
  onPageChange,
  pageSize = 10,
  emptyMessage = 'No records found',
}) => {
  if (isLoading) {
    return (
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="table-state">
          <Database size={40} />
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id ?? rowIndex}
              className={onRowClick ? 'clickable' : ''}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="table-pagination">
          <span className="pagination-info">
            {totalElements} record{totalElements !== 1 ? 's' : ''} · Page {(page ?? 0) + 1} of {totalPages}
          </span>
          <div className="pagination-controls">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange && onPageChange(page - 1)}
              disabled={(page ?? 0) === 0}
            >
              ← Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={(page ?? 0) >= totalPages - 1}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
