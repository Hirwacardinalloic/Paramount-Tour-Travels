import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Calendar, Users, ChevronLeft, ChevronRight, Check, X as XIcon, 
  Phone, Mail, MessageCircle, Star
} from 'lucide-react';
import type { Tour } from '../data/tours';

export default function TourDetail() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    travelers: 2,
    specialRequests: ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included' | 'map'>('overview');

  // Load tour from API
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tourism/${tourId}`);
        if (!response.ok) {
          setTour(null);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        // Transform API data to match Tour interface
        const transformedTour: Tour = {
          id: data.id.toString(),
          name: data.name || data.title,
          location: data.location,
          duration: data.duration,
          price: data.price || 0,
          description: data.description,
          longDescription: data.longDescription || data.description,
          highlights: Array.isArray(data.highlights) ? data.highlights : (data.highlights ? JSON.parse(data.highlights) : []),
          itinerary: Array.isArray(data.itinerary) ? data.itinerary : (data.itinerary ? JSON.parse(data.itinerary) : []),
          included: Array.isArray(data.included) ? data.included : (data.included ? JSON.parse(data.included) : []),
          excluded: Array.isArray(data.excluded) ? data.excluded : (data.excluded ? JSON.parse(data.excluded) : []),
          importantInfo: Array.isArray(data.importantInfo) ? data.importantInfo : (data.importantInfo ? JSON.parse(data.importantInfo) : []),
          images: Array.isArray(data.images) ? data.images : (data.images ? JSON.parse(data.images) : [data.image].filter(Boolean)),
          category: data.category,
          groupSize: data.groupSize || '',
          bestTime: data.bestTime || ''
        };
        
        setTour(transformedTour);
      } catch (error) {
        console.error('Failed to fetch tour:', error);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  // Function to get country from tour location
  const getCountryFromLocation = (location: string): string | null => {
    if (location.toLowerCase().includes('uganda')) return 'uganda';
    if (location.toLowerCase().includes('kenya')) return 'kenya';
    if (location.toLowerCase().includes('tanzania')) return 'tanzania';
    if (location.toLowerCase().includes('rwanda')) return 'rwanda';
    return null;
  };

  // Get the country for this tour
  const tourCountry = tour ? getCountryFromLocation(tour.location) : null;
  const backPath = tourCountry ? `/destinations/${tourCountry}` : '/tours';
  const backText = tourCountry ? `Back to ${tourCountry.charAt(0).toUpperCase() + tourCountry.slice(1)}` : 'Back to Tours';

  // Get related tours (same category, excluding current)
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);

  useEffect(() => {
    const fetchRelatedTours = async () => {
      if (!tour) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/tourism?status=active&category=${tour.category}`);
        const data = await response.json();
        
        const transformedTours: Tour[] = data
          .filter((item: any) => item.id !== parseInt(tourId || '0'))
          .slice(0, 3)
          .map((item: any) => ({
            id: item.id.toString(),
            name: item.name || item.title,
            location: item.location,
            duration: item.duration,
            price: item.price || 0,
            description: item.description,
            longDescription: item.longDescription || item.description,
            highlights: Array.isArray(item.highlights) ? item.highlights : (item.highlights ? JSON.parse(item.highlights) : []),
            itinerary: Array.isArray(item.itinerary) ? item.itinerary : (item.itinerary ? JSON.parse(item.itinerary) : []),
            included: Array.isArray(item.included) ? item.included : (item.included ? JSON.parse(item.included) : []),
            excluded: Array.isArray(item.excluded) ? item.excluded : (item.excluded ? JSON.parse(item.excluded) : []),
            importantInfo: Array.isArray(item.importantInfo) ? item.importantInfo : (item.importantInfo ? JSON.parse(item.importantInfo) : []),
            images: Array.isArray(item.images) ? item.images : (item.images ? JSON.parse(item.images) : [item.image].filter(Boolean)),
            category: item.category,
            groupSize: item.groupSize || '',
            bestTime: item.bestTime || ''
          }));
        
        setRelatedTours(transformedTours);
      } catch (error) {
        console.error('Failed to fetch related tours:', error);
      }
    };

    fetchRelatedTours();
  }, [tour, tourId]);

  const handleImageNav = (direction: 'prev' | 'next') => {
    if (!tour?.images?.length) return;
    setSelectedImage((current) => {
      const count = tour.images.length;
      return direction === 'next'
        ? (current + 1) % count
        : (current - 1 + count) % count;
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send to your backend
    console.log('Booking submitted:', { ...bookingData, tourId, tourName: tour?.name });
    alert('Booking request sent successfully! We will contact you soon.');
    setShowBookingForm(false);
    setBookingData({ name: '', email: '', phone: '', travelDate: '', travelers: 2, specialRequests: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
          <button onClick={() => navigate('/tours')} className="bg-[#2f8eb2] text-white px-6 py-2 rounded-lg">
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#2f8eb2] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {backText}
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
                <img
                  src={tour.images?.[selectedImage] || '/api/placeholder/800/500'}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
                {tour.images && tour.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleImageNav('prev')}
                      className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageNav('next')}
                      className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {tour.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === selectedImage ? 'bg-[#2f8eb2] w-4' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{tour.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4 text-[#2f8eb2]" />
                <span>{tour.location}</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{tour.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Group Size</span>
                  <span className="font-semibold">{tour.groupSize || '2-10 people'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Best Time</span>
                  <span className="font-semibold">{tour.bestTime || 'Year-round'}</span>
                </div>
              </div>
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-[#2f8eb2] text-white py-3 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors mb-3"
              >
                Book This Tour
              </button>
              <button
                onClick={() => window.location.href = 'mailto:info@paramountadventures.com'}
                className="w-full border border-[#2f8eb2] text-[#2f8eb2] py-3 rounded-lg font-semibold hover:bg-[#2f8eb2] hover:text-white transition-colors"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'itinerary', label: 'Itinerary' },
              { id: 'included', label: 'Included/Excluded' },
              { id: 'map', label: 'Map' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#2f8eb2] text-[#2f8eb2]'
                    : 'border-transparent text-gray-600 hover:text-[#2f8eb2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* === OVERVIEW TAB === */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Overview</h2>
                  <p className="text-gray-600 leading-relaxed">{tour.longDescription || tour.description}</p>
                </div>
                {tour.highlights && tour.highlights.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tour Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-[#2f8eb2]" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {tour.importantInfo && tour.importantInfo.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <h4 className="font-bold text-gray-900 mb-2">Important Information</h4>
                    <ul className="space-y-1">
                      {tour.importantInfo.map((info, idx) => (
                        <li key={idx} className="text-gray-600 text-sm">• {info}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* === ITINERARY TAB === */}
            {activeTab === 'itinerary' && tour.itinerary && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Itinerary</h2>
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="border-l-4 border-[#2f8eb2] pl-6 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-[#2f8eb2]" />
                      <h3 className="text-xl font-bold text-gray-900">Day {day.day}: {day.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">{day.description}</p>
                    {day.overnight && (
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Overnight:</span> {day.overnight}
                      </p>
                    )}
                    {(day as any).meals && (
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Meals:</span> {(day as any).meals}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* === INCLUDED/EXCLUDED TAB === */}
            {activeTab === 'included' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-6 h-6 text-green-600" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.included?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <XIcon className="w-6 h-6 text-red-600" />
                    Excluded
                  </h3>
                  <ul className="space-y-2">
                    {tour.excluded?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <XIcon className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Map Tab */}
            {activeTab === 'map' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Map</h2>
                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Map coming soon</p>
                    <p className="text-sm text-gray-400 mt-2">Check with our team for location details</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Quick Contact</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600"><Phone className="w-4 h-4 text-[#2f8eb2]" /><span>+250 788 123 456</span></div>
                <div className="flex items-center gap-3 text-gray-600"><Mail className="w-4 h-4 text-[#2f8eb2]" /><span>info@paramountadventures.com</span></div>
              </div>
              <button onClick={() => window.open('https://wa.me/250788123456', '_blank')} className="w-full bg-[#2f8eb2] text-white py-2 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors"><MessageCircle className="w-4 h-4 inline mr-2" />WhatsApp Us</button>
            </div>
          </div>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTours.map((relatedTour) => (
                <div key={relatedTour.id} onClick={() => navigate(`/tour/${relatedTour.id}`)} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="h-48 overflow-hidden"><img src={relatedTour.images[0]} alt={relatedTour.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                  <div className="p-4"><h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{relatedTour.name}</h3><div className="flex items-center justify-between"><span className="text-sm text-gray-500">{relatedTour.duration}</span></div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">Book This Tour</h3>
              <button onClick={() => setShowBookingForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.name}
                onChange={e => setBookingData({...bookingData, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email *"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.email}
                onChange={e => setBookingData({...bookingData, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.phone}
                onChange={e => setBookingData({...bookingData, phone: e.target.value})}
              />
              <input
                type="date"
                placeholder="Travel Date"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.travelDate}
                onChange={e => setBookingData({...bookingData, travelDate: e.target.value})}
              />
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.travelers}
                onChange={e => setBookingData({...bookingData, travelers: Number(e.target.value)})}
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                ))}
              </select>
              <textarea
                placeholder="Special Requests"
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.specialRequests}
                onChange={e => setBookingData({...bookingData, specialRequests: e.target.value})}
              />
              <button type="submit" className="w-full bg-[#2f8eb2] text-white py-3 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors">
                Submit Booking Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
