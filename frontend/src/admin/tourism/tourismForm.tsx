import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Plus, X } from 'lucide-react';

interface TourismFormData {
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
  status: 'active' | 'inactive';
}

interface GalleryImage {
  id?: number;
  url: string;
  tempId?: string;
}

export default function TourismForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [formData, setFormData] = useState<TourismFormData>({
    title: '',
    category: '',
    location: '',
    duration: '',
    bestTime: '',
    bestSeason: '',
    description: '',
    activities: [],
    highlights: [],
    image: '',
    status: 'active',
  });

  useEffect(() => {
    if (id) {
      fetchTourism();
      fetchGallery();
    }
  }, [id]);

  const fetchTourism = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tourism/${id}`);
      const data = await response.json();
      
      const parsedData = {
        ...data,
        activities: Array.isArray(data.activities) 
          ? data.activities 
          : (data.activities ? JSON.parse(data.activities) : []),
        highlights: Array.isArray(data.highlights) 
          ? data.highlights 
          : (data.highlights ? JSON.parse(data.highlights) : [])
      };
      
      setFormData(parsedData);
    } catch (error) {
      console.error('Failed to fetch destination:', error);
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

  // Main Image Upload
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
    } finally {
      setUploadingGallery(false);
    }
  };

  const addActivity = () => {
    if (newActivity.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity.trim()]
      }));
      setNewActivity('');
    }
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Save/Update the destination
      const url = id ? `http://localhost:5000/api/tourism/${id}` : 'http://localhost:5000/api/tourism';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save destination');
      }

      const result = await response.json();
      const tourismId = id || result.id;

      // Step 2: Save gallery images (only those without IDs - new ones)
      if (galleryImages.length > 0) {
        const newImages = galleryImages.filter(img => !img.id);
        
        for (const img of newImages) {
          await fetch(`http://localhost:5000/api/gallery/tourism/${tourismId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: img.url })
          });
        }
      }

      localStorage.setItem('admin-update', Date.now().toString());
      navigate('/admin/tourism');
    } catch (error) {
      console.error('Failed to save destination:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/tourism')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {id ? 'Edit Destination' : 'Add New Destination'}
          </h1>
          <p className="text-gray-500 mt-1">
            {id ? 'Update destination details' : 'Add a new tourism destination'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="e.g., Volcanoes National Park"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="e.g., National Park, Lake, Museum"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="e.g., Musanze, Northern Province"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="e.g., Full day, 2-3 days"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Best Time to Visit
            </label>
            <input
              type="text"
              name="bestTime"
              value={formData.bestTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="e.g., June - September"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Best Season
            </label>
            <input
              type="text"
              name="bestSeason"
              value={formData.bestSeason}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="e.g., Dry season"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
            placeholder="Describe the destination..."
          />
        </div>

        {/* Activities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activities
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="Add an activity..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
            />
            <button
              type="button"
              onClick={addActivity}
              className="px-4 py-2 bg-[#c9a86c] text-white rounded-lg hover:bg-black transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.activities.map((activity, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {activity}
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highlights
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="Add a highlight..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-4 py-2 bg-[#c9a86c] text-white rounded-lg hover:bg-black transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.highlights.map((highlight, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {highlight}
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Destination Image
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
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
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
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
            Upload multiple photos of this destination
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

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/tourism')}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-[#c9a86c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Saving...' : id ? 'Update Destination' : 'Save Destination'}
          </button>
        </div>
      </form>
    </div>
  );
}