import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Upload, X } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  overnight?: string;
  meals?: string;
}

const parseJsonField = (field: any) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;

  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return field
      .split(',')
      .map((value: string) => value.trim())
      .filter(Boolean);
  }
};

export default function DestinationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    duration: '',
    bestTime: '',
    bestSeason: '',
    price: '',
    activities: [] as string[],
    description: '',
    itinerary: [] as ItineraryDay[],
    included: [] as string[],
    excluded: [] as string[],
    images: [] as string[],
    image: '',
    status: 'active'
  });
  const [newItineraryDay, setNewItineraryDay] = useState<ItineraryDay>({
    day: 1,
    title: '',
    description: '',
    overnight: '',
    meals: ''
  });
  const [newIncluded, setNewIncluded] = useState('');
  const [newExcluded, setNewExcluded] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (id) fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/destinations/${id}`);
      const data = await response.json();
      setFormData({
        name: data.name || '',
        category: data.category || '',
        location: data.location || '',
        duration: data.duration || '',
        bestTime: data.bestTime || '',
        bestSeason: data.bestSeason || '',
        price: data.price || '',
        activities: parseJsonField(data.activities),
        description: data.description || '',
        itinerary: parseJsonField(data.itinerary),
        included: parseJsonField(data.included),
        excluded: parseJsonField(data.excluded),
        images: parseJsonField(data.images),
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

  const addItineraryDay = () => {
    if (!newItineraryDay.title.trim() || !newItineraryDay.description.trim()) return;
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { ...newItineraryDay, day: prev.itinerary.length + 1 }]
    }));
    setNewItineraryDay({
      day: formData.itinerary.length + 2,
      title: '',
      description: '',
      overnight: '',
      meals: ''
    });
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((day, idx) => ({ ...day, day: idx + 1 }))
    }));
  };

  const addIncluded = () => {
    if (!newIncluded.trim()) return;
    setFormData(prev => ({ ...prev, included: [...prev.included, newIncluded.trim()] }));
    setNewIncluded('');
  };

  const removeIncluded = (index: number) => {
    setFormData(prev => ({ ...prev, included: prev.included.filter((_, i) => i !== index) }));
  };

  const addExcluded = () => {
    if (!newExcluded.trim()) return;
    setFormData(prev => ({ ...prev, excluded: [...prev.excluded, newExcluded.trim()] }));
    setNewExcluded('');
  };

  const removeExcluded = (index: number) => {
    setFormData(prev => ({ ...prev, excluded: prev.excluded.filter((_, i) => i !== index) }));
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData(prev => ({ ...prev, activities: [...prev.activities, newHighlight.trim()] }));
    setNewHighlight('');
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({ ...prev, activities: prev.activities.filter((_, i) => i !== index) }));
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleGalleryImageUpload = async (e: any) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('image', file);
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        }
      }
      if (uploadedUrls.length) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      }
    } catch (error) {
      console.error('Image gallery upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = id ? `http://localhost:5000/api/destinations/${id}` : `http://localhost:5000/api/destinations`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          activities: formData.activities,
          itinerary: formData.itinerary,
          included: formData.included,
          excluded: formData.excluded,
          images: formData.images,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Destination save failed:', text);
        throw new Error('Failed to save');
      }
      navigate(`/admin/destinations`);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/destinations')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black">{id ? 'Edit Destination' : 'Add New Destination'}</h1>
          <p className="text-gray-500 mt-1">{id ? 'Update destination details' : 'Create a new destination'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
                placeholder="e.g. Rwanda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
              >
                <option value="">Select Category</option>
                <option value="wildlife-safaris">Wildlife Safaris</option>
                <option value="gorilla-trekking">Gorilla Trekking</option>
                <option value="cultural-tours">Cultural Tours</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
                placeholder="e.g. East Africa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
                placeholder="e.g. 3-7 Days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Best Time</label>
              <input
                type="text"
                name="bestTime"
                value={formData.bestTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
                placeholder="e.g. June - September"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Best Season</label>
              <input
                type="text"
                name="bestSeason"
                value={formData.bestSeason}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
                placeholder="e.g. Dry season"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
                placeholder="e.g. $1,200 or Contact us"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Descriptions</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Add a highlight or activity"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-2 bg-[#2f8eb2] text-white rounded-lg hover:bg-[#1f6f95]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.activities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="flex-1 text-sm text-gray-700">{item}</span>
                      <button type="button" onClick={() => removeHighlight(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">Add destination highlights that will display as cards on the detail page.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
                  placeholder="Write a short description of the destination and its highlights."
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">What's Included</h2>
              <label className="block text-sm font-medium text-gray-700 mb-2">Included</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newIncluded}
                  onChange={(e) => setNewIncluded(e.target.value)}
                  placeholder="Add included item"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluded())}
                />
                <button
                  type="button"
                  onClick={addIncluded}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.included.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="flex-1 text-sm text-gray-700">{item}</span>
                    <button type="button" onClick={() => removeIncluded(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">What's Excluded</h2>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excluded</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newExcluded}
                  onChange={(e) => setNewExcluded(e.target.value)}
                  placeholder="Add excluded item"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExcluded())}
                />
                <button
                  type="button"
                  onClick={addExcluded}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.excluded.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="flex-1 text-sm text-gray-700">{item}</span>
                    <button type="button" onClick={() => removeExcluded(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day title</label>
                  <input
                    type="text"
                    value={newItineraryDay.title}
                    onChange={(e) => setNewItineraryDay(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                    placeholder="Day title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overnight location</label>
                  <input
                    type="text"
                    value={newItineraryDay.overnight}
                    onChange={(e) => setNewItineraryDay(prev => ({ ...prev, overnight: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                    placeholder="Overnight location (optional)"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day description</label>
                  <textarea
                    value={newItineraryDay.description}
                    onChange={(e) => setNewItineraryDay(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                    placeholder="Day description"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meals</label>
                  <input
                    type="text"
                    value={newItineraryDay.meals}
                    onChange={(e) => setNewItineraryDay(prev => ({ ...prev, meals: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl"
                    placeholder="Meals (optional)"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addItineraryDay}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#2f8eb2] px-5 py-3 text-white hover:bg-[#1f6f95] transition"
              >
                <Plus className="w-4 h-4" />
                Add Day
              </button>

              <div className="mt-6 space-y-4">
                {formData.itinerary.map((item, idx) => (
                  <div key={idx} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Day {item.day}</p>
                        <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                      </div>
                      <button type="button" onClick={() => removeItineraryDay(idx)} className="text-red-500 hover:text-red-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="mt-3 text-gray-700">{item.description}</p>
                    {(item.overnight || item.meals) && (
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                        {item.overnight && <span className="rounded-full bg-white px-3 py-1 border border-gray-200">Overnight: {item.overnight}</span>}
                        {item.meals && <span className="rounded-full bg-white px-3 py-1 border border-gray-200">Meals: {item.meals}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Destination Images</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:border-[#2f8eb2] focus:ring-[#2f8eb2]/20"
                  placeholder="Paste an image URL or use upload"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="w-full border border-dashed border-gray-300 rounded-3xl px-4 py-3 text-sm text-gray-600 hover:border-[#2f8eb2] hover:text-[#333] transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    {uploading ? 'Uploading image...' : 'Choose image file'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {formData.image && (
            <div className="rounded-3xl overflow-hidden border border-gray-200">
              <img src={formData.image} alt="Destination preview" className="w-full h-64 object-cover" />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/destinations')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-3xl bg-[#2f8eb2] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2f8eb2]/20 transition hover:bg-[#1f6f95] disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Saving...' : 'Save Destination'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}