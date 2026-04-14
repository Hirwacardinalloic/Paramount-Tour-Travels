import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, Car, 
  Briefcase, Filter, Plane, Hotel, Compass
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
    const value = tab || 'all';
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
  const { data: destinations = [] } = useQuery({
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
  const { data: flights = [] } = useQuery({
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
  const { data: accommodations = [] } = useQuery({
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
  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await fetch('/api/cars');
      const data = await response.json();
      return data.filter((c: any) => c.status === 'available').map((c: any) => ({
        ...c,
        type: 'car',
        title: c.title || 'Car rental',
        price: c.price || '',
      }));
    },
  });

  const allWorks = [...destinations, ...flights, ...accommodations, ...cars];

  useEffect(() => {
    const tab = normalizeTab(searchParams.get('tab'));
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  const filteredWorks = activeTab === 'all' 
    ? allWorks 
    : allWorks.filter(item => item.type === activeTab);

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
        {filteredWorks.length === 0 ? (
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
