import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, MapPin, Users, Clock, Globe, CheckCircle } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  client: string;
  website: string;
  attendees: string;
  duration: string;
  servicesProvided: string[];
  image: string;
  status: string;
}

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Failed to fetch event:', error);
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

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Event not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/events')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {event.title}
            </h1>
            <p className="text-gray-500 mt-1">{event.category}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/events/${id}/edit`)}
          className="inline-flex items-center gap-2 bg-[#c9a86c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit Event
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Image */}
        <div className="aspect-video relative">
          <img
            src={event.image || 'https://via.placeholder.com/1200x600'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-8">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{event.date}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{event.location}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Attendees</p>
              <p className="font-semibold">{event.attendees}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{event.duration}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Services Provided */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-3">Services Provided</h3>
            <div className="flex flex-wrap gap-2">
              {event.servicesProvided.map((service, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#c9a86c]/10 text-[#c9a86c] rounded-full text-sm font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Client Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-semibold text-black">{event.client}</p>
            </div>
            {event.website && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Website</p>
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c9a86c] hover:text-black flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {event.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}