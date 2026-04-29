import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Mail,
  MessageCircle,
  Star,
  X as XIcon,
} from 'lucide-react';

const getApiPath = (type: string) => {
  switch (type) {
    case 'destination':
      return 'destinations';
    case 'accommodation':
      return 'accommodations';
    case 'flight':
      return 'flights';
    case 'car':
      return 'cars';
    case 'tourism':
      return 'tourism';
    default:
      return '';
  }
};

const getTabForType = (type: string) => {
  switch (type) {
    case 'destination':
      return 'destination';
    case 'accommodation':
      return 'accommodation';
    case 'flight':
      return 'flight';
    case 'car':
      return 'car';
    default:
      return 'all';
  }
};

const parseJsonField = (field: any) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;

  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    if (typeof field === 'string') {
      return field
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    }
    return [field];
  }
};

const getImageUrl = (image: string) => {
  if (!image) return '/placeholder.jpg';
  if (image.startsWith('http')) return image;
  const cleanPath = image.replace('./', '/');
  return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
};

export default function PortfolioDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleImageNav = (direction: 'prev' | 'next') => {
    setSelectedImage((current) => {
      const count = displayImages.length;
      if (!count) return 0;
      return direction === 'next'
        ? (current + 1) % count
        : (current - 1 + count) % count;
    });
  };
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included' | 'map'>('overview');
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    from: 'Kigali',
    to: '',
    departureDate: '',
    returnDate: '',
    travelDate: '',
    travelers: 1,
    flightClass: 'Economy',
    airline: '',
    specialRequests: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!type || !id) {
        setError('Invalid item');
        setLoading(false);
        return;
      }

      const apiPath = getApiPath(type);
      if (!apiPath) {
        setError('Unsupported detail type');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/${apiPath}/${id}`);
        if (!response.ok) {
          setError('Item not found');
          setLoading(false);
          return;
        }

        const data = await response.json();
        const normalized = {
          type,
          id: data.id,
          title: data.title || data.name || data.model || `Details #${data.id}`,
          description: data.description || data.summary || '',
          longDescription: data.longDescription || data.description || data.summary || '',
          image: data.image || '',
          price: data.price || data.pricePerNight || 'Contact us',
          location: data.location || data.route || data.category || '',
          duration: data.duration || data.flightClass || '',
          bestTime: data.bestTime || data.bestSeason || '',
          itinerary: parseJsonField(data.itinerary),
          activities: parseJsonField(data.activities),
          highlights: parseJsonField(data.highlights || data.activities),
          importantInfo: parseJsonField(data.importantInfo || data.important_info),
          amenities: parseJsonField(data.amenities || data.features),
          included: parseJsonField(data.included || data.features || data.amenities),
          excluded: parseJsonField(data.excluded || data.notIncluded || data.not_included),
          category: data.category || '',
          airline: data.airline || '',
          route: data.route || '',
          departureDate: data.departureDate || data.departure_date || '',
          returnDate: data.returnDate || data.return_date || '',
          roomType: data.type || data.roomType || '',
          transmission: data.transmission || '',
          fuel: data.fuel || '',
          seats: data.seats || data.mileage || '',
          model: data.model || data.title || '',
          rating: data.rating || 0,
        };

        setItem(normalized);
        const initialImages = [normalized.image];
        if (data.images) {
          const parsedImages = Array.isArray(data.images) ? data.images : parseJsonField(data.images);
          initialImages.push(...parsedImages);
        }
        setImages(Array.from(new Set(initialImages.filter(Boolean))));

        const galleryResponse = await fetch(`/api/gallery/${type}/${id}`);
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json();
          const galleryImages = galleryData.map((entry: any) => entry.image_url).filter(Boolean);
          setImages((prev) => Array.from(new Set([...prev, ...galleryImages])));
        }
      } catch (fetchError) {
        console.error('Portfolio detail error:', fetchError);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [type, id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  const hasItinerary = !['accommodation', 'flight', 'car'].includes(type || item?.type || '');

  useEffect(() => {
    if (!hasItinerary && activeTab === 'itinerary') {
      setActiveTab('overview');
    }
  }, [hasItinerary, activeTab]);

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Booking submitted:', { ...bookingData, itemId: id, itemType: type, itemTitle: item?.title });
    alert('Booking request sent successfully! We will contact you soon.');
    setShowBookingForm(false);
    setBookingData({
      name: '',
      email: '',
      phone: '',
      from: 'Kigali',
      to: '',
      departureDate: '',
      returnDate: '',
      travelDate: '',
      travelers: 1,
      flightClass: 'Economy',
      airline: '',
      specialRequests: '',
    });
  };

  const backPath = `/portfolio?tab=${getTabForType(type || '')}`;
  const backText = type ? `Back to ${type.charAt(0).toUpperCase() + type.slice(1)}` : 'Back to Portfolio';
  const displayImages = images.length > 0 ? images : [item?.image || '/placeholder.jpg'];
  const isFlightType = type === 'flight';
  const flightAirlines = [
    { name: 'RwandAir', code: 'WB' },
    { name: 'Kenya Airways', code: 'KQ' },
    { name: 'Ethiopian Airlines', code: 'ET' },
    { name: 'Qatar Airways', code: 'QR' },
    { name: 'Turkish Airlines', code: 'TK' },
    { name: 'KLM Royal Dutch Airlines', code: 'KL' },
    { name: 'FlyDubai', code: 'FZ' },
    { name: 'Air Tanzania', code: 'TC' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24">
        <div className="inline-block w-8 h-8 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Item not found</h2>
          <p className="text-gray-600 mb-8">We could not load the requested experience. Please return to the portfolio and choose another option.</p>
          <button
            onClick={() => navigate(backPath)}
            className="bg-[#2f8eb2] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1f6f95] transition-colors"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  if (isFlightType) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2f8eb2] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {backText}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <main className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Booking</h1>
                <p className="text-gray-600">Select your airline and fill the flight form for Rwanda departures. Click an airline on the right to prefill the airline field and start the booking process immediately.</p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Flight</h2>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">From</span>
                      <input
                        type="text"
                        placeholder="Kigali"
                        value={bookingData.from}
                        onChange={(e) => setBookingData({ ...bookingData, from: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">To</span>
                      <input
                        type="text"
                        placeholder="Destination"
                        value={bookingData.to}
                        onChange={(e) => setBookingData({ ...bookingData, to: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Departure Date</span>
                      <input
                        type="date"
                        value={bookingData.departureDate}
                        onChange={(e) => setBookingData({ ...bookingData, departureDate: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Return Date</span>
                      <input
                        type="date"
                        value={bookingData.returnDate}
                        onChange={(e) => setBookingData({ ...bookingData, returnDate: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Travelers</span>
                      <select
                        value={bookingData.travelers}
                        onChange={(e) => setBookingData({ ...bookingData, travelers: Number(e.target.value) })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Class</span>
                      <select
                        value={bookingData.flightClass}
                        onChange={(e) => setBookingData({ ...bookingData, flightClass: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      >
                        {['Economy', 'Premium Economy', 'Business', 'First'].map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Airline</span>
                      <input
                        type="text"
                        placeholder="Choose airline from the list"
                        value={bookingData.airline}
                        readOnly
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Full Name</span>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        required
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Email</span>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        required
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-gray-700">Phone</span>
                    <input
                      type="tel"
                      placeholder="+250 788 123 456"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      required
                      className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Special Requests</span>
                    <textarea
                      rows={4}
                      placeholder="Any special requirements"
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                      className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                    />
                  </label>

                  <button type="submit" className="w-full bg-[#2f8eb2] text-white py-3 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors">
                    Submit Flight Request
                  </button>
                </form>
              </div>
            </main>

            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Airlines Operating in Rwanda</h2>
                <p className="text-gray-600 mb-6">Select any airline to prefill the booking form. This will launch the form on the left with the chosen carrier.</p>
                <div className="space-y-4">
                  {flightAirlines.map((airline) => (
                    <button
                      type="button"
                      key={airline.code}
                      onClick={() => setBookingData({ ...bookingData, airline: airline.name })}
                      className="w-full text-left rounded-2xl border border-gray-200 px-5 py-4 hover:border-[#2f8eb2] hover:bg-[#eff6ff] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{airline.name}</p>
                          <p className="text-sm text-gray-600">Airline code: {airline.code}</p>
                        </div>
                        <span className="rounded-full bg-[#2f8eb2] px-3 py-1 text-sm text-white">Select</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Need help?</h3>
                <p className="text-gray-600 mb-4">Our team can help you choose the best airline and ticket option for Rwanda travel.</p>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#2f8eb2]" /><span>+250 788 123 456</span></div>
                  <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#2f8eb2]" /><span>info@paramountadventures.com</span></div>
                </div>
              </div>
            </aside>
          </div>
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
            <div className="lg:col-span-2">
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(displayImages[selectedImage] || item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {displayImages.length > 1 && (
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
                      {displayImages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
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

            <div className="bg-gray-50 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4 text-[#2f8eb2]" />
                <span>{item.location || 'Location not specified'}</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{item.duration || 'TBA'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Best Time</span>
                  <span className="font-semibold">{item.bestTime || 'Anytime'}</span>
                </div>
              </div>
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-[#2f8eb2] text-white py-3 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors mb-3"
              >
                Book This Experience
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
              ...(hasItinerary ? [{ id: 'itinerary', label: 'Itinerary' }] : []),
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
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                  <p className="text-gray-600 leading-relaxed">{item.longDescription || item.description}</p>
                </div>

                {item.highlights?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.highlights.map((highlight: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-[#2f8eb2]" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.importantInfo?.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <h4 className="font-bold text-gray-900 mb-2">Important Information</h4>
                    <ul className="space-y-1">
                      {item.importantInfo.map((info: string, idx: number) => (
                        <li key={idx} className="text-gray-600 text-sm">• {info}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Itinerary</h2>
                {item.itinerary && item.itinerary.length > 0 ? (
                  item.itinerary.map((step: any, index: number) => {
                    const title = typeof step === 'object' ? step.title || step.day || `Day ${index + 1}` : `Day ${index + 1}`;
                    const description = typeof step === 'object' ? step.description || step.details || step.content : step;
                    return (
                      <div key={index} className="border-l-4 border-[#2f8eb2] pl-6 pb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-5 h-5 text-[#2f8eb2]" />
                          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-3">{description}</p>
                        {typeof step === 'object' && step.overnight && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Overnight:</span> {step.overnight}
                          </p>
                        )}
                        {typeof step === 'object' && step.meals && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Meals:</span> {step.meals}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-600">No itinerary details available for this experience.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'included' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-6 h-6 text-green-600" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {item.included?.length > 0 ? (
                      item.included.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-600">No included items listed for this experience.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <XIcon className="w-6 h-6 text-red-600" />
                    Excluded
                  </h3>
                  <ul className="space-y-2">
                    {item.excluded?.length > 0 ? (
                      item.excluded.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <XIcon className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-600">No excluded items listed for this experience.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Map</h2>
                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Map coming soon</p>
                    <p className="text-sm text-gray-400 mt-2">Contact us for exact location details.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Quick Contact</h3>
              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#2f8eb2]" /><span>+250 788 123 456</span></div>
                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#2f8eb2]" /><span>info@paramountadventures.com</span></div>
              </div>
              <button
                onClick={() => window.open('https://wa.me/250788123456', '_blank')}
                className="w-full bg-[#2f8eb2] text-white py-2 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">Book This Experience</h3>
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
                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email *"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
              />
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.travelDate}
                onChange={(e) => setBookingData({ ...bookingData, travelDate: e.target.value })}
              />
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.travelers}
                onChange={(e) => setBookingData({ ...bookingData, travelers: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Special Requests"
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
              />
              <button
                type="submit"
                className="w-full bg-[#2f8eb2] text-white py-3 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors"
              >
                Submit Booking Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
