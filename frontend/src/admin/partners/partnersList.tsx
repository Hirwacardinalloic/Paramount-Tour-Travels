import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Globe, ExternalLink } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function PartnersList() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      // FIXED: Correct API endpoint
      const response = await fetch('http://localhost:5000/api/partners');
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this partner?')) return;
    
    try {
      // FIXED: Correct API endpoint
      await fetch(`http://localhost:5000/api/partners/${id}`, { method: 'DELETE' });
      
      // 🔴 ONLY THIS LINE ADDED - Trigger auto-refresh on public website
      localStorage.setItem('admin-update', Date.now().toString());
      
      fetchPartners(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete partner:', error);
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Partners
          </h1>
          <p className="text-gray-500 mt-1">Manage your company partners and sponsors</p>
        </div>
        <button
          onClick={() => navigate('/admin/partners/new')}
          className="inline-flex items-center gap-2 bg-[#c9a86c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Partner
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
          />
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
          >
            <div className="aspect-square relative bg-gray-50 p-8">
              <img
                src={partner.logo || 'https://via.placeholder.com/200x200?text=Logo'}
                alt={partner.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  partner.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {partner.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-center">{partner.name}</h3>
              
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-sm text-[#c9a86c] hover:text-black mb-4 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {partner.website.replace(/^https?:\/\//, '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/partners/${partner.id}/edit`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPartners.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No partners found</h3>
            <p className="text-gray-500 mb-6">Add your first partner to get started</p>
            <button
              onClick={() => navigate('/admin/partners/new')}
              className="inline-flex items-center gap-2 bg-[#c9a86c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add First Partner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}