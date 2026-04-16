import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import type { BlogPost } from '../../services/blogService';
import { createBlogPost, getBlogPostById, updateBlogPost } from '../../services/blogService';

interface BlogFormData {
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  date: string;
  body: string;
}

const initialState: BlogFormData = {
  title: '',
  slug: '',
  category: '',
  description: '',
  image: '',
  date: '',
  body: '',
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function BlogForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<BlogFormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (id) {
      const existing = getBlogPostById(Number(id));
      if (!existing) {
        navigate('/admin/blog');
        return;
      }

      setFormData({
        title: existing.title,
        slug: existing.slug,
        category: existing.category,
        description: existing.description,
        image: existing.image,
        date: existing.date,
        body: existing.body,
      });
      setImagePreview(existing.image || '');
    }
  }, [id, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const payload: Omit<BlogPost, 'id'> = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || slugify(formData.title),
      category: formData.category.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || '/default-blog-image.jpg',
      date: formData.date.trim() || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      body: formData.body.trim(),
    };

    if (id) {
      updateBlogPost(Number(id), payload);
    } else {
      createBlogPost(payload);
    }

    localStorage.setItem('admin-update', Date.now().toString());
    setIsLoading(false);
    navigate('/admin/blog');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/blog')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {id ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h1>
          <p className="text-gray-500 mt-1">
            {id ? 'Update the post details and save changes.' : 'Create a new article for the blog.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#2f8eb2] focus:ring-2 focus:ring-[#2f8eb2]/20"
              placeholder="Enter article title"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#2f8eb2] focus:ring-2 focus:ring-[#2f8eb2]/20"
              placeholder="e.g. Travel Tips"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Publish Date</span>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#2f8eb2] focus:ring-2 focus:ring-[#2f8eb2]/20"
              placeholder="April 2026"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Featured Image</span>
            <div className="mt-2 flex flex-col gap-3">
              <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm font-medium text-gray-600 transition hover:border-[#2f8eb2] hover:bg-white">
                <Upload className="mr-2 h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Upload image file'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <img src={imagePreview} alt="Preview" className="h-44 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: '' }));
                      setImagePreview('');
                    }}
                    className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 p-2 text-gray-700 shadow-md hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Upload an image instead of entering a URL. The image will be saved automatically.</p>
              )}
            </div>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Short Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#2f8eb2] focus:ring-2 focus:ring-[#2f8eb2]/20"
            placeholder="Add a summary for the blog post"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Slug (optional)</span>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#2f8eb2] focus:ring-2 focus:ring-[#2f8eb2]/20"
            placeholder="article-slug-for-url"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Body</span>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={12}
            required
            className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-[#2f8eb2] focus:ring-2 focus:ring-[#2f8eb2]/20"
            placeholder="Write the full blog content here..."
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="w-full sm:w-auto rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#2f8eb2] px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            <Save className="w-4 h-4" />
            {id ? 'Save Changes' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
