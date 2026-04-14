import { useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

export default function Blog() {
  const navigate = useNavigate();

  return (
    <section id="blog" className="relative w-full py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#2E8B11] text-sm md:text-base font-semibold uppercase tracking-[0.3em] mb-4">
            Blog & Stories
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a]">
            Our Group Tours Share the Joy of Travel
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 text-base md:text-lg leading-8">
            Read the latest travel inspiration, guest stories, and insider tips for making the most of your next adventure with us.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <article key={post.id} className="group overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="relative h-72 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute left-4 bottom-4 inline-flex rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E8B11] shadow">
                  {post.category}
                </span>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{post.date}</span>
                  <span className="font-semibold text-[#2E8B11]">Read more</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0f172a] mb-4">{post.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{post.description}</p>
                <button
                  type="button"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2E8B11] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f6f95]"
                >
                  Continue Reading
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="inline-flex items-center rounded-full bg-[#2E8B11] px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f6f95]"
          >
            More Articles
          </button>
        </div>
      </div>
    </section>
  );
}
