export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  event_date: string;
  location: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  seats: number;
  price_per_day: number;
  description: string;
  image_url: string;
  features: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: number;
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  image_url: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  max_participants: number;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  booking_type: 'event' | 'car' | 'tour';
  service_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  start_date: string;
  end_date: string;
  number_of_guests: number;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount: number;
  whatsapp_notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  event_date: string;
  location: string;
  client: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  counts: {
    events: number;
    cars: number;
    tours: number;
    bookings: number;
    messages: number;
    projects: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    byType: { booking_type: string; count: number }[];
    monthly: { month: string; count: number }[];
  };
  recent: {
    bookings: Booking[];
    messages: ContactMessage[];
  };
}

export interface ServiceCard {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
