import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';

// Destinations data
const destinations = [
  {
    id: 1,
    title: 'Rwanda',
    description: 'Experience the Land of a Thousand Hills with gorilla trekking, wildlife safaris, and vibrant culture.',
     image: '/gorilla1.jpg',
    icon: Globe,
    highlights: [
      'Mountain Gorilla Trekking',
      'Akagera National Park',
      'Kigali City Tours',
      'Volcanoes National Park',
      'Nyungwe Forest'
    ],
  },
  {
    id: 2,
    title: 'Uganda',
    description: 'Discover the Pearl of Africa with chimpanzee tracking, Nile River adventures, and diverse wildlife.',
    image: '/uganda.JPG',
    icon: Globe,
    highlights: [
      'Chimpanzee Tracking',
      'Murchison Falls',
      'Bwindi Impenetrable Forest',
      'Queen Elizabeth National Park',
      'Source of the Nile'
    ],
  },
  {
    id: 3,
    title: 'Kenya',
    description: 'Explore the cradle of humanity with Maasai culture, big five safaris, and stunning landscapes.',
    image: '/kenya.jpg',
    icon: Globe,
    highlights: [
      'Maasai Mara Safaris',
      'Amboseli National Park',
      'Tsavo National Park',
      'Mount Kenya',
      'Coastal Beaches'
    ],
  },
  {
    id: 4,
    title: 'Tanzania',
    description: 'Witness the Great Migration, climb Mount Kilimanjaro, and experience the Serengeti plains.',
    image: '/Tanzania.png',
    icon: Globe,
    highlights: [
      'Serengeti Great Migration',
      'Mount Kilimanjaro',
      'Ngorongoro Crater',
      'Zanzibar Islands',
      'Lake Manyara'
    ],
  },
];

export default function Destinations() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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

  return (
    <section
      id="destinations"
      ref={sectionRef}
      className="relative w-full py-12 lg:py-16 bg-[#f8fafc] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2f8eb2] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2f8eb2] rounded-full blur-3xl" />
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
            className="text-[#2f8eb2] text-sm font-semibold uppercase tracking-[0.3em] mb-4 block"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Discover
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Our Destinations
          </h2>
          <div className="flex justify-center mt-4">
            <div className="w-20 h-1 bg-[#2f8eb2] rounded-full" />
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {destinations.map((destination, index) => {
            const Icon = destination.icon;
            return (
              <div
                key={destination.id}
                className={`group relative rounded-2xl overflow-hidden shadow-lg transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${200 + index * 150}ms`,
                  transform:
                    hoveredCard === destination.id
                      ? 'translateY(-10px) scale(1.02)'
                      : 'translateY(0) scale(1)',
                }}
                onMouseEnter={() => setHoveredCard(destination.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/destinations/${destination.title.toLowerCase()}`)}
              >
                {/* Background Image */}
                <div className="aspect-[4/3] relative overflow-hidden cursor-pointer">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-[#2f8eb2] flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-3 transition-all duration-300 group-hover:translate-x-2"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {destination.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/80 text-sm md:text-base mb-4 max-w-md">
                      {destination.description}
                    </p>

                    {/* CTA Link */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/destinations/${destination.title.toLowerCase()}`);
                      }}
                      className="inline-flex items-center gap-2 text-[#2f8eb2] font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:gap-4"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Explore {destination.title}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                    </button>
                  </div>

                  {/* Gold Accent Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2f8eb2] transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
