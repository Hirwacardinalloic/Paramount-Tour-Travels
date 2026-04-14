import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Calendar, MapPin, X, Users, Clock, Car, Star, Briefcase, Mountain, ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [selectedTourism, setSelectedTourism] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Gallery states
  const [galleryImages, setGalleryImages] = useState<{[key: string]: string[]}>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Auto-play effect when modal opens
  useEffect(() => {
    if (selectedCar || selectedTourism) {
      // Clear any existing interval
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
      
      // Set new interval for auto-play (4 seconds)
      const interval = setInterval(() => {
        if (selectedCar) {
          const key = `car-${selectedCar.id}`;
          if (galleryImages[key]?.length > 1) {
            setCurrentImageIndex(prev => ({
              ...prev,
              [key]: ((prev[key] || 0) + 1) % galleryImages[key].length
            }));
          }
        } else if (selectedTourism) {
          const key = `tourism-${selectedTourism.id}`;
          if (galleryImages[key]?.length > 1) {
            setCurrentImageIndex(prev => ({
              ...prev,
              [key]: ((prev[key] || 0) + 1) % galleryImages[key].length
            }));
          }
        }
      }, 4000);
      
      setAutoPlayInterval(interval);
    }
    
    // Cleanup on modal close
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [selectedCar, selectedTourism, galleryImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch cars with React Query
  const { data: cars = [], refetch: refetchCars } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await fetch('/api/cars');
      const data = await response.json();
      const activeCars = data.filter((c: any) => c.status === 'available');
      return removeDuplicates(activeCars, 'title');
    },
  });

  // Fetch tourism with React Query
  const { data: tourism = [], refetch: refetchTourism } = useQuery({
    queryKey: ['tourism'],
    queryFn: async () => {
      const response = await fetch('/api/tourism');
      const data = await response.json();
      const activeTourism = data.filter((t: any) => t.status === 'active');
      return removeDuplicates(activeTourism, 'title');
    },
  });

  // Fetch destinations with React Query
  const { data: destinations = [], refetch: refetchDestinations } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const response = await fetch('/api/destinations');
      const data = await response.json();
      const activeDestinations = data.filter((d: any) => d.status === 'active');
      return removeDuplicates(activeDestinations, 'title');
    },
  });

  // Fetch gallery images for an item
  const fetchGallery = async (type: string, id: number) => {
    try {
      const response = await fetch(`/api/gallery/${type}/${id}`);
      const data = await response.json();
      const key = `${type}-${id}`;
      
      // Get all image URLs including the main image
      const mainImage = type === 'car'
        ? cars.find((c: any) => c.id === id)?.image
        : tourism.find((t: any) => t.id === id)?.image;

      let additionalImages = data.map((img: any) => img.image_url);
      
      // For tourism, also include images from the images array as fallback
      if (type === 'tourism' && additionalImages.length === 0) {
        const tour = tourism.find((t: any) => t.id === id);
        if (tour?.images) {
          try {
            const parsedImages = Array.isArray(tour.images) 
              ? tour.images 
              : JSON.parse(tour.images);
            additionalImages = parsedImages.filter((img: string) => img !== mainImage);
          } catch (error) {
            console.error('Failed to parse tourism images:', error);
          }
        }
      }

      const allImages = [
        mainImage,
        ...additionalImages
      ].filter(Boolean);

      setGalleryImages(prev => ({ ...prev, [key]: allImages }));
      setCurrentImageIndex(prev => ({ ...prev, [key]: 0 }));
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      // If gallery fetch fails, at least show main image and fallback images
      const mainImage = type === 'car'
        ? cars.find((c: any) => c.id === id)?.image
        : tourism.find((t: any) => t.id === id)?.image;
      
      let fallbackImages = [mainImage].filter(Boolean);
      
      // For tourism, try to use images from the images array
      if (type === 'tourism') {
        const tour = tourism.find((t: any) => t.id === id);
        if (tour?.images) {
          try {
            const parsedImages = Array.isArray(tour.images) 
              ? tour.images 
              : JSON.parse(tour.images);
            fallbackImages = [mainImage, ...parsedImages.filter((img: string) => img !== mainImage)].filter(Boolean);
          } catch (error) {
            console.error('Failed to parse tourism images:', error);
          }
        }
      }

      const key = `${type}-${id}`;
      setGalleryImages(prev => ({ ...prev, [key]: fallbackImages }));
      setCurrentImageIndex(prev => ({ ...prev, [key]: 0 }));
    }
  };

  // Listen for storage events (when admin makes changes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-update') {
        refetchCars();
        refetchTourism();
        refetchDestinations();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refetchCars, refetchTourism, refetchDestinations]);

  // Helper function to remove duplicates
  const removeDuplicates = (array: any[], key: string) => {
    const seen = new Set();
    return array.filter(item => {
      const duplicate = seen.has(item[key]);
      seen.add(item[key]);
      return !duplicate;
    });
  };

  // Combine all items for homepage preview
  const allWorks = [
    ...destinations.map((destination: any) => ({ ...destination, type: 'destination' })),
    ...cars.map((car: any) => ({ ...car, type: 'car' })),
    ...tourism.map((tour: any) => ({ ...tour, type: 'tourism' })),
  ];

  const filteredWorks = activeTab === 'all' 
    ? allWorks 
    : activeTab === 'cars'
    ? allWorks.filter(item => item.type === 'car')
    : allWorks.filter(item => item.type === 'tourism');

  // Handle opening items
  const openCar = (item: any) => {
    setSelectedCar(item);
    fetchGallery('car', item.id);
  };

  const openTourism = (item: any) => {
    setSelectedTourism(item);
    fetchGallery('tourism', item.id);
  };

  // Handle closing modals

  const handleCloseCar = () => {
    setSelectedCar(null);
  };

  const handleCloseTourism = () => {
    setSelectedTourism(null);
  };

  // Navigate to the full portfolio page with all categories available
  const handleViewAllWorks = () => {
    navigate('/portfolio?tab=all');
  };

  // Handle opening from All Works page (will be used by the new page)
  const handleOpenFromAllWorks = (item: any) => {
    if (item.type === 'event') {
      openEvent(item);
    } else if (item.type === 'car') {
      openCar(item);
    } else if (item.type === 'tourism') {
      openTourism(item);
    }
  };

  // Gallery navigation
  const nextImage = (key: string) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [key]: ((prev[key] || 0) + 1) % (galleryImages[key]?.length || 1)
    }));
  };

  const prevImage = (key: string) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [key]: ((prev[key] || 0) - 1 + (galleryImages[key]?.length || 1)) % (galleryImages[key]?.length || 1)
    }));
  };

  // Scroll to specific service in booking section
  const scrollToBooking = (serviceType: string) => {
    setSelectedCar(null);
    setSelectedTourism(null);
    
    // Map service type to section ID
    let targetId = '#booking';
    
    if (serviceType === 'event') {
      targetId = '#event-booking';
    } else if (serviceType === 'car') {
      targetId = '#car-booking';
    } else if (serviceType === 'tourism') {
      targetId = '#tourism-booking';
    }
    
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to main booking if specific section doesn't exist yet
      const bookingSection = document.querySelector('#booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Helper for images
  const getImageUrl = (image: string) => {
    if (!image) return '/placeholder.jpg';
    if (image.startsWith('http')) return image;
    const cleanPath = image.replace('./', '/');
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  };

  // Parse JSON fields with debugging
  const parseJsonField = (field: any) => {
    console.log('Parsing field:', field, 'type:', typeof field);
    
    if (!field) {
      console.log('Field is empty, returning []');
      return [];
    }
    
    if (Array.isArray(field)) {
      console.log('Field is already array, returning as is');
      return field;
    }
    
    try {
      const parsed = JSON.parse(field);
      console.log('Successfully parsed JSON:', parsed);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error('Failed to parse JSON:', field, error);
      // If it's a comma-separated string, split it
      if (typeof field === 'string' && field.includes(',')) {
        const split = field.split(',').map(s => s.trim());
        console.log('Split comma-separated string:', split);
        return split;
      }
      // Otherwise return as single-item array
      return [field];
    }
  };

  // Show loading if data is still being fetched
  if (cars.length === 0 && tourism.length === 0) {
    return (
      <section className="w-full py-24 bg-white">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-white"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <span className="text-[#2f8eb2] text-sm font-semibold uppercase tracking-[0.3em] mb-4 block">
              Our
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
              Curated Experiences
            </h2>
            <div className="w-20 h-1 bg-[#2f8eb2] rounded-full mt-4" />
          </div>

          <button
            onClick={handleViewAllWorks}
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-black font-semibold text-sm uppercase tracking-wider hover:text-[#2f8eb2] transition-colors"
          >
            View All Experiences
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {allWorks.slice(0, 6).map((item, index) => (
            <div
              key={`${item.type}-${item.id}-${index}`}
              onClick={() => {
                navigate(`/portfolio/${item.type}/${item.id}`);
              }}
              className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-[#2f8eb2] text-white text-xs font-semibold uppercase tracking-wider rounded">
                    {item.category || 'Experience'}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {item.location || 'Rwanda'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date || item.bestTime || 'TBA'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">
                    {item.title}
                  </h3>

                  <button className="inline-flex items-center gap-2 text-[#2f8eb2] font-semibold text-sm uppercase tracking-wider">
                    View experience
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <button
            onClick={handleViewAllWorks}
            className="inline-flex items-center gap-3 border-2 border-black text-black px-8 py-4 font-semibold text-sm uppercase tracking-wider rounded hover:bg-black hover:text-white transition-colors"
          >
            Explore All Experiences
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Car Modal */}
      {selectedCar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={handleCloseCar}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseCar}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-[#2f8eb2]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gray-100 relative">
                {/* Carousel for car images */}
                <div className="relative h-64 md:h-full">
                  <img
                    src={getImageUrl(galleryImages[`car-${selectedCar.id}`]?.[currentImageIndex[`car-${selectedCar.id}`] || 0] || selectedCar.image)}
                    alt={selectedCar.title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />

                  {/* Navigation Arrows */}
                  {galleryImages[`car-${selectedCar.id}`]?.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage(`car-${selectedCar.id}`);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#2f8eb2] transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage(`car-${selectedCar.id}`);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#2f8eb2] transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Dot Indicators */}
                  {galleryImages[`car-${selectedCar.id}`]?.length > 1 && (
                    <>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {galleryImages[`car-${selectedCar.id}`].map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => ({
                                ...prev,
                                [`car-${selectedCar.id}`]: index
                              }));
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              index === currentImageIndex[`car-${selectedCar.id}`]
                                ? 'w-3 bg-[#2f8eb2]'
                                : 'bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {currentImageIndex[`car-${selectedCar.id}`] + 1} / {galleryImages[`car-${selectedCar.id}`].length}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="md:w-1/2 p-8">
                <span className="px-3 py-1 bg-[#2f8eb2] text-white text-xs font-semibold uppercase tracking-wider rounded inline-block mb-3">
                  {selectedCar.category}
                </span>
                <h2 className="text-3xl font-bold mb-2">{selectedCar.title}</h2>
                <p className="text-[#2f8eb2] font-semibold text-xl mb-4">{selectedCar.price}</p>
                <p className="text-gray-600 mb-6">{selectedCar.description}</p>
                
                {/* Features as styled tags */}
                {selectedCar.features && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCar.features.split('•').map((feature: string, i: number) => (
                        feature.trim() && (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {feature.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-6 text-sm">
                  <p><span className="font-semibold">Transmission:</span> {selectedCar.transmission}</p>
                  <p><span className="font-semibold">Fuel:</span> {selectedCar.fuel}</p>
                </div>

                <button
                  onClick={() => scrollToBooking('car')}
                  className="w-full bg-[#2f8eb2] text-white px-6 py-4 rounded-lg font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Book This Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tourism Modal */}
      {selectedTourism && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={handleCloseTourism}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseTourism}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-[#2f8eb2]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto max-h-[90vh]">
              {/* Image Carousel */}
              <div className="relative h-64 md:h-80 bg-gray-900">
                <img
                  src={getImageUrl(galleryImages[`tourism-${selectedTourism.id}`]?.[currentImageIndex[`tourism-${selectedTourism.id}`] || 0] || selectedTourism.image)}
                  alt={selectedTourism.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />

                {/* Navigation Arrows */}
                {galleryImages[`tourism-${selectedTourism.id}`]?.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage(`tourism-${selectedTourism.id}`);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#2f8eb2] transition-colors z-20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage(`tourism-${selectedTourism.id}`);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#2f8eb2] transition-colors z-20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dot Indicators */}
                {galleryImages[`tourism-${selectedTourism.id}`]?.length > 1 && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                      {galleryImages[`tourism-${selectedTourism.id}`].map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => ({
                              ...prev,
                              [`tourism-${selectedTourism.id}`]: index
                            }));
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex[`tourism-${selectedTourism.id}`]
                              ? 'w-4 bg-[#2f8eb2]'
                              : 'bg-white/50 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 z-20 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                      {currentImageIndex[`tourism-${selectedTourism.id}`] + 1} / {galleryImages[`tourism-${selectedTourism.id}`].length}
                    </div>
                  </>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="px-3 py-1 bg-[#2f8eb2] text-white text-xs font-semibold uppercase tracking-wider rounded mb-3 inline-block">
                    {selectedTourism.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedTourism.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-10">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-[#2f8eb2] mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{selectedTourism.location}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-[#2f8eb2] mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">{selectedTourism.duration}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-[#2f8eb2] mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Best Time</p>
                    <p className="font-semibold">{selectedTourism.bestTime}</p>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-8">
                  {selectedTourism.description}
                </p>

                {selectedTourism.activities && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-black mb-4 border-b border-gray-200 pb-2">
                      Activities
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {parseJsonField(selectedTourism.activities).map((activity: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-[#2f8eb2] flex-shrink-0" />
                          <span className="text-sm text-gray-700">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => scrollToBooking('tourism')}
                  className="w-full bg-[#2f8eb2] text-white px-6 py-4 rounded-lg font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Explore Similar Tours
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
