import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Clock, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Tour } from '../data/tours';
import { getCountryFromLocation } from '../lib/utils';

const categories = [
  { label: 'All Tours', value: 'all' },
  { label: 'Gorilla Trekking', value: 'gorilla' },
  { label: 'Wildlife Safari', value: 'wildlife' },
  { label: 'Cultural Tours', value: 'cultural' },
  { label: 'Adventure', value: 'adventure' },
];

const durations = [
  { label: 'All Durations', value: 'all' },
  { label: '1 Day', value: '1' },
  { label: '2 Days', value: '2' },
  { label: '3-4 Days', value: '3-4' },
  { label: '5+ Days', value: '5+' },
];

const destinationInfo = {
  rwanda: {
    name: 'Rwanda',
    description: 'Experience the Land of a Thousand Hills with gorilla trekking, wildlife safaris, and vibrant culture.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80',
    highlights: [
      'Mountain Gorilla Trekking',
      'Akagera National Park',
      'Kigali City Tours',
      'Volcanoes National Park',
      'Nyungwe Forest'
    ]
  },
  uganda: {
    name: 'Uganda',
    description: 'Discover the Pearl of Africa with chimpanzee tracking, Nile River adventures, and diverse wildlife.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    highlights: [
      'Chimpanzee Tracking',
      'Murchison Falls',
      'Bwindi Impenetrable Forest',
      'Queen Elizabeth National Park',
      'Source of the Nile'
    ]
  },
  kenya: {
    name: 'Kenya',
    description: 'Explore the cradle of humanity with Maasai culture, big five safaris, and stunning landscapes.',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80',
    highlights: [
      'Maasai Mara Safaris',
      'Amboseli National Park',
      'Tsavo National Park',
      'Mount Kenya',
      'Coastal Beaches'
    ]
  },
  tanzania: {
    name: 'Tanzania',
    description: 'Witness the Great Migration, climb Mount Kilimanjaro, and experience the Serengeti plains.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    highlights: [
      'Serengeti Great Migration',
      'Mount Kilimanjaro',
      'Ngorongoro Crater',
      'Zanzibar Islands',
      'Lake Manyara'
    ]
  }
};

export default function DestinationTours() {
  const navigate = useNavigate();
  const { country } = useParams<{ country: string }>();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<Record<string, number>>({});
  const toursPerPage = 12;

  const handleImageNav = (tourId: string, direction: 'prev' | 'next') => {
    setSelectedImageIndex((prev) => {
      const currentIndex = prev[tourId] ?? 0;
      const tour = tours.find((item) => item.id === tourId);
      const count = tour?.images?.length || 0;
      if (!count) return prev;
      const nextIndex = direction === 'next'
        ? (currentIndex + 1) % count
        : (currentIndex - 1 + count) % count;
      return { ...prev, [tourId]: nextIndex };
    });
  };

  const destination = country ? destinationInfo[country as keyof typeof destinationInfo] : null;

  // Fetch tours from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tourism?status=active');
        const data = await response.json();

        // Transform API data to match Tour interface
        const transformedTours: Tour[] = data.map((item: any) => ({
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
          bestTime: item.bestTime || '',
          country: getCountryFromLocation(item.location || item.name || item.description)
        }));

        // Filter tours by destination/country
        let filteredByDestination = transformedTours;
        if (country) {
          const filteredCountry = country.toLowerCase();
          filteredByDestination = transformedTours.filter((tour) => {
            if (tour.country === filteredCountry) return true;

            const countryName = destination?.name || country.charAt(0).toUpperCase() + country.slice(1);
            return (
              tour.location.toLowerCase().includes(countryName.toLowerCase()) ||
              tour.name.toLowerCase().includes(countryName.toLowerCase()) ||
              tour.description.toLowerCase().includes(countryName.toLowerCase())
            );
          });
        }

        setTours(filteredByDestination);
        setFilteredTours(filteredByDestination);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [country]);

  // Filter tours based on criteria
  useEffect(() => {
    let filtered = tours.filter((tour) => {
      const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tour.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;

      // Duration filter logic
      let matchesDuration = true;
      if (selectedDuration !== 'all') {
        const days = parseInt(tour.duration);
        if (selectedDuration === '1') matchesDuration = days === 1;
        else if (selectedDuration === '2') matchesDuration = days === 2;
        else if (selectedDuration === '3-4') matchesDuration = days >= 3 && days <= 4;
        else if (selectedDuration === '5+') matchesDuration = days >= 5;
      }

      return matchesSearch && matchesCategory && matchesDuration;
    });

    setFilteredTours(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDuration]);

  // Pagination
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * toursPerPage,
    currentPage * toursPerPage
  );

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-[#2f8eb2] text-white px-6 py-2 rounded-lg hover:bg-[#1f6f95] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={destination?.image}
          alt={destination?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors mx-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {destination?.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {destination?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Highlights */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Why Visit {destination?.name}?
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {destination?.highlights.map((highlight, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#2f8eb2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{highlight}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Search Tours</label>
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent"
              >
                {durations.map(duration => (
                  <option key={duration.value} value={duration.value}>{duration.label}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Tours Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Available Tours in {destination?.name}
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTours.length > 0 ? (
            <>
              {/* Tours Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {paginatedTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/tour/${tour.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={tour.images?.[selectedImageIndex[tour.id] ?? 0] || tour.images?.[0] || '/placeholder.jpg'}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {tour.images && tour.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageNav(tour.id, 'prev');
                            }}
                            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black transition"
                            aria-label={`Previous photo for ${tour.name}`}
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageNav(tour.id, 'next');
                            }}
                            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black transition"
                            aria-label={`Next photo for ${tour.name}`}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#2f8eb2] transition-colors">
                        {tour.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {tour.description}
                      </p>

                      {/* Tour Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-[#2f8eb2]" />
                          <span className="text-sm">{tour.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-[#2f8eb2]" />
                          <span className="text-sm">{tour.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-[#2f8eb2]" />
                          <span className="text-sm">{tour.groupSize}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className="w-full bg-[#2f8eb2] text-white py-3 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                        View Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-6 py-3 border rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-[#2f8eb2] text-white border-[#2f8eb2]'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No tours found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDuration('all');
                }}
                className="bg-[#2f8eb2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1f6f95] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
