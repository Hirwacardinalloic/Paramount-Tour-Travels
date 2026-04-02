import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    subtitle: 'EVENTS',
    title: 'Creating Unforgettable Experiences',
    description: 'From corporate gatherings to grand celebrations, we bring your vision to life with precision and creativity.',
    image: './norrsken.png',
    link: '#services',
  },
  {
    id: 2,
    subtitle: 'CAR RENTAL',
    title: 'Premium Vehicles for Every Journey',
    description: 'Luxury cars and professional drivers to ensure you travel in comfort and style across Rwanda.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80',
    link: '#services',
  },
  {
    id: 3,
    subtitle: 'TOURISM',
    title: 'Discover the Beauty of Rwanda',
    description: 'Explore the Land of a Thousand Hills with our curated Tourism services.',
    image: './kivu.png',
    link: '#services',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image with Ken Burns effect */}
          <div
            className={`absolute inset-0 transition-transform duration-[8000ms] ${
              index === currentSlide ? 'scale-110' : 'scale-100'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="max-w-3xl">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8 absolute'
                }`}
              >
                {index === currentSlide && (
                  <>
                    {/* Subtitle */}
                    <p
                      className="text-[#c9a86c] text-sm md:text-base font-semibold uppercase tracking-[0.3em] mb-4 animate-slide-up"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        animationDelay: '0.2s',
                      }}
                    >
                      {slide.subtitle}
                    </p>

                    {/* Title */}
                    <h1
                      className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight text-shadow-lg"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        animationDelay: '0.4s',
                      }}
                    >
                      {slide.title.split(' ').map((word, i) => (
                        <span
                          key={i}
                          className="inline-block animate-slide-up"
                          style={{
                            animationDelay: `${0.4 + i * 0.08}s`,
                          }}
                        >
                          {word}&nbsp;
                        </span>
                      ))}
                    </h1>

                    {/* Description */}
                    <p
                      className="text-white/80 text-lg md:text-xl mb-8 max-w-xl animate-slide-up"
                      style={{ animationDelay: '0.7s' }}
                    >
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <div
                      className="animate-slide-up"
                      style={{ animationDelay: '0.9s' }}
                    >
                      <button
                        onClick={() => scrollToSection(slide.link)}
                        className="group inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 font-semibold text-sm uppercase tracking-wider rounded transition-all duration-300 hover:bg-[#c9a86c] hover:border-[#c9a86c] hover:text-black"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Learn more
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none z-20">
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#c9a86c] hover:border-[#c9a86c] hover:text-black hover:scale-110 disabled:opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#c9a86c] hover:border-[#c9a86c] hover:text-black hover:scale-110 disabled:opacity-50"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 800);
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#c9a86c] w-10'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
