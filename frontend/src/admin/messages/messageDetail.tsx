import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  User, 
  Calendar,
  CheckCircle,
  Trash2,
  Reply
} from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function MessageDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const fetchMessage = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/contact/${id}`);
      const data = await response.json();
      setMessage(data);
    } catch (error) {
      console.error('Failed to fetch message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!message) return;
    
    try {
      await fetch(`http://localhost:5000/api/contact/${message.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchMessage();
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  const handleDelete = async () => {
    if (!message) return;
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/contact/${message.id}`, {
        method: 'DELETE'
      });
      navigate('/admin/messages');
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-700';
      case 'read': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Message not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/messages')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Message Details
            </h1>
            <p className="text-gray-500 mt-1">From {message.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(message.status)}`}>
            {message.status}
          </span>
        </div>
      </div>

      {/* Message Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Sender Info */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{message.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${message.email}`} className="font-medium text-[#c9a86c] hover:text-black">
                  {message.email}
                </a>
              </div>
            </div>
            {message.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href={`tel:${message.phone}`} className="font-medium text-gray-900">
                    {message.phone}
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Received</p>
                <p className="font-medium text-gray-900">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject */}
        {message.subject && (
          <div className="p-6 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Subject</p>
            <p className="text-lg font-medium text-gray-900">{message.subject}</p>
          </div>
        )}

        {/* Message */}
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-3">Message</p>
          <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed">
            {message.message}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
          <div className="flex gap-3">
            {message.status === 'unread' && (
              <button
                onClick={() => handleStatusChange('read')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Read
              </button>
            )}
            {message.status === 'read' && (
              <button
                onClick={() => handleStatusChange('replied')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Replied
              </button>
            )}
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your inquiry'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Reply className="w-4 h-4" />
              Reply via Email
            </a>
          </div>
          
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}