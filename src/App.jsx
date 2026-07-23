import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PullToRefresh from './components/PullToRefresh';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Apply from './pages/Apply';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';
import ReviewForm from './pages/ReviewForm';

// Lazy load ticketing pages (will be created in later phases)
import { lazy, Suspense } from 'react';

const EventsListing = lazy(() => import('./pages/tickets/EventsListing'));
const EventRegistration = lazy(() => import('./pages/tickets/EventRegistration'));
const OrderConfirmation = lazy(() => import('./pages/tickets/OrderConfirmation'));
const MyTickets = lazy(() => import('./pages/tickets/MyTickets'));
const TicketView = lazy(() => import('./pages/tickets/TicketView'));
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const ClientPortal = lazy(() => import('./pages/client/ClientPortal'));

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

function LazyFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <Suspense fallback={<LazyFallback />}>
        <ProtectedRoute>
          <RoleRoute roles={['organizer', 'admin']}>
            <DashboardLayout />
          </RoleRoute>
        </ProtectedRoute>
      </Suspense>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
        <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/reviews" element={<PageWrapper><ReviewForm /></PageWrapper>} />
        <Route path="/apply" element={<PageWrapper><Apply /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        {/* Ticketing Routes */}
        <Route path="/contact/review" element={<PageWrapper><ReviewForm /></PageWrapper>} />
        <Route path="/tickets" element={
          <PageWrapper><Suspense fallback={<LazyFallback />}><EventsListing /></Suspense></PageWrapper>
        } />
        <Route path="/e/:slug" element={
          <PageWrapper><Suspense fallback={<LazyFallback />}><EventRegistration /></Suspense></PageWrapper>
        } />
        <Route path="/orders/:id/confirmation" element={
          <PageWrapper><Suspense fallback={<LazyFallback />}><OrderConfirmation /></Suspense></PageWrapper>
        } />
        <Route path="/my-tickets" element={
          <PageWrapper>
            <ProtectedRoute>
              <Suspense fallback={<LazyFallback />}><MyTickets /></Suspense>
            </ProtectedRoute>
          </PageWrapper>
        } />
        <Route path="/my-tickets/:ticketCode" element={
          <PageWrapper>
            <ProtectedRoute>
              <Suspense fallback={<LazyFallback />}><TicketView /></Suspense>
            </ProtectedRoute>
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const routerContent = (
    <Routes>
      <Route path="/dashboard/*" element={
        <Suspense fallback={<LazyFallback />}>
          <ProtectedRoute>
            <RoleRoute roles={['organizer', 'admin']}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        </Suspense>
      } />
      <Route path="/client-portal" element={
        <Suspense fallback={<LazyFallback />}>
          <ProtectedRoute>
            <RoleRoute roles={['client']}>
              <ClientPortal />
            </RoleRoute>
          </ProtectedRoute>
        </Suspense>
      } />
      <Route path="*" element={<MainLayout />} />
    </Routes>
  );

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        {routerContent}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1B1B1B',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#ff5f00', secondary: '#fff' } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-cream">
      <PullToRefresh />
      {/* HEADER: strictly in the flow, flex shrink 0 so it never collapses or moves */}
      <div className="w-full shrink-0 z-50 shadow-sm relative">
        <TopBar />
        <Navbar />
      </div>
      
      {/* CONTENT: the only thing that scrolls */}
      <div id="main-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden w-full relative app-content overscroll-none">
        <main className="min-h-full w-full">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
              <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/reviews" element={<PageWrapper><ReviewForm /></PageWrapper>} />
              <Route path="/apply" element={<PageWrapper><Apply /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

              {/* Ticketing Routes */}
              <Route path="/tickets" element={
                <PageWrapper><Suspense fallback={<LazyFallback />}><EventsListing /></Suspense></PageWrapper>
              } />
              <Route path="/e/:slug" element={
                <PageWrapper><Suspense fallback={<LazyFallback />}><EventRegistration /></Suspense></PageWrapper>
              } />
              <Route path="/orders/:id/confirmation" element={
                <PageWrapper><Suspense fallback={<LazyFallback />}><OrderConfirmation /></Suspense></PageWrapper>
              } />
              <Route path="/my-tickets" element={
                <PageWrapper>
                  <ProtectedRoute>
                    <Suspense fallback={<LazyFallback />}><MyTickets /></Suspense>
                  </ProtectedRoute>
                </PageWrapper>
              } />
              <Route path="/my-tickets/:ticketCode" element={
                <PageWrapper>
                  <ProtectedRoute>
                    <Suspense fallback={<LazyFallback />}><TicketView /></Suspense>
                  </ProtectedRoute>
                </PageWrapper>
              } />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
