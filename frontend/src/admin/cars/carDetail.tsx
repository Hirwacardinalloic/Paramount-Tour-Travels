import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Car, Star, Calendar, Clock, Fuel, Gauge } from 'lucide-react';

interface Car {
  id: number;
  title: string;
  category: string;
  price: string;
  features: string;
  description: string;
  transmission: string;
  fuel: string;
  mileage: string;
  image: string;
  status: string;
}

export default function CarDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/cars/${id}`);
      const data = await response.json();
      setCar(data);
    } catch (error) {
      console.error('Failed to fetch car:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Car not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/cars')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {car.title}
            </h1>
            <p className="text-gray-500 mt-1">{car.category}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/cars/${id}/edit`)}
          className="inline-flex items-center gap-2 bg-[#c9a86c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit Car
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Image */}
        <div className="aspect-video relative">
          <img
            src={car.image || 'https://via.placeholder.com/1200x600'}
            alt={car.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(car.status)}`}>
              {car.status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="px-4 py-2 bg-[#c9a86c] text-white text-xl font-bold rounded-lg">
              {car.price}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          {/* Quick Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Car className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Transmission</p>
              <p className="font-semibold">{car.transmission}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Fuel className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Fuel</p>
              <p className="font-semibold">{car.fuel}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Gauge className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Mileage</p>
              <p className="font-semibold">{car.mileage}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Star className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-sm text-gray-500">Features</p>
              <p className="font-semibold text-sm">{car.features}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}