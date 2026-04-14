import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public Sections
import Header from './sections/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Destinations from './sections/Destinations';
import DestinationTours from './sections/DestinationTours';
import Portfolio from './sections/Portfolio';
import PortfolioPage from './sections/PortfolioPage';
import PortfolioDetail from './sections/PortfolioDetail';
import Tours from './sections/Tours';
import TourDetail from './sections/TourDetail';
import Blog from './sections/Blog';
import BlogPage from './sections/BlogPage';
import BlogDetail from './sections/BlogDetail';
import Testimonials from './sections/Testimonials';
import WriteReview from './sections/WriteReview';
import Partners from './sections/Partners';
import TravelStyle from './sections/TravelStyle';
import Faq from './sections/Faq';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Admin Pages
import AdminLogin from './admin/Login';
import AdminLayout from './admin/Layout';
import AdminDashboard from './admin/Dashboard';
import AdminBookings from './admin/Bookings';

// Import existing admin pages (these already exist)
import DestinationsList from './admin/destinations/DestinationsList';
import DestinationForm from './admin/destinations/DestinationForm';
import DestinationDetail from './admin/destinations/DestinationDetail';

import FlightsList from './admin/flights/FlightsList';
import FlightForm from './admin/flights/FlightForm';
import FlightDetail from './admin/flights/FlightDetail';

import AccommodationsList from './admin/accommodations/AccommodationsList';
import AccommodationForm from './admin/accommodations/AccommodationForm';
import AccommodationDetail from './admin/accommodations/AccommodationDetail';

import CarsList from './admin/cars/carsList';
import CarForm from './admin/cars/carForm';
import CarDetail from './admin/cars/carDetail';

import TourismList from './admin/tourism/tourismList';
import TourismForm from './admin/tourism/tourismForm';
import TourismDetail from './admin/tourism/tourismDetail';

import PartnersList from './admin/partners/partnersList';
import PartnerForm from './admin/partners/partnerForm';

import MessagesList from './admin/messages/messagesList';
import MessageDetail from './admin/messages/messageDetail';

import Settings from './admin/settings/settings';

// ❌ REMOVE THESE IMPORTS - they don't exist!
// import PortfolioList from './admin/portfolio/PortfolioList';
// import DestinationFormPortfolio from './admin/portfolio/DestinationForm';
// import FlightFormPortfolio from './admin/portfolio/FlightForm';
// import AccommodationFormPortfolio from './admin/portfolio/AccommodationForm';
// import CarFormPortfolio from './admin/portfolio/CarForm';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
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
        <div className="w-8 h-8 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin" />
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
        <Destinations />
        <Portfolio />
        <TravelStyle />
        <Blog />
        <Testimonials />
        <Partners />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

// Tours Page Layout
function ToursPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Tours />
      </main>
      <Footer />
    </div>
  );
}

// Destination Page Layout
function DestinationToursPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <DestinationTours />
      </main>
      <Footer />
    </div>
  );
}

// Tour Detail Page Layout
function TourDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <TourDetail />
      </main>
      <Footer />
    </div>
  );
}

// Portfolio Page Layout
function PortfolioPageLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PortfolioPage />
      </main>
      <Footer />
    </div>
  );
}

// Portfolio Detail Layout
function PortfolioDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PortfolioDetail />
      </main>
      <Footer />
    </div>
  );
}

// Blog Page Layout
function BlogPageLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BlogPage />
      </main>
      <Footer />
    </div>
  );
}

// Write Review Page Layout
function WriteReviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <WriteReview />
      </main>
      <Footer />
    </div>
  );
}

// Blog Detail Layout
function BlogDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BlogDetail />
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
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tour/:tourId" element={<TourDetailPage />} />
            <Route path="/portfolio" element={<PortfolioPageLayout />} />
            <Route path="/portfolio/:type/:id" element={<PortfolioDetailPage />} />
            <Route path="/blog" element={<BlogPageLayout />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/write-review" element={<WriteReviewPage />} />
            <Route path="/destinations/:country" element={<DestinationToursPage />} />

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
              
              {/* Destinations - These already exist */}
              <Route path="destinations" element={<DestinationsList />} />
              <Route path="destinations/new" element={<DestinationForm />} />
              <Route path="destinations/:id" element={<DestinationDetail />} />
              <Route path="destinations/:id/edit" element={<DestinationForm />} />
              
              {/* Flights - These already exist */}
              <Route path="flights" element={<FlightsList />} />
              <Route path="flights/new" element={<FlightForm />} />
              <Route path="flights/:id" element={<FlightDetail />} />
              <Route path="flights/:id/edit" element={<FlightForm />} />
              
              {/* Accommodations - These already exist */}
              <Route path="accommodations" element={<AccommodationsList />} />
              <Route path="accommodations/new" element={<AccommodationForm />} />
              <Route path="accommodations/:id" element={<AccommodationDetail />} />
              <Route path="accommodations/:id/edit" element={<AccommodationForm />} />

              {/* Cars - These already exist */}
              <Route path="cars" element={<CarsList />} />
              <Route path="cars/new" element={<CarForm />} />
              <Route path="cars/:id" element={<CarDetail />} />
              <Route path="cars/:id/edit" element={<CarForm />} />
              
              {/* Tourism - These already exist */}
              <Route path="tourism" element={<TourismList />} />
              <Route path="tourism/new" element={<TourismForm />} />
              <Route path="tourism/:id" element={<TourismDetail />} />
              <Route path="tourism/:id/edit" element={<TourismForm />} />
              
              {/* Partners - These already exist */}
              <Route path="partners" element={<PartnersList />} />
              <Route path="partners/new" element={<PartnerForm />} />
              <Route path="partners/:id/edit" element={<PartnerForm />} />

              {/* Messages - These already exist */}
              <Route path="messages" element={<MessagesList />} />
              <Route path="messages/:id" element={<MessageDetail />} />
              
              {/* Settings - These already exist */}
              <Route path="settings" element={<Settings />} />

              {/* ❌ REMOVE ALL THESE PORTFOLIO ROUTES - they're not needed!
              <Route path="portfolio" element={<PortfolioList />} />
              <Route path="portfolio/destinations/new" element={<DestinationFormPortfolio />} />
              <Route path="portfolio/destinations/:id" element={<DestinationFormPortfolio />} />
              <Route path="portfolio/destinations/:id/edit" element={<DestinationFormPortfolio />} />
              <Route path="portfolio/flights/new" element={<FlightFormPortfolio />} />
              <Route path="portfolio/flights/:id" element={<FlightFormPortfolio />} />
              <Route path="portfolio/flights/:id/edit" element={<FlightFormPortfolio />} />
              <Route path="portfolio/accommodations/new" element={<AccommodationFormPortfolio />} />
              <Route path="portfolio/accommodations/:id" element={<AccommodationFormPortfolio />} />
              <Route path="portfolio/accommodations/:id/edit" element={<AccommodationFormPortfolio />} />
              <Route path="portfolio/cars/new" element={<CarFormPortfolio />} />
              <Route path="portfolio/cars/:id" element={<CarFormPortfolio />} />
              <Route path="portfolio/cars/:id/edit" element={<CarFormPortfolio />} />
              */}
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