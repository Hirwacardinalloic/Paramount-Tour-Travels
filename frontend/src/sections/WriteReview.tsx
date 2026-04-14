import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function WriteReview() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', location: '', title: '', review: '', rating: '5' });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.review.trim()) {
      setStatus({ type: 'error', message: 'Name and review are required.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'info', message: 'Submitting your review...' });

    try {
      const response = await api.post('/testimonials', {
        name: form.name,
        location: form.location,
        title: form.title,
        review: form.review,
        rating: Number(form.rating),
      });

      if (response.data?.success) {
        setStatus({ type: 'success', message: 'Thank you! Your review has been submitted.' });
        setForm({ name: '', location: '', title: '', review: '', rating: '5' });
      } else {
        setStatus({ type: 'error', message: response.data?.message || 'Unable to submit review.' });
      }
    } catch (error) {
      console.error('Submit review failed:', error);
      setStatus({ type: 'error', message: 'There was an error submitting your review. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12 rounded-[32px] border border-gray-200 bg-white p-10 shadow-xl">
          <div className="text-center">
            <p className="text-[#2E8B11] text-sm md:text-base font-semibold uppercase tracking-[0.3em] mb-4">
              Write a Review
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">
              Share your travel experience with us
            </h1>
            <p className="mx-auto max-w-2xl text-gray-600 text-base md:text-lg leading-8">
              Tell us about your trip and help others discover the best travel experiences with Paramount Adventure and Travels.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-200 bg-white p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-[#2E8B11] focus:ring-2 focus:ring-[#2E8B11]/20"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-[#2E8B11] focus:ring-2 focus:ring-[#2E8B11]/20"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-[#2E8B11] focus:ring-2 focus:ring-[#2E8B11]/20"
                placeholder="Traveler title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Review</label>
              <textarea
                name="review"
                value={form.review}
                onChange={handleChange}
                rows={8}
                className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-[#2E8B11] focus:ring-2 focus:ring-[#2E8B11]/20"
                placeholder="Write your experience here"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Rating</label>
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-[#2E8B11] focus:ring-2 focus:ring-[#2E8B11]/20"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} star{value > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {status && (
              <div
                className={`rounded-3xl px-4 py-3 text-sm ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : status.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-[#2E8B11] px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f6f95] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit review'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-[#0f172a] transition-colors duration-300 hover:bg-gray-100"
              >
                Back to Homepage
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
