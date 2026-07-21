import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Scroll the standard window (fallback)
    window.scrollTo(0, 0);
    
    // 2. Scroll the main site container
    const mainScrollContainer = document.getElementById('main-scroll-container');
    if (mainScrollContainer) {
      mainScrollContainer.scrollTo(0, 0);
    }

    // 3. Scroll the dashboard container
    const dashboardScrollContainer = document.getElementById('dashboard-scroll-container');
    if (dashboardScrollContainer) {
      dashboardScrollContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
