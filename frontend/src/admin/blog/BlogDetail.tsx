import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { BlogPost } from '../../services/blogService';
import { getBlogPostById, deleteBlogPost } from '../../services/blogService';

export default function BlogDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!id) return;
    const existing = getBlogPostById(Number(id));
    if (!existing) {
      navigate('/admin/blog');
      return;
    }
    setPost(existing);
  }, [id, navigate]);

  const handleDelete = () => {
    if (!post) return;
    if (!confirm('Delete this post permanently?')) return;
    deleteBlogPost(post.id);
    localStorage.setItem('admin-update', Date.now().toString());
    navigate('/admin/blog');
  };

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/blog')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {post.title}
          </h1>
          <p className="text-gray-500">{post.category} · {post.date}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <img src={post.image} alt={post.title} className="h-96 w-full object-cover" />
        <div className="p-8 space-y-6">
          <p className="text-gray-600">{post.description}</p>
          <div className="space-y-4">
            {post.body.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-8">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-100 px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-200 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Post
        </button>
        <button
          onClick={handleDelete}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-red-100 px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Post
        </button>
      </div>
    </div>
  );
}
