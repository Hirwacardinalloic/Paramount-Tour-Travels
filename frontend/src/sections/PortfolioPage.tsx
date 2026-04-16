import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, Car, 
  Briefcase, Filter, Plane, Hotel, Compass, Mail
} from 'lucide-react';

interface Destination {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string;
  price: string;
  duration: string;
  bestTime: string;
  activities: string[];
  category: string;
  status: string;
  type: 'destination';
}

interface Flight {
  id: number;
  title: string;
  description: string;
  from: string;
  to: string;
  image: string;
  price: string;
  departureDate: string;
  returnDate: string;
  airline: string;
  duration: string;
  type: 'flight';
  status: string;
}

interface Accommodation {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string;
  price: string;
  rating: number;
  amenities: string[];
  roomType: string;
  type: 'accommodation';
  status: string;
}

interface Car {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  model: string;
  year: number;
  transmission: string;
  fuel: string;
  seats: number;
  features: string[];
  type: 'car';
  status: string;
}

type PortfolioItem = Destination | Flight | Accommodation | Car;

export default function PortfolioPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const validTabs = ['all', 'destination', 'flight', 'accommodation', 'car'];
  const normalizeTab = (tab: string | null) => {
    const value = (tab || 'all').trim().toLowerCase();
    if (['destinations', 'destination'].includes(value)) return 'destination';
    if (['flights', 'flight'].includes(value)) return 'flight';
    if (['accommodations', 'accommodation'].includes(value)) return 'accommodation';
    if (['cars', 'car'].includes(value)) return 'car';
    return validTabs.includes(value) ? value : 'all';
  };

  const parseFlightRoute = (route: string = ''): [string, string] => {
    const normalized = route.trim();
    if (!normalized) return ['', ''];
    if (normalized.includes(' - ')) return normalized.split(' - ').map((part) => part.trim()) as [string, string];
    if (/\bto\b/i.test(normalized)) return normalized.split(/\bto\b/i).map((part) => part.trim()) as [string, string];
    return [normalized, ''];
  };

  const [activeTab, setActiveTab] = useState(() => normalizeTab(searchParams.get('tab')));

  const changeTab = (tab: string) => {
    const normalized = normalizeTab(tab);
    setActiveTab(normalized);
    navigate(`/portfolio?tab=${normalized}`);
  };

  // Fetch Destinations
  const { data: destinations = [], isLoading: isDestinationsLoading, isError: isDestinationsError, error: destinationsError } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const response = await fetch('/api/destinations');
      const data = await response.json();
      return data
        .filter((d: any) => d.status === 'active')
        .map((d: any) => ({
          ...d,
          type: 'destination',
          title: d.title || d.name || 'Untitled destination',
          price: d.price || d.pricePerNight || '',
          location: d.location || '',
          duration: d.duration || '',
          bestTime: d.bestTime || d.bestSeason || '',
          activities: d.activities
            ? Array.isArray(d.activities)
              ? d.activities
              : [d.activities]
            : [],
        }));
    },
  });

  // Fetch Flights
  const { data: flights = [], isLoading: isFlightsLoading, isError: isFlightsError, error: flightsError } = useQuery<Flight[]>({
    queryKey: ['flights'],
    queryFn: async () => {
      const response = await fetch('/api/flights');
      const data = await response.json();
      return data
        .filter((f: any) => f.status === 'active')
        .map((f: any) => {
          const [from, to] = parseFlightRoute(f.route || '');
          return {
            ...f,
            type: 'flight',
            title: f.title || `${f.airline || ''} ${f.route || ''}`.trim() || 'Flight',
            price: f.price || '',
            from,
            to,
            airline: f.airline || '',
            duration: f.duration || '',
            departureDate: f.departureDate || '',
            returnDate: f.returnDate || '',
          };
        });
    },
  });

  // Fetch Accommodations
  const { data: accommodations = [], isLoading: isAccommodationsLoading, isError: isAccommodationsError, error: accommodationsError } = useQuery({
    queryKey: ['accommodations'],
    queryFn: async () => {
      const response = await fetch('/api/accommodations');
      const data = await response.json();
      return data
        .filter((a: any) => a.status === 'active')
        .map((a: any) => ({
          ...a,
          type: 'accommodation',
          title: a.title || a.name || 'Accommodation',
          price: a.price || a.pricePerNight || '',
          roomType: a.type || '',
          rating: a.rating || 0,
          amenities: a.amenities
            ? Array.isArray(a.amenities)
              ? a.amenities
              : a.amenities.split(',').map((value: string) => value.trim())
            : [],
        }));
    },
  });

  // Fetch Cars
  const { data: cars = [], isLoading: isCarsLoading, isError: isCarsError, error: carsError } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await fetch('/api/cars');
      const data = await response.json();
      return data
        .filter((c: any) => ['available', 'active'].includes(c.status))
        .map((c: any) => ({
          ...c,
          type: 'car',
          title: c.title || 'Car rental',
          price: c.price || '',
        }));
    },
  });

  const allWorks = [...destinations, ...flights, ...accommodations, ...cars];

  const isLoading = isDestinationsLoading || isFlightsLoading || isAccommodationsLoading || isCarsLoading;
  const isError = isDestinationsError || isFlightsError || isAccommodationsError || isCarsError;

  const errorMessage =
    destinationsError?.message ||
    flightsError?.message ||
    accommodationsError?.message ||
    carsError?.message ||
    null;

  useEffect(() => {
    setActiveTab(normalizeTab(searchParams.get('tab')));
  }, [searchParams]);

  const filteredWorks = activeTab === 'all' 
    ? allWorks 
    : allWorks.filter(item => item.type === activeTab);

  const [flightSearch, setFlightSearch] = useState({
    tripType: 'Roundtrip',
    firstName: '',
    surname: '',
    email: '',
    phone: '',
    flyingFrom: 'Kigali',
    flyingTo: '',
    departing: '',
    returning: '',
    infant: 0,
    child: 0,
    youth: 0,
    adults: 1,
    travelClass: 'Economy',
    airline: '',
  });

  const airlineOptions = Array.from(
    new Set(flights.map((flight: Flight) => flight.airline || '').filter(Boolean))
  ).map((name) => {
    const airlineName = String(name);
    return {
      name: airlineName,
      code: airlineName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 3)
        .toUpperCase(),
    };
  });

  const availableAirlines = [{ name: 'Any cheap flight', code: 'CHEAP' }].concat(
    airlineOptions.length > 0 ? airlineOptions : [
      { name: 'RwandAir', code: 'WB' },
      { name: 'Kenya Airways', code: 'KQ' },
      { name: 'Ethiopian Airlines', code: 'ET' },
      { name: 'Qatar Airways', code: 'QR' },
      { name: 'Turkish Airlines', code: 'TK' },
      { name: 'KLM Royal Dutch Airlines', code: 'KL' },
      { name: 'FlyDubai', code: 'FZ' },
      { name: 'Air Tanzania', code: 'TC' },
    ]
  );

  const selectAirline = (airline: string) => {
    setFlightSearch((prev) => ({ ...prev, airline }));
  };

  const handleFlightSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Searching flights with airline: ${flightSearch.airline || 'Any'} from ${flightSearch.flyingFrom} to ${flightSearch.flyingTo}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24">
        <div className="inline-flex items-center gap-3 rounded-3xl bg-white p-8 shadow-lg">
          <div className="inline-block w-10 h-10 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium text-gray-700">Loading portfolio items...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unable to load items</h2>
          <p className="text-gray-600 mb-8">{errorMessage || 'Please refresh the page to retry.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#2f8eb2] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1f6f95] transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  const getImageUrl = (image: string) => {
    if (!image) return '/placeholder.jpg';
    if (image.startsWith('http')) return image;
    const cleanPath = image.replace('./', '/');
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'destination': return <Compass className="w-5 h-5" />;
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'accommodation': return <Hotel className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (type: string) => {
    switch(type) {
      case 'destination': return 'bg-emerald-600';
      case 'flight': return 'bg-blue-600';
      case 'accommodation': return 'bg-purple-600';
      case 'car': return 'bg-orange-600';
      default: return 'bg-[#2f8eb2]';
    }
  };

  const openItem = (item: PortfolioItem) => {
    navigate(`/portfolio/${item.type}/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2f8eb2] to-[#1f6f95] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Curated Experiences</h1>
          <p className="text-lg text-gray-100">Explore our curated collection of travel experiences and services</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <button
            onClick={() => changeTab('all')}
            className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-[#2f8eb2] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}
          >
            <Filter className="w-4 h-4" />
            All Projects
          </button>
          <button
            onClick={() => changeTab('destination')}
            className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all flex items-center gap-2 ${
              activeTab === 'destination'
                ? 'bg-[#2f8eb2] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}
          >
            <Compass className="w-4 h-4" />
            Destinations
          </button>
          <button
            onClick={() => changeTab('flight')}
            className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all flex items-center gap-2 ${
              activeTab === 'flight'
                ? 'bg-[#2f8eb2] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}
          >
            <Plane className="w-4 h-4" />
            Flights
          </button>
          <button
            onClick={() => changeTab('accommodation')}
            className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all flex items-center gap-2 ${
              activeTab === 'accommodation'
                ? 'bg-[#2f8eb2] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}
          >
            <Hotel className="w-4 h-4" />
            Accommodations
          </button>
          <button
            onClick={() => changeTab('car')}
            className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all flex items-center gap-2 ${
              activeTab === 'car'
                ? 'bg-[#2f8eb2] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}
          >
            <Car className="w-4 h-4" />
            Cars
          </button>
        </div>

        {/* Projects Grid */}
        {activeTab === 'flight' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Airlines in Rwanda</h3>
                <div className="grid gap-4">
                  {availableAirlines.map((airline) => {
                    const isCheapOption = airline.name === 'Any cheap flight';
                    return (
                      <button
                        key={airline.code}
                        type="button"
                        onClick={() => selectAirline(airline.name)}
                        className={`w-full text-left rounded-2xl border px-5 py-4 transition-colors ${
                          isCheapOption
                            ? 'border-[#2f8eb2] bg-[#eff6ff] hover:bg-[#d4ebf7]'
                            : 'border-gray-200 bg-white hover:border-[#2f8eb2] hover:bg-[#eff6ff]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className={`font-semibold ${isCheapOption ? 'text-[#2f8eb2]' : 'text-gray-900'}`}>{airline.name}</p>
                            <p className="text-sm text-gray-500">Code: {airline.code}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCheapOption && (
                              <span className="rounded-full bg-[#2f8eb2] px-3 py-1 text-xs font-semibold text-white">Best Price</span>
                            )}
                            <span className={`rounded-full px-3 py-1 text-sm text-white ${isCheapOption ? 'bg-black' : 'bg-[#2f8eb2]'}`}>
                              Select
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Need help choosing?</h3>
                <p className="text-gray-600 mb-4">Our team is ready to help you choose the best airline option for your Rwanda travel plans.</p>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#2f8eb2]" /><span>Rwanda-based airline support</span></div>
                  <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#2f8eb2]" /><span>info@paramountadventures.com</span></div>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Book Flights from Rwanda</h2>
                <p className="text-gray-600">Choose an airline on the left to prefill your booking form, then complete your travel details and submit.</p>
              </div>
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <form onSubmit={handleFlightSearchSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Roundtrip', 'One way', 'Multi-City'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFlightSearch((prev) => ({
                          ...prev,
                          tripType: option,
                          returning: option === 'One way' ? '' : prev.returning,
                        }))}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          flightSearch.tripType === option ? 'border-[#2f8eb2] bg-[#eff6ff] text-[#2f8eb2]' : 'border-gray-200 bg-white text-gray-700 hover:border-[#2f8eb2]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Firstname</span>
                      <input
                        type="text"
                        value={flightSearch.firstName}
                        onChange={(e) => setFlightSearch({ ...flightSearch, firstName: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Surname</span>
                      <input
                        type="text"
                        value={flightSearch.surname}
                        onChange={(e) => setFlightSearch({ ...flightSearch, surname: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Email</span>
                      <input
                        type="email"
                        value={flightSearch.email}
                        onChange={(e) => setFlightSearch({ ...flightSearch, email: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Phone Number</span>
                      <input
                        type="tel"
                        value={flightSearch.phone}
                        onChange={(e) => setFlightSearch({ ...flightSearch, phone: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Flying from</span>
                      <input
                        type="text"
                        value={flightSearch.flyingFrom}
                        onChange={(e) => setFlightSearch({ ...flightSearch, flyingFrom: e.target.value })}
                        placeholder="City or airport"
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Flying to</span>
                      <input
                        type="text"
                        value={flightSearch.flyingTo}
                        onChange={(e) => setFlightSearch({ ...flightSearch, flyingTo: e.target.value })}
                        placeholder="City or airport"
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Departing</span>
                      <input
                        type="date"
                        value={flightSearch.departing}
                        onChange={(e) => setFlightSearch({ ...flightSearch, departing: e.target.value })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    {flightSearch.tripType !== 'One way' && (
                      <label className="block">
                        <span className="text-gray-700">Returning</span>
                        <input
                          type="date"
                          value={flightSearch.returning}
                          onChange={(e) => setFlightSearch({ ...flightSearch, returning: e.target.value })}
                          className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                        />
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Infant (0-2)</span>
                      <input
                        type="number"
                        min={0}
                        value={flightSearch.infant}
                        onChange={(e) => setFlightSearch({ ...flightSearch, infant: Number(e.target.value) })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Child (3-11)</span>
                      <input
                        type="number"
                        min={0}
                        value={flightSearch.child}
                        onChange={(e) => setFlightSearch({ ...flightSearch, child: Number(e.target.value) })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Youth (12-18)</span>
                      <input
                        type="number"
                        min={0}
                        value={flightSearch.youth}
                        onChange={(e) => setFlightSearch({ ...flightSearch, youth: Number(e.target.value) })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Adults (+18)</span>
                      <input
                        type="number"
                        min={1}
                        value={flightSearch.adults}
                        onChange={(e) => setFlightSearch({ ...flightSearch, adults: Number(e.target.value) })}
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Travel class</span>
                      <select
                        value={flightSearch.travelClass}
                        onChange={(e) => setFlightSearch({ ...flightSearch, travelClass: e.target.value })}
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
                        value={flightSearch.airline}
                        readOnly
                        placeholder="Choose an airline"
                        className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#2f8eb2]"
                      />
                    </label>
                  </div>

                  <button type="submit" className="w-full bg-[#2f8eb2] text-white py-3 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors">
                    BOOK Flight
                  </button>
                </form>
              </div>
            </main>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Compass className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map((item, index) => (
              <div
                key={`${item.type}-${item.id}-${index}`}
                onClick={() => openItem(item)}
                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 ${getCategoryColor(item.type)} text-white text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-1`}>
                      {getIcon(item.type)}
                      <span>{item.type}</span>
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-white font-bold text-sm">{item.price}</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#2f8eb2] transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {'location' in item ? item.location : item.from && item.to ? `${item.from} → ${item.to}` : 'Rwanda'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
