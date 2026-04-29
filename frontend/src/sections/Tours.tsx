import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
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

export default function Tours() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const toursPerPage = 9;

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
        
        setTours(transformedTours);
        setFilteredTours(transformedTours);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

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
  }, [searchTerm, selectedCategory, selectedDuration, tours]);

  // Pagination
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * toursPerPage,
    currentPage * toursPerPage
  );

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2f8eb2] to-[#1f6f95] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Tours & Safaris</h1>
          <p className="text-lg text-gray-100">Explore Rwanda's most incredible destinations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {/* Search */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Search</label>
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2f8eb2]"
                />
              </div>

              {/* Categories */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Categories</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={selectedCategory === category.value}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-[#2f8eb2]"
                      />
                      <span className="ml-3 text-gray-700">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Duration</label>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <label key={duration.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="duration"
                        value={duration.value}
                        checked={selectedDuration === duration.value}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="w-4 h-4 text-[#2f8eb2]"
                      />
                      <span className="ml-3 text-gray-700">{duration.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : paginatedTours.length > 0 ? (
              <>
                {/* Tours Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => navigate(`/tour/${tour.id}`)}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={tour.images[0]}
                          alt={tour.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{tour.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{tour.location}</p>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#2f8eb2]" />
                            <span>{tour.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#2f8eb2]" />
                            <span>{tour.groupSize || 'Group size varies'}</span>
                          </div>
                        </div>

                        {tour.country && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/destinations/${tour.country}`);
                            }}
                            className="w-full border border-[#2f8eb2] text-[#2f8eb2] py-2 rounded-lg text-sm font-semibold hover:bg-[#2f8eb2] hover:text-white transition-colors"
                          >
                            View all {tour.country.charAt(0).toUpperCase() + tour.country.slice(1)} tours
                          </button>
                        )}

                        <button className="w-full bg-[#2f8eb2] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#1f6f95] transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg font-semibold border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-[#2f8eb2] text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-[#2f8eb2]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg font-semibold border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No tours found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
