import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public Sections
import Header from './sections/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import Partners from './sections/Partners';
import Staff from './sections/Staff';
import Booking from './sections/Booking';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Admin Pages
import AdminLogin from './admin/Login';
import AdminLayout from './admin/Layout';
import AdminDashboard from './admin/Dashboard';
import AdminBookings from './admin/Bookings';

// Import all new admin pages
import EventsList from './admin/events/eventsList';
import EventForm from './admin/events/EventForm';
import EventDetail from './admin/events/EventDetail';

import CarsList from './admin/cars/CarsList';
import CarForm from './admin/cars/CarForm';
import CarDetail from './admin/cars/CarDetail';

import TourismList from './admin/tourism/TourismList';
import TourismForm from './admin/tourism/TourismForm';
import TourismDetail from './admin/tourism/TourismDetail';

import PartnersList from './admin/partners/PartnersList';
import PartnerForm from './admin/partners/PartnerForm';

import StaffList from './admin/staff/StaffList';
import StaffForm from './admin/staff/StaffForm';

import MessagesList from './admin/messages/MessagesList';
import MessageDetail from './admin/messages/MessageDetail';

import Settings from './admin/settings/Settings';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Public Layout
function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Staff />
        <Partners />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

// App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              
              {/* Events */}
              <Route path="events" element={<EventsList />} />
              <Route path="events/new" element={<EventForm />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="events/:id/edit" element={<EventForm />} />
              
              {/* Cars */}
              <Route path="cars" element={<CarsList />} />
              <Route path="cars/new" element={<CarForm />} />
              <Route path="cars/:id" element={<CarDetail />} />
              <Route path="cars/:id/edit" element={<CarForm />} />
              
              {/* Tourism */}
              <Route path="tourism" element={<TourismList />} />
              <Route path="tourism/new" element={<TourismForm />} />
              <Route path="tourism/:id" element={<TourismDetail />} />
              <Route path="tourism/:id/edit" element={<TourismForm />} />
              
              {/* Partners */}
              <Route path="partners" element={<PartnersList />} />
              <Route path="partners/new" element={<PartnerForm />} />
              <Route path="partners/:id/edit" element={<PartnerForm />} />
              
              {/* Staff */}
              <Route path="staff" element={<StaffList />} />
              <Route path="staff/new" element={<StaffForm />} />
              <Route path="staff/:id/edit" element={<StaffForm />} />

              {/* Messages */}
              <Route path="messages" element={<MessagesList />} />
              <Route path="messages/:id" element={<MessageDetail />} />
              
              {/* Settings */}
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;