import usePullToRefresh from '../hooks/usePullToRefresh';

/**
 * PullToRefresh
 * Renders a subtle, branded indicator at the top of the screen when the user
 * pulls down on mobile. Completely invisible at rest — no visual impact on
 * the existing design.
 */
export default function PullToRefresh() {
  const { pullDistance, isRefreshing, threshold } = usePullToRefresh();

  const progress = Math.min(pullDistance / threshold, 1);       // 0 → 1
  const isTriggered = progress >= 1;
  const visible = pullDistance > 4 || isRefreshing;

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex justify-center items-end pointer-events-none"
      style={{
        height: `${isRefreshing ? 56 : Math.max(pullDistance, 8) + 16}px`,
        transition: isRefreshing ? 'height 0.2s ease' : 'none',
      }}
    >
      <div
        className="mb-2 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg"
        style={{
        background: 'rgba(20, 83, 45, 0.95)',
          backdropFilter: 'blur(8px)',
          opacity: Math.min(progress * 1.5, 1),
          transform: `scale(${0.85 + progress * 0.15})`,
          transition: 'opacity 0.1s, transform 0.1s',
        }}
      >
        {/* Spinner or Arrow */}
        {isRefreshing || isTriggered ? (
          <svg
            className="w-4 h-4 text-white animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v2A12 12 0 014 12z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-white transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{ transform: `rotate(${progress * 180}deg)` }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
        <span className="text-white text-xs font-semibold tracking-wide">
          {isRefreshing ? 'Refreshing…' : isTriggered ? 'Release to refresh' : 'Pull to refresh'}
        </span>
      </div>
    </div>
  );
}
