import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Car,
  MapPin,
  BookOpen,
  MessageSquare,
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  ArrowRight,
  Star,
  UserPlus
} from 'lucide-react';

interface DashboardStats {
  overview: {
    totalBookings: number;
    totalEvents: number;
    totalCars: number;
    totalTours: number;
    totalPartners: number;
    totalStaff: number;
    unreadMessages: number;
  };
  bookings: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  recentBookings: Array<{
    id: number;
    bookingNumber: string;
    customerName: string;
    serviceName: string;
    serviceType: string;
    status: string;
    date: string;
  }>;
  recentMessages: Array<{
    id: number;
    name: string;
    email: string;
    subject: string;
    status: string;
    date: string;
  }>;
  revenue: {
    total: number;
    pending: number;
    growth: number;
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/dashboard?range=${timeRange}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-50 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                timeRange === range
                  ? 'bg-[#c9a86c] text-black'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Total Bookings
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {stats?.overview.totalBookings || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
            <span className="text-gray-500">vs last {timeRange}</span>
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Active Events
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {stats?.overview.totalEvents || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-purple-600 font-medium">3 upcoming</span>
            <span className="text-gray-500">this month</span>
          </div>
        </div>

        {/* Available Cars */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Available Cars
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {stats?.overview.totalCars || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600 font-medium">6 in use</span>
            <span className="text-gray-500">currently</span>
          </div>
        </div>

        {/* Unread Messages */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Unread Messages
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {stats?.overview.unreadMessages || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-600 font-medium">urgent</span>
            <span className="text-gray-500">need response</span>
          </div>
        </div>
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Status */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Booking Status
          </h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stats?.bookings.pending || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: stats ? `${(stats.bookings.pending / stats.overview.totalBookings) * 100}%` : '0%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-700">Confirmed</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stats?.bookings.confirmed || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: stats ? `${(stats.bookings.confirmed / stats.overview.totalBookings) * 100}%` : '0%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stats?.bookings.completed || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: stats ? `${(stats.bookings.completed / stats.overview.totalBookings) * 100}%` : '0%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-gray-700">Cancelled</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stats?.bookings.cancelled || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: stats ? `${(stats.bookings.cancelled / stats.overview.totalBookings) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total Revenue</span>
              <span className="text-xl font-bold text-gray-900">
                ${stats?.revenue.total.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Pending</span>
              <span className="text-sm font-medium text-gray-700">
                ${stats?.revenue.pending.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">{stats?.revenue.growth || 0}% growth</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Recent Bookings
            </h3>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-sm text-[#c9a86c] hover:text-black font-medium transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {stats?.recentBookings && stats.recentBookings.length > 0 ? (
              stats.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {booking.serviceType === 'event' && <Calendar className="w-6 h-6 text-[#c9a86c]" />}
                    {booking.serviceType === 'car' && <Car className="w-6 h-6 text-[#c9a86c]" />}
                    {booking.serviceType === 'tour' && <MapPin className="w-6 h-6 text-[#c9a86c]" />}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {booking.customerName}
                      </h4>
                      <span className="text-xs text-gray-500">
                        #{booking.bookingNumber}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {booking.serviceName}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-[#c9a86c]" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h4>
                <p className="text-gray-500 text-sm mb-6">Your first booking will appear here</p>
                <button
                  onClick={() => navigate('/admin/bookings/new')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a86c] text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Quick Actions
            </h3>
            <p className="text-gray-400 text-sm">
              Manage your business efficiently
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/admin/events/new')}
              className="px-5 py-2.5 bg-[#c9a86c] text-black rounded-lg font-semibold text-sm hover:bg-white transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Add Event
            </button>
            <button
              onClick={() => navigate('/admin/cars/new')}
              className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              Add Car
            </button>
            <button
              onClick={() => navigate('/admin/tourism/new')}
              className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Add Destination
            </button>
            <button
              onClick={() => navigate('/admin/partners/new')}
              className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Add Partner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}