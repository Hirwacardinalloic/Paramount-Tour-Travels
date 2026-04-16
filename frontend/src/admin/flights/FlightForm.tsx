import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';

export default function FlightForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    airline: '',
    route: '',
    flightClass: '',
    price: '',
    description: '',
    image: '',
    status: 'active'
  });

  useEffect(() => {
    if (id) fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/flights/${id}`);
      const data = await response.json();
      setFormData({
        airline: data.airline || '',
        route: data.route || '',
        flightClass: data.flightClass || '',
        price: data.price || '',
        description: data.description || '',
        image: data.image || '',
        status: data.status || 'active'
      });
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: uploadData
      });
      if(response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = id ? `http://localhost:5000/api/flights/${id}` : `http://localhost:5000/api/flights`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save');
      navigate(`/admin/flights`);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/admin/flights`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {id ? `Edit Flight` : `Add New Flight`}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
            <input type="text" name="airline" value={formData.airline} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent" placeholder="e.g. RwandAir" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
            <input type="text" name="route" value={formData.route} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent" placeholder="e.g. Kigali - Dubai" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flight Class</label>
            <input type="text" name="flightClass" value={formData.flightClass} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent" placeholder="e.g. Economy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input type="text" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent" placeholder="e.g. $500" />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
           <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <div className="flex gap-2">
            <input type="text" name="image" value={formData.image} onChange={handleChange} className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent" />
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <button type="button" className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
          {formData.image && <img src={formData.image} className="mt-4 h-32 rounded-lg object-contain" alt="preview" />}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/flights')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="bg-[#2f8eb2] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
            <Save className="w-5 h-5" /> {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
