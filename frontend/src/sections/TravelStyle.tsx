import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Heart, Trees, Compass, Map, ArrowRight } from 'lucide-react';

const travelStyles = [
  {
    id: 1,
    title: 'Wildlife Safari',
    value: 'wildlife',
    description: 'Experience the thrill of the African savannah.',
    image: './_DSC0331.JPG',
    icon: Camera,
  },
  {
    id: 2,
    title: 'Gorilla Trekking',
    value: 'gorilla',
    description: 'Come face-to-face with majestic mountain gorillas.',
    image: './gorilla4.jpg',
    icon: Trees,
  },
  {
    id: 3,
    title: 'Cultural Tours',
    value: 'cultural',
    description: 'Immerse yourself in rich local heritage.',
    image: './intore.jpg',
    icon: Compass,
  },
  {
    id: 5,
    title: 'Adventure & Hiking',
    value: 'adventure',
    description: 'Conquer the spectacular peaks and trails.',
    image: './adventure.jpg',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-10 lg:gap-12">
          {travelStyles.map((style, index) => (
            <div 
              key={style.id} 
              onClick={() => handleStyleClick(style.value)}
              className="group cursor-pointer overflow-hidden rounded-[2rem] bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in min-h-[28rem]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={style.image} 
                  alt={style.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#2E8B11] shadow-sm">
                  <style.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-[#002315] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {style.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {style.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-[#2E8B11] font-semibold">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

