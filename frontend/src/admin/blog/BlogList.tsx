import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import type { BlogPost } from '../../services/blogService';
import { getBlogPosts, deleteBlogPost } from '../../services/blogService';

export default function BlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setPosts(getBlogPosts());
    setIsLoading(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    deleteBlogPost(id);
    localStorage.setItem('admin-update', Date.now().toString());
    fetchPosts();
  };

  const filteredPosts = posts.filter((post) =>
    [post.title, post.category, post.description]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Blog Posts
          </h1>
          <p className="text-gray-500 mt-1">Create, edit, and remove blog content from the dashboard.</p>
        </div>
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="inline-flex items-center gap-2 bg-[#2f8eb2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Post
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2f8eb2] focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/admin/blog/${post.id}`)}
            className="cursor-pointer bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="relative h-60 overflow-hidden">
              <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white">{post.category}</p>
                <h2 className="text-xl font-bold text-white mt-2">{post.title}</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.date}</span>
                <span className="rounded-full bg-[#2f8eb2] px-3 py-1 text-white text-xs font-semibold">Blog</span>
              </div>
              <p className="text-gray-600 line-clamp-3">{post.description}</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/admin/blog/${post.id}`);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/admin/blog/${post.id}/edit`);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(post.id);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-xl font-semibold text-gray-700 mb-2">No blog posts found</p>
            <p className="text-gray-500 mb-6">Use the button above to add your first blog article.</p>
            <button
              onClick={() => navigate('/admin/blog/new')}
              className="inline-flex items-center justify-center rounded-full bg-[#2f8eb2] px-6 py-3 text-white font-semibold hover:bg-black transition-colors"
            >
              Add New Blog Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
