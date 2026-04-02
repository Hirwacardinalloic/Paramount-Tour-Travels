import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Car, Eye, Star } from 'lucide-react';

interface Car {
  id: number;
  title: string;
  category: string;
  price: string;
  features: string;
  image: string;
  status: 'available' | 'booked' | 'maintenance';
}

export default function CarsList() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cars');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/cars/${id}`, { method: 'DELETE' });
      
      // 🔴 TRIGGER AUTO-REFRESH ON PUBLIC WEBSITE
      localStorage.setItem('admin-update', Date.now().toString());
      
      fetchCars(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'booked': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCars = cars.filter(car =>
    car.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            Cars Fleet
          </h1>
          <p className="text-gray-500 mt-1">Manage your vehicle inventory</p>
        </div>
        <button
          onClick={() => navigate('/admin/cars/new')}
          className="inline-flex items-center gap-2 bg-[#c9a86c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Car
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
          />
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={car.image || 'https://via.placeholder.com/400x300'}
                alt={car.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(car.status)}`}>
                  {car.status}
                </span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="px-3 py-1 bg-[#c9a86c] text-white text-xs font-semibold rounded-full">
                  {car.price}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{car.title}</h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Star className="w-4 h-4 text-[#c9a86c]" />
                <span>{car.features}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/cars/${car.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => navigate(`/admin/cars/${car.id}/edit`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredCars.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No cars found</h3>
            <p className="text-gray-500">Add your first car to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}