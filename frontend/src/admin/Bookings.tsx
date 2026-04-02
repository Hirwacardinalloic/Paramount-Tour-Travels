import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Mail,
  Phone,
  Car,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Download,
  Plus,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';

interface Booking {
  id: number;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceType: 'event' | 'car' | 'tour';
  startDate: string;
  endDate: string;
  eventDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  createdAt: string;
}

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(b => b.id));
    }
  };

  const handleSelect = (id: number) => {
    setSelectedBookings(prev =>
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedBookings.length === 0) return;
    
    if (action === 'delete') {
      if (!confirm(`Delete ${selectedBookings.length} bookings?`)) return;
      
      try {
        await Promise.all(selectedBookings.map(id =>
          fetch(`/api/bookings/${id}`, { method: 'DELETE' })
        ));
        fetchBookings();
        setSelectedBookings([]);
      } catch (error) {
        console.error('Failed to delete bookings:', error);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Booking #', 'Customer', 'Service', 'Type', 'Date', 'Status', 'Payment', 'Amount'];
    const csvData = filteredBookings.map(b => [
      b.bookingNumber,
      b.customerName,
      b.serviceName,
      b.serviceType,
      new Date(b.createdAt).toLocaleDateString(),
      b.status,
      b.paymentStatus,
      b.totalPrice
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'unpaid': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="w-4 h-4" />;
      case 'tour': return <MapPin className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || booking.status === statusFilter;
      const matchesType = !typeFilter || booking.serviceType === typeFilter;
      
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const bookingDate = new Date(booking.createdAt);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        matchesDate = bookingDate >= start && bookingDate <= end;
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return sortOrder === 'desc'
          ? b.customerName.localeCompare(a.customerName)
          : a.customerName.localeCompare(b.customerName);
      }
      if (sortBy === 'price') {
        return sortOrder === 'desc'
          ? b.totalPrice - a.totalPrice
          : a.totalPrice - b.totalPrice;
      }
      return 0;
    });

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
            Bookings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all your bookings in one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedBookings.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedBookings.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Delete Selected
              </button>
            </>
          )}
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => navigate('/admin/bookings/new')}
            className="px-4 py-2 bg-[#c9a86c] text-black rounded-lg hover:bg-black hover:text-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Services</option>
              <option value="event">Events</option>
              <option value="car">Cars</option>
              <option value="tour">Tours</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="From"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a86c] focus:border-transparent"
              placeholder="To"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button
            onClick={() => {
              if (sortBy === 'date') setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              else { setSortBy('date'); setSortOrder('desc'); }
            }}
            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
              sortBy === 'date' ? 'bg-[#c9a86c] text-black' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Date
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              if (sortBy === 'name') setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              else { setSortBy('name'); setSortOrder('asc'); }
            }}
            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
              sortBy === 'name' ? 'bg-[#c9a86c] text-black' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Name
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              if (sortBy === 'price') setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              else { setSortBy('price'); setSortOrder('desc'); }
            }}
            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
              sortBy === 'price' ? 'bg-[#c9a86c] text-black' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Price
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#c9a86c] rounded focus:ring-[#c9a86c]"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Booking #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={() => handleSelect(booking.id)}
                        className="w-4 h-4 text-[#c9a86c] rounded focus:ring-[#c9a86c]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-600">
                        {booking.bookingNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-black">{booking.customerName}</p>
                        <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">
                          {getServiceIcon(booking.serviceType)}
                        </span>
                        <span className="text-sm text-gray-600">
                          {booking.serviceName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {booking.startDate || '?'} → {booking.endDate || '?'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ${booking.totalPrice?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                              title="Cancel"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                            title="Mark Completed"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                          title="More actions"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-2">No bookings found</p>
                      <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or create a new booking</p>
                      <button
                        onClick={() => navigate('/admin/bookings/new')}
                        className="px-6 py-3 bg-[#c9a86c] text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
                      >
                        Create First Booking
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing 1 to {filteredBookings.length} of {bookings.length} results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#c9a86c] text-black rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              3
            </button>
            <span className="text-sm text-gray-500">...</span>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}