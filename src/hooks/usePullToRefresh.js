import { useEffect, useRef, useState } from 'react';

const PULL_THRESHOLD = 80; // px needed to trigger refresh
const MAX_PULL = 120;       // max visual pull distance

/**
 * usePullToRefresh
 * Attaches pull-to-refresh behaviour to a scrollable container.
 * @param {string} scrollContainerId - The id of the scrollable element
 * @param {Function} onRefresh - Callback when pull threshold is reached (defaults to page reload)
 */
export default function usePullToRefresh(
  scrollContainerId = 'main-scroll-container',
  onRefresh = () => window.location.reload()
) {
  const [pullDistance, setPullDistance] = useState(0);  // 0–MAX_PULL
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(null);
  const isPullingRef = useRef(false);

  useEffect(() => {
    const el = document.getElementById(scrollContainerId);
    if (!el) return;

    const onTouchStart = (e) => {
      // Only activate when the container is scrolled to the very top
      if (el.scrollTop === 0) {
        startYRef.current = e.touches[0].clientY;
        isPullingRef.current = true;
      }
    };

    const onTouchMove = (e) => {
      if (!isPullingRef.current || startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta <= 0) {
        isPullingRef.current = false;
        setPullDistance(0);
        return;
      }
      // Prevent native scroll while pulling
      if (el.scrollTop === 0 && delta > 0) {
        e.preventDefault();
      }
      // Apply resistance: pull feels heavier the further you go
      const resistance = Math.min(delta * 0.5, MAX_PULL);
      setPullDistance(resistance);
    };

    const onTouchEnd = () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;
      startYRef.current = null;

      if (pullDistance >= PULL_THRESHOLD * 0.5) {
        setIsRefreshing(true);
        // Brief delay so the user sees the spinner, then reload
        setTimeout(() => {
          onRefresh();
        }, 600);
      } else {
        setPullDistance(0);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerId, pullDistance]);

  return { pullDistance, isRefreshing, threshold: PULL_THRESHOLD * 0.5 };
}
