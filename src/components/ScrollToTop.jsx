import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      
      const mainScrollContainer = document.getElementById('main-scroll-container');
      if (mainScrollContainer) {
        mainScrollContainer.scrollTo(0, 0);
      }

      const dashboardScrollContainer = document.getElementById('dashboard-scroll-container');
      if (dashboardScrollContainer) {
        dashboardScrollContainer.scrollTo(0, 0);
      }
    }
  }, [location.pathname, location.hash]);

  return null;
}
