import { useNavigate, useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-20">
        <div className="max-w-2xl text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-4">Article not found</h1>
          <p className="text-gray-600 mb-8">We could not locate the requested blog article. Please return to the blog list and choose another story.</p>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="inline-flex items-center rounded-full bg-[#2E8B11] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f6f95]"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter((entry) => entry.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition-colors duration-300 hover:bg-gray-100 mb-8"
        >
          ← Back to Blog
        </button>

        <div className="mb-12 rounded-[32px] border border-gray-200 bg-white p-10 shadow-xl">
          <div className="text-center">
            <p className="text-[#2E8B11] text-sm md:text-base font-semibold uppercase tracking-[0.3em] mb-4">
              Blog & Stories
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">{post.title}</h1>
            <p className="mx-auto max-w-2xl text-gray-600 text-base md:text-lg leading-8">
              {post.date} · {post.category}
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <article className="space-y-8">
            <div className="overflow-hidden rounded-[32px] bg-white shadow-xl">
              <img src={post.image} alt={post.title} className="h-[420px] w-full object-cover" />
              <div className="p-10 space-y-6">
                {post.body.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-8">{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          <aside className="space-y-8">
            <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-xl">
              <h2 className="text-xl font-bold text-[#0f172a] mb-4">Related articles</h2>
              <div className="space-y-4">
                {relatedPosts.map((related) => (
                  <button
                    key={related.slug}
                    type="button"
                    onClick={() => navigate(`/blog/${related.slug}`)}
                    className="w-full text-left rounded-3xl border border-gray-100 bg-gray-50 px-4 py-4 transition hover:border-[#2E8B11] hover:bg-[#f0fdf4]"
                  >
                    <p className="font-semibold text-[#0f172a]">{related.title}</p>
                    <p className="text-sm text-gray-500">{related.date}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-xl">
              <h2 className="text-xl font-bold text-[#0f172a] mb-4">Explore more</h2>
              <p className="text-gray-600 leading-7 mb-6">
                Dive into our travel blog for more stories, planning tips, and destination guides created for your next group journey.
              </p>
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="inline-flex items-center justify-center w-full rounded-full bg-[#2E8B11] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f6f95]"
              >
                Back to Blog List
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
