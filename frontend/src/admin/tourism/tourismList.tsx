import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Mountain, MapPin, Clock } from 'lucide-react';

interface Tourism {
  id: number;
  title: string;
  category: string;
  location: string;
  duration: string;
  bestTime: string;
  image: string;
  status: 'active' | 'inactive';
}

export default function TourismList() {
  const navigate = useNavigate();
  const [tourism, setTourism] = useState<Tourism[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTourism();
  }, []);

  const fetchTourism = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tourism');
      const data = await response.json();
      setTourism(data);
    } catch (error) {
      console.error('Failed to fetch tourism destinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/tourism/${id}`, { method: 'DELETE' });
      
      // 🔴 TRIGGER AUTO-REFRESH ON PUBLIC WEBSITE
      localStorage.setItem('admin-update', Date.now().toString());
      
      fetchTourism();
    } catch (error) {
      console.error('Failed to delete destination:', error);
    }
  };

  const filteredTourism = tourism.filter(dest =>
    dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Tourism Destinations
          </h1>
          <p className="text-gray-500 mt-1">Manage all travel destinations</p>
        </div>
        <button
          onClick={() => navigate('/admin/tourism/new')}
          className="inline-flex items-center gap-2 bg-[#c9a86c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Destination
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
          />
        </div>
      </div>

      {/* Tourism Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTourism.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={dest.image || 'https://via.placeholder.com/400x300'}
                alt={dest.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  dest.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {dest.status}
                </span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="px-3 py-1 bg-[#c9a86c] text-white text-xs font-semibold rounded-full">
                  {dest.category}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{dest.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c9a86c]" />
                  <span>{dest.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#c9a86c]" />
                  <span>Best: {dest.bestTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/tourism/${dest.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => navigate(`/admin/tourism/${dest.id}/edit`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dest.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTourism.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No destinations found</h3>
            <p className="text-gray-500">Add your first tourism destination to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}