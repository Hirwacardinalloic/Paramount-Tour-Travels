import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, Upload } from 'lucide-react';

interface TourismFormData {
  name: string;
  category: string;
  location: string;
  duration: string;
  bestTime: string;
  price: number;
  description: string;
  longDescription: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  importantInfo: string[];
  images: string[];
  groupSize: string;
  image: string;
  status: 'active' | 'inactive';
}

interface GalleryImage {
  id?: number;
  url: string;
  tempId?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  overnight?: string;
  meals?: string;
}

export default function TourismForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [newIncluded, setNewIncluded] = useState('');
  const [newExcluded, setNewExcluded] = useState('');
  const [newImportantInfo, setNewImportantInfo] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newItineraryDay, setNewItineraryDay] = useState<ItineraryDay>({
    day: 1,
    title: '',
    description: '',
    overnight: '',
    meals: ''
  });

  const [formData, setFormData] = useState<TourismFormData>({
    name: '',
    category: '',
    location: '',
    duration: '',
    bestTime: '',
    price: 0,
    description: '',
    longDescription: '',
    highlights: [],
    itinerary: [],
    included: [],
    excluded: [],
    importantInfo: [],
    images: [],
    groupSize: '',
    image: '',
    status: 'active',
  });

  useEffect(() => {
    if (id) {
      fetchTour();
      fetchGallery();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tourism/${id}`);
      const data = await response.json();

      const parsedData = {
        name: data.name || data.title,
        category: data.category,
        location: data.location,
        duration: data.duration,
        bestTime: data.bestTime || '',
        price: data.price || 0,
        description: data.description,
        longDescription: data.longDescription || data.description,
        highlights: Array.isArray(data.highlights)
          ? data.highlights
          : data.highlights
          ? JSON.parse(data.highlights)
          : [],
        itinerary: Array.isArray(data.itinerary)
          ? data.itinerary
          : data.itinerary
          ? JSON.parse(data.itinerary)
          : [],
        included: Array.isArray(data.included) ? data.included : data.included ? JSON.parse(data.included) : [],
        excluded: Array.isArray(data.excluded) ? data.excluded : data.excluded ? JSON.parse(data.excluded) : [],
        importantInfo: Array.isArray(data.importantInfo)
          ? data.importantInfo
          : data.importantInfo
          ? JSON.parse(data.importantInfo)
          : [],
        images: Array.isArray(data.images) ? data.images : data.images ? JSON.parse(data.images) : [data.image].filter(Boolean),
        groupSize: data.groupSize || '',
        image: data.image || '',
        status: data.status || 'active',
      };

      setFormData(parsedData);
    } catch (error) {
      console.error('Failed to fetch tour:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/gallery/tourism/${id}`);
      const data = await response.json();
      setGalleryImages(data.map((img: any) => ({ 
        id: img.id, 
        url: img.image_url 
      })));
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Array management functions
  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({ ...prev, highlights: [...(prev.highlights || []), newHighlight.trim()] }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({ ...prev, highlights: (prev.highlights || []).filter((_, i) => i !== index) }));
  };

  const addItineraryDay = () => {
    if (newItineraryDay.title.trim() && newItineraryDay.description.trim()) {
      const updatedItinerary = [...(formData.itinerary || []), { ...newItineraryDay, day: (formData.itinerary?.length || 0) + 1 }];
      setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
      setNewItineraryDay({
        day: updatedItinerary.length + 1,
        title: '',
        description: '',
        overnight: '',
        meals: ''
      });
    }
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({ ...prev, itinerary: (prev.itinerary || []).filter((_, i) => i !== index) }));
  };

  const addIncluded = () => {
    if (newIncluded.trim()) {
      setFormData(prev => ({ ...prev, included: [...(prev.included || []), newIncluded.trim()] }));
      setNewIncluded('');
    }
  };

  const removeIncluded = (index: number) => {
    setFormData(prev => ({ ...prev, included: (prev.included || []).filter((_, i) => i !== index) }));
  };

  const addExcluded = () => {
    if (newExcluded.trim()) {
      setFormData(prev => ({ ...prev, excluded: [...(prev.excluded || []), newExcluded.trim()] }));
      setNewExcluded('');
    }
  };

  const removeExcluded = (index: number) => {
    setFormData(prev => ({ ...prev, excluded: (prev.excluded || []).filter((_, i) => i !== index) }));
  };

  const addImportantInfo = () => {
    if (newImportantInfo.trim()) {
      setFormData(prev => ({ ...prev, importantInfo: [...(prev.importantInfo || []), newImportantInfo.trim()] }));
      setNewImportantInfo('');
    }
  };

  const removeImportantInfo = (index: number) => {
    setFormData(prev => ({ ...prev, importantInfo: (prev.importantInfo || []).filter((_, i) => i !== index) }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), newImageUrl.trim()] }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.url }));
      console.log('✅ Main image uploaded:', data.url);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Gallery Images Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        return { url: data.url, tempId: Date.now() + '-' + Math.random() };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setGalleryImages(prev => [...prev, ...uploadedImages]);
    } catch (error) {
      console.error('Gallery upload failed:', error);
      alert('Failed to upload gallery images. Please try again.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Save/Update the tour
      const url = id ? `http://localhost:5000/api/tourism/${id}` : 'http://localhost:5000/api/tourism';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save tour');
      }

      const result = await response.json();
      const tourId = id || result.id;

      // Step 2: Save gallery images (only those without IDs - new ones)
      if (galleryImages.length > 0) {
        const newImages = galleryImages.filter(img => !img.id);
        
        for (const img of newImages) {
          await fetch(`http://localhost:5000/api/gallery/tourism/${tourId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: img.url })
          });
        }
      }

      localStorage.setItem('admin-update', Date.now().toString());
      navigate('/admin/tourism');
    } catch (error) {
      console.error('Failed to save tour:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeGalleryImage = async (index: number) => {
    const image = galleryImages[index];
    
    // If it's an existing image (has ID), delete from database
    if (image.id) {
      try {
        await fetch(`http://localhost:5000/api/gallery/${image.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Failed to delete gallery image:', error);
        // Continue with local removal even if API call fails
      }
    }
    
    // Remove from local state
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/tourism')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black">
            {id ? 'Edit Tour' : 'Add New Tour'}
          </h1>
          <p className="text-gray-500 mt-1">
            {id ? 'Update tour details and pricing' : 'Create a new tour package'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
                placeholder="e.g., 2 Days Akagera Safari"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2]"
              >
                <option value="">Select Category</option>
                <option value="wildlife">Wildlife Safari</option>
                <option value="gorilla">Gorilla Trekking</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural Tours</option>
                <option value="beach">Beach & Lake</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                min="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="693"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., 2 Days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
              <input
                type="text"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., 2-7 people"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., Kigali, Kayonza District"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Best Time to Visit</label>
              <input
                type="text"
                name="bestTime"
                value={formData.bestTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., June-September"
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Descriptions</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Brief tour overview"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Detailed tour description"
              />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Highlights</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="Add a highlight"
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
            {(formData.highlights || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="flex-1 text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeHighlight(idx)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Itinerary</h2>
          <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="Day title"
              value={newItineraryDay.title}
              onChange={(e) => setNewItineraryDay(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded"
            />
            <textarea
              placeholder="Day description"
              value={newItineraryDay.description}
              onChange={(e) => setNewItineraryDay(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded"
            />
            <input
              type="text"
              placeholder="Overnight location (optional)"
              value={newItineraryDay.overnight}
              onChange={(e) => setNewItineraryDay(prev => ({ ...prev, overnight: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded"
            />
            <input
              type="text"
              placeholder="Meals (optional)"
              value={newItineraryDay.meals}
              onChange={(e) => setNewItineraryDay(prev => ({ ...prev, meals: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded"
            />
            <button
              type="button"
              onClick={addItineraryDay}
              className="px-4 py-2 bg-[#2f8eb2] text-white rounded hover:bg-[#1f6f95]"
            >
              Add Day
            </button>
          </div>
          <div className="space-y-2">
            {(formData.itinerary || []).map((day, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">Day {day.day}: {day.title}</h4>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(idx)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{day.description}</p>
                {day.overnight && <p className="text-xs text-gray-500">Overnight: {day.overnight}</p>}
                {day.meals && <p className="text-xs text-gray-500">Meals: {day.meals}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* What's Included & Excluded */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">What's Included</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newIncluded}
                onChange={(e) => setNewIncluded(e.target.value)}
                placeholder="Add item"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluded())}
              />
              <button
                type="button"
                onClick={addIncluded}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {(formData.included || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <span className="flex-1 text-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeIncluded(idx)}
                    className="p-1 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">What's Excluded</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newExcluded}
                onChange={(e) => setNewExcluded(e.target.value)}
                placeholder="Add item"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExcluded())}
              />
              <button
                type="button"
                onClick={addExcluded}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {(formData.excluded || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <span className="flex-1 text-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeExcluded(idx)}
                    className="p-1 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Important Information</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newImportantInfo}
              onChange={(e) => setNewImportantInfo(e.target.value)}
              placeholder="Add important info"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImportantInfo())}
            />
            <button
              type="button"
              onClick={addImportantInfo}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {(formData.importantInfo || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <span className="flex-1 text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeImportantInfo(idx)}
                  className="p-1 text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Tour Images</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Image URL or upload"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>

              {/* Main Image Preview */}
              {formData.image && (
                <div className="mt-4 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Main Image Preview</p>
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Images Section */}
            <div className="pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Images (Multiple)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload multiple photos of this tour (different views, activities, landscapes)
              </p>
              <div className="flex gap-2 mb-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingGallery}
                  />
                  <button
                    type="button"
                    disabled={uploadingGallery}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingGallery ? 'Uploading...' : 'Upload Gallery Images'}
                  </button>
                </div>
              </div>

              {/* Gallery Preview */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img
                        src={img.url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/tourism')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-[#2f8eb2] text-white rounded-lg hover:bg-[#1f6f95] disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Saving...' : id ? 'Update Tour' : 'Create Tour'}
          </button>
        </div>
      </form>
    </div>
  );
}
