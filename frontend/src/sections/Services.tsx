import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar, Car, MapPin, Mic, X, Check, Phone, Mail, Music, Lightbulb, Film, Table, Home, Cloud, Users, Star, Wifi, Wind, Shield, Clock, Coffee, Compass, Camera, Heart } from 'lucide-react';

// Services data with updated content
const services = [
  {
    id: 1,
    title: 'Event Planning',
    description: 'Comprehensive event planning services from concept to execution. We handle every detail to create unforgettable experiences.',
    image: '/norrsken.png',
    icon: Calendar,
    details: {
      fullDescription: 'Our Event Planning service provides end-to-end planning and coordination for all types of events. From intimate gatherings to large-scale celebrations, we ensure every detail is perfectly executed.',
      features: [
        'Sound System Setup & Engineering',
        'Professional Lighting Design',
        'LED Screens & Visual Displays',
        'Cocktail Tables & Lounge Setup',
        'Round Tables & Seating Arrangements',
        'Event Decorations & Styling',
        'Smoke Machines & Special Effects',
        'Professional Manpower & Staff',
        'Wedding Planning & Coordination',
        'Corporate Meeting Management',
      ],
      benefits: [
        'Stress-free event experience with professional coordination',
        'High-quality audio-visual equipment for memorable experiences',
        'Elegant decorations that match your theme and vision',
        'Professional staff to ensure smooth event flow',
        'Custom packages tailored to your specific needs',
        'Access to exclusive venues and vendors',
      ],
    },
  },
  {
    id: 2,
    title: 'Event Production',
    description: 'Full-scale production services including sound, lighting, screens, staging, and technical execution for events of any size.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    icon: Mic,
    details: {
      fullDescription: 'Our Event Production service delivers professional technical production for events of all scales. We bring your vision to life with state-of-the-art equipment and expert technical direction.',
      features: [
        'Professional Sound Systems & Engineering',
        'Stage Lighting & Design',
        'LED Walls & Video Screens',
        'Cocktail & Round Tables Setup',
        'Event Decorations & Ambiance',
        'Smoke Machines & Atmospheric Effects',
        'Event Staff & Manpower',
        'Technical Direction & Support',
      ],
      benefits: [
        'Crystal-clear sound quality for speeches and performances',
        'Dynamic lighting that transforms your venue',
        'High-impact visual displays for presentations',
        'Professional stage setup that wows your audience',
        'Seamless technical execution from start to finish',
        'Dedicated technical support throughout your event',
      ],
    },
  },
  {
    id: 3,
    title: 'Car Rental',
    description: 'Premium vehicle rental services with professional drivers. We provide luxury transportation for events, corporate travel, and special occasions.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    icon: Car,
    details: {
      fullDescription: 'Our Car Rental service offers premium vehicles with professional chauffeurs for all your transportation needs. Whether for corporate events, weddings, airport transfers, or leisure travel, we ensure comfort, safety, and style.',
      features: [
        'Luxury SUV Fleet (Toyota RAV4, Land Cruiser Prado, Range Rover)',
        'Executive Sedans (Mercedes C300) for Business Travel',
        'Coaster Buses for Group Transportation',
        'Professional Chauffeur Services',
        'Airport Transfer & Pickup Services',
        'Event Transportation Coordination',
        'Wedding Car Hire with Decoration',
        'Corporate Fleet Services',
        '24/7 Customer Support',
        'Flexible Rental Packages',
      ],
      benefits: [
        'Travel in comfort and style with our premium fleet',
        'Professional drivers ensure safe and punctual transportation',
        'Perfect for corporate clients impressing business partners',
        'Stress-free airport transfers and event logistics',
        'Well-maintained vehicles for reliable performance',
        'Competitive rates with no hidden fees',
        'Customized transportation solutions for groups',
      ],
    },
  },
  {
    id: 4,
    title: 'Destination Management',
    description: 'Complete destination management services showcasing the best of Rwanda. We create unforgettable experiences through curated tours and activities.',
    image: '/tourism.png',
    icon: MapPin,
    details: {
      fullDescription: 'Our Destination Management service offers comprehensive tour packages and experiences across Rwanda. From gorilla trekking to cultural tours, we create authentic adventures that showcase the beauty and hospitality of our country.',
      features: [
        'Gorilla Trekking Expeditions',
        'National Park Safaris (Akagera, Nyungwe, Volcanoes)',
        'Lake Kivu & Lake Muhazi Excursions',
        'Cultural & Heritage Tours',
        'Museum Visits (Nyanza Palace, Ethnographic Museum)',
        'Custom Itinerary Planning',
        'Professional Tour Guides',
        'Transportation & Logistics',
        'Accommodation Booking',
        'Corporate Retreat Packages',
      ],
      benefits: [
        'Authentic Rwandan experiences with local expertise',
        'Hassle-free travel with all logistics handled',
        'Expert guides who share deep cultural knowledge',
        'Custom itineraries tailored to your interests',
        'Access to exclusive experiences and locations',
        'Safe and comfortable travel arrangements',
        'Memorable adventures that create lasting impressions',
      ],
    },
  },
];

const CONTACT_INFO = {
  phone: '0782169162',
  whatsapp: '250782169162',
  email: 'thehurbertltd@gmail.com', // ✅ Updated email
  address: '1 KN 78 St, Kigali',
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setSelectedService(null);
  };

  const openWhatsApp = (serviceName: string) => {
    const message = encodeURIComponent(`Hello THE HURBERT! I'm interested in your ${serviceName} service.`);
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`, '_blank');
  };

  // ✅ FIXED: Using Gmail web interface like in contact.tsx
  const openEmail = (serviceName: string) => {
    const subject = encodeURIComponent(`Inquiry about ${serviceName} Services`);
    const body = encodeURIComponent(
      `Hello THE HURBERT,\n\nI'm interested in learning more about your ${serviceName} services.\n\nPlease provide me with more information.\n\nThank you.`
    );
    
    // Open Gmail compose window (like in contact.tsx)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_INFO.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-gray-50 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a86c] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c9a86c] rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <span
            className="text-[#c9a86c] text-sm font-semibold uppercase tracking-[0.3em] mb-4 block"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Our
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Services
          </h2>
          <div className="flex justify-center mt-4">
            <div className="w-20 h-1 bg-[#c9a86c] rounded-full" />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl overflow-hidden shadow-lg transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${200 + index * 150}ms`,
                  transform:
                    hoveredCard === service.id
                      ? 'translateY(-10px) scale(1.02)'
                      : 'translateY(0) scale(1)',
                }}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedService(service)} // Click on card opens modal
              >
                {/* Background Image */}
                <div className="aspect-[4/3] relative overflow-hidden cursor-pointer">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-[#c9a86c] flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-3 transition-all duration-300 group-hover:translate-x-2"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {service.title}
                    </h3>

                    {/* Description - Shows on hover */}
                    <p className="text-white/80 text-sm md:text-base mb-4 max-w-md transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                      {service.description}
                    </p>

                    {/* CTA Link */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from firing twice
                        setSelectedService(service);
                      }}
                      className="inline-flex items-center gap-2 text-[#c9a86c] font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:gap-4"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                    </button>
                  </div>

                  {/* Gold Accent Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c9a86c] transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#c9a86c] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Header Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="w-14 h-14 rounded-full bg-[#c9a86c] flex items-center justify-center mb-4">
                    <selectedService.icon className="w-7 h-7 text-white" />
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-bold text-white"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {selectedService.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-10">
                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {selectedService.details.fullDescription}
                </p>

                {/* What We Offer / Features */}
                <div className="mb-8">
                  <h3
                    className="text-xl font-bold text-black mb-4"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    What We Offer
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedService.details.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#c9a86c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#c9a86c]" />
                        </div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <h3
                    className="text-xl font-bold text-black mb-4"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Why Choose Us
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedService.details.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#c9a86c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#c9a86c]" />
                        </div>
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => scrollToSection('#booking')}
                    className="flex-1 bg-[#c9a86c] text-white px-6 py-4 rounded-lg font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:bg-black"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <Calendar className="w-5 h-5" />
                    Book Similar Service
                  </button>
                  <button
                    onClick={() => openWhatsApp(selectedService.title)}
                    className="flex-1 bg-green-500 text-white px-6 py-4 rounded-lg font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:bg-green-600"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <Phone className="w-5 h-5" />
                    Chat on WhatsApp
                  </button>
                  <button
                    onClick={() => openEmail(selectedService.title)}
                    className="flex-1 bg-blue-500 text-white px-6 py-4 rounded-lg font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-600"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <Mail className="w-5 h-5" />
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}