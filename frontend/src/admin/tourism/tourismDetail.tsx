import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Clock, Calendar, Mountain, CheckCircle } from 'lucide-react';

interface Tourism {
  id: number;
  title: string;
  category: string;
  location: string;
  duration: string;
  bestTime: string;
  bestSeason: string;
  description: string;
  activities: string[];
  highlights: string[];
  image: string;
  status: string;
}

export default function TourismDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tourism, setTourism] = useState<Tourism | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTourism();
  }, [id]);

  const fetchTourism = async () => {
    try {
      const response = await fetch(`/api/tourism/${id}`);
      const data = await response.json();
      setTourism(data);
    } catch (error) {
      console.error('Failed to fetch destination:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tourism) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Destination not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/tourism')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {tourism.title}
            </h1>
            <p className="text-gray-500 mt-1">{tourism.category}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/tourism/${id}/edit`)}
          className="inline-flex items-center gap-2 bg-[#c9a86c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit Destination
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Image */}
        <div className="aspect-video relative">
          <img
            src={tourism.image || 'https://via.placeholder.com/1200x600'}
            alt={tourism.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              tourism.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {tourism.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{tourism.location}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{tourism.duration}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Best Time</p>
              <p className="font-semibold">{tourism.bestTime}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Mountain className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Best Season</p>
              <p className="font-semibold">{tourism.bestSeason}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{tourism.description}</p>
          </div>

          {/* Activities */}
          {tourism.activities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-black mb-3">Activities</h3>
              <div className="flex flex-wrap gap-2">
                {tourism.activities.map((activity, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#c9a86c]/10 text-[#c9a86c] rounded-full text-sm font-medium"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {tourism.highlights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-black mb-3">Highlights</h3>
              <div className="space-y-2">
                {tourism.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#c9a86c] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}