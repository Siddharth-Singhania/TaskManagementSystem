import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 5 }: LoadingSkeletonProps) {
  return (
    <div className="loading-skeleton" aria-label="Loading tasks">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-badges">
              <div className="skeleton-badge"></div>
              <div className="skeleton-badge"></div>
              <div className="skeleton-date"></div>
            </div>
          </div>
          <div className="skeleton-actions">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
