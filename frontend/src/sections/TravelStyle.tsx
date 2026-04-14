import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Heart, Trees, Compass, Map } from 'lucide-react';

const travelStyles = [
  {
    id: 1,
    title: 'Wildlife Safari',
    value: 'wildlife',
    description: 'Experience the thrill of the African savannah.',
    image: 'https://images.unsplash.com/photo-1516426122078-c8fae3f11904?w=800&q=80',
    icon: Camera,
  },
  {
    id: 2,
    title: 'Gorilla Trekking',
    value: 'gorilla',
    description: 'Come face-to-face with majestic mountain gorillas.',
    image: 'https://images.unsplash.com/photo-1565552636402-4fc8034ec3b5?w=800&q=80',
    icon: Trees,
  },
  {
    id: 3,
    title: 'Cultural Tours',
    value: 'cultural',
    description: 'Immerse yourself in rich local heritage.',
    image: 'https://images.unsplash.com/photo-1560086847-aef8c5476a6e?w=800&q=80',
    icon: Compass,
  },
  {
    id: 4,
    title: 'Honeymoon & Luxury',
    value: 'honeymoon',
    description: 'Unforgettable romantic escapes.',
    image: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=800&q=80',
    icon: Heart,
  },
  {
    id: 5,
    title: 'Adventure & Hiking',
    value: 'adventure',
    description: 'Conquer the spectacular peaks and trails.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    icon: Map,
  },
];

export default function TravelStyle() {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Navigate to tours page filtered by category
  const handleStyleClick = (categoryValue: string) => {
    navigate(`/tours?category=${categoryValue}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section 
      id="travel-style" 
      ref={sectionRef}
      className="relative w-full py-16 lg:py-24 bg-[#f8fafc] overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#2E8B11] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2E8B11] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto text-center mb-16">
        <p className="text-[#2E8B11] text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-4">
          Travel Style
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#002315] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Find the right Tour for you
        </h2>
        <div className="w-24 h-1 bg-[#2E8B11] mx-auto rounded-full" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {travelStyles.map((style, index) => (
            <div 
              key={style.id} 
              onClick={() => handleStyleClick(style.value)}
              className="group cursor-pointer flex flex-col items-center animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <img 
                  src={style.image} 
                  alt={style.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.15]"
                />
                {/* Subtle dark gradient for perfect modern look */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Clean white icon fading in */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-white drop-shadow-md">
                  <style.icon className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#002315] text-center mb-2 group-hover:text-[#2E8B11] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {style.title}
              </h3>
              <p className="text-sm text-gray-500 text-center px-2 max-w-[220px]">
                {style.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

