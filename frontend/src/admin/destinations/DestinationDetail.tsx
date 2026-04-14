import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function DestinationDetail() {
  const { id } = useParams();
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm">
      <Link to="/admin/destinations" className="flex items-center gap-2 text-gray-600 hover:text-black mb-6">
        <ArrowLeft className="w-5 h-5" /> Back to Destinations
      </Link>
      <h1 className="text-3xl font-bold font-['Montserrat']">Destination Details (#{id})</h1>
      <p className="mt-4 text-gray-600">This generic detail view simply requires you to edit the item.</p>
      <Link to={`/admin/destinations/${id}/edit`} className="mt-6 inline-block bg-[#2f8eb2] text-white px-6 py-3 rounded-lg hover:bg-black transition-colors">
        Edit Destination
      </Link>
    </div>
  );
}
