import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  ChevronLeft,
  Phone,
  Mail,
  MessageCircle,
  Plane,
  Hotel,
  Car as CarIcon,
  Compass,
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
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included' | 'map'>('overview');
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    travelers: 2,
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
          image: data.image || '',
          price: data.price || data.pricePerNight || 'Contact us',
          location: data.location || data.route || data.category || '',
          duration: data.duration || data.flightClass || '',
          bestTime: data.bestTime || data.bestSeason || '',
          itinerary: parseJsonField(data.itinerary),
          activities: parseJsonField(data.activities),
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
        setImages([normalized.image].filter(Boolean));

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

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Booking submitted:', { ...bookingData, itemId: id, itemType: type, itemTitle: item?.title });
    alert('Booking request sent successfully! We will contact you soon.');
    setShowBookingForm(false);
    setBookingData({ name: '', email: '', phone: '', travelDate: '', travelers: 2, specialRequests: '' });
  };

  const backPath = `/portfolio?tab=${getTabForType(type || '')}`;

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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#2f8eb2] transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to portfolio
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-gray-200 rounded-3xl p-6 lg:p-8">
          <div className="lg:col-span-2">
            <div className="relative h-96 lg:h-[520px] rounded-3xl overflow-hidden bg-gray-100">
              <img
                src={getImageUrl(images[selectedImage] || item.image)}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`h-2 rounded-full transition-all ${selectedImage === index ? 'w-8 bg-[#2f8eb2]' : 'w-2 bg-white/70'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#2f8eb2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <Compass className="w-4 h-4" />
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Experience'}
            </span>
            <h1 className="mt-5 text-4xl font-bold text-gray-900 leading-tight">{item.title}</h1>
            <p className="mt-4 text-gray-600 leading-relaxed">{item.description}</p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-white p-5 border border-gray-200">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-[#2f8eb2]" />
                  <span>{item.location || 'Location not specified'}</span>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-5 border border-gray-200">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Price</span>
                  <strong className="text-gray-900">{typeof item.price === 'number' ? `$${item.price}` : item.price}</strong>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-5 border border-gray-200">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Duration</span>
                  <strong className="text-gray-900">{item.duration || 'TBA'}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setShowBookingForm(true)}
                className="rounded-full bg-[#2f8eb2] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1f6f95] transition-colors"
              >
                Book This Experience
              </button>
              <button
                onClick={() => window.location.href = 'mailto:info@paramountadventures.com'}
                className="rounded-full border border-[#2f8eb2] px-6 py-3 text-sm font-semibold text-[#2f8eb2] hover:bg-[#2f8eb2] hover:text-white transition-colors"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm mt-8">
          <div className="flex gap-8 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'itinerary', label: 'Itinerary' },
              { id: 'included', label: 'Included/Excluded' },
              { id: 'map', label: 'Map' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 font-semibold transition-colors border-b-2 ${activeTab === tab.id ? 'border-[#2f8eb2] text-[#2f8eb2]' : 'border-transparent text-gray-600 hover:text-[#2f8eb2]'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900">Experience Overview</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">{item.description}</p>
                  </div>

                  {item.activities?.length > 0 && (
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900">Highlights</h2>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {item.activities.map((activity: string, index: number) => (
                          <div key={index} className="rounded-3xl bg-gray-50 p-4 text-gray-700">{activity}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-8">
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
                    <div className="mt-6 space-y-6 text-gray-600">
                      {item.itinerary && item.itinerary.length > 0 ? (
                        item.itinerary.map((step: any, index: number) => (
                          <div key={index} className="rounded-3xl bg-gray-50 p-5">
                            {typeof step === 'object' ? (
                              <>
                                <h3 className="font-semibold text-gray-900">{step.title || step.day || `Step ${index + 1}`}</h3>
                                <p className="mt-2 text-sm leading-relaxed">{step.description || step.details || step.content}</p>
                              </>
                            ) : (
                              <p>{step}</p>
                            )}
                          </div>
                        ))
                      ) : item.activities && item.activities.length > 0 ? (
                        item.activities.map((activity: string, index: number) => (
                          <div key={index} className="rounded-3xl bg-gray-50 p-5">
                            <p>{activity}</p>
                          </div>
                        ))
                      ) : (
                        <p>No itinerary details available for this experience.</p>
                      )}
                    </div>
                  </div>

                  {(type === 'destination' || type === 'tourism') && item.activities?.length > 0 && (
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900">Highlights</h2>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {item.activities.map((activity: string, index: number) => (
                          <div key={index} className="rounded-3xl bg-gray-50 p-4 text-gray-700">{activity}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {type === 'accommodation' && (
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900">Accommodation Details</h2>
                      <div className="mt-6 grid gap-4 md:grid-cols-2 text-gray-600">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3"><Hotel className="w-5 h-5 text-[#2f8eb2]" /><span>{item.roomType || 'Room type not listed'}</span></div>
                          <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#2f8eb2]" /><span>{item.location || 'Location unknown'}</span></div>
                          <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-[#2f8eb2]" /><span>{item.duration || 'No duration info'}</span></div>
                        </div>
                        {item.amenities?.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.amenities.map((amenity: string, index: number) => (
                                <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">{amenity}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {type === 'flight' && (
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900">Flight Details</h2>
                      <div className="mt-6 grid gap-4 text-gray-600">
                        <div className="flex items-center gap-3"><Plane className="w-5 h-5 text-[#2f8eb2]" /><span>{item.airline || 'Airline not specified'}</span></div>
                        <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#2f8eb2]" /><span>{item.route || 'Route unknown'}</span></div>
                        <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-[#2f8eb2]" /><span>{item.departureDate || 'Departure date TBD'}</span></div>
                      </div>
                    </div>
                  )}

                  {type === 'car' && (
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900">Car Details</h2>
                      <div className="mt-6 grid gap-4 text-gray-600">
                        <div className="flex items-center gap-3"><CarIcon className="w-5 h-5 text-[#2f8eb2]" /><span>{item.model || 'Model unknown'}</span></div>
                        <div className="flex items-center gap-3"><Users className="w-5 h-5 text-[#2f8eb2]" /><span>{item.seats ? `${item.seats} seats` : 'Seat count unavailable'}</span></div>
                        <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#2f8eb2]" /><span>{item.transmission || 'Transmission info unavailable'}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'included' && (
                <div className="space-y-8">
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900">Included</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {item.included && item.included.length > 0 ? (
                        item.included.map((feature: string, index: number) => (
                          <div key={index} className="rounded-3xl bg-gray-50 p-4 text-gray-700">{feature}</div>
                        ))
                      ) : (
                        <p className="text-gray-600">No included items listed for this experience.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900">Excluded</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {item.excluded && item.excluded.length > 0 ? (
                        item.excluded.map((feature: string, index: number) => (
                          <div key={index} className="rounded-3xl bg-gray-50 p-4 text-gray-700">{feature}</div>
                        ))
                      ) : (
                        <p className="text-gray-600">No excluded items listed for this experience.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Map</h2>
                  <div className="mt-6 bg-gray-200 rounded-3xl h-96 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500">Map coming soon</p>
                      <p className="text-sm text-gray-400 mt-2">Contact us for exact location details.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Contact</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-[#2f8eb2]" /><span>+250 788 123 456</span></div>
                  <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-[#2f8eb2]" /><span>info@paramountadventures.com</span></div>
                  <button onClick={() => window.open('https://wa.me/250788123456', '_blank')} className="inline-flex items-center gap-2 text-[#2f8eb2] hover:text-[#1f6f95]"><MessageCircle className="w-5 h-5" />WhatsApp Us</button>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Pricing</h3>
                <p className="text-4xl font-bold text-[#2f8eb2]">{typeof item.price === 'number' ? `$${item.price}` : item.price}</p>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="mt-6 w-full rounded-full bg-[#2f8eb2] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1f6f95] transition-colors"
                >
                  Book Now
                </button>
              </div>

              {(type === 'accommodation' || type === 'car') && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Additional Info</h3>
                  <div className="space-y-3 text-gray-600">
                    {type === 'accommodation' && <p>Room type: {item.roomType || 'N/A'}</p>}
                    {type === 'accommodation' && <p>Rating: {item.rating || 'N/A'}</p>}
                    {type === 'car' && <p>Fuel: {item.fuel || 'N/A'}</p>}
                    {type === 'car' && <p>Transmission: {item.transmission || 'N/A'}</p>}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold">Book This Experience</h3>
                <button onClick={() => setShowBookingForm(false)} className="p-1 hover:bg-gray-100 rounded"><XIcon className="w-5 h-5" /></button>
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
    </div>
  );
}
