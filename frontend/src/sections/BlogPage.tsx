import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogPosts, type BlogPost } from '../services/blogService';

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(getBlogPosts());
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-[#2E8B11] text-sm md:text-base font-semibold uppercase tracking-[0.3em] mb-4">
            Blog & Stories
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">
            Latest travel inspiration from Paramount Tour Travels
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600 text-base md:text-lg leading-8">
            Explore our articles, guest stories, and expert travel tips designed for group tours, wildlife safaris, cultural trips and unforgettable adventures.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="cursor-pointer overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 inline-flex rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E8B11] shadow-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{post.date}</span>
                  <span className="font-semibold text-[#2E8B11]">Featured</span>
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a] mb-4">{post.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{post.description}</p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/blog/${post.slug}`);
                  }}
                  className="inline-flex items-center rounded-full bg-[#2E8B11] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#1f6f95]"
                >
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
