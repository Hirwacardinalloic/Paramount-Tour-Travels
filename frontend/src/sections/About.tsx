import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setShowVideo(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Try to play video when it becomes available
  useEffect(() => {
    if (showVideo && videoRef.current && !videoError) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err);
      });
    }
  }, [showVideo, videoError]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVideoError = () => {
    console.error('Video failed to load');
    setVideoError(true);
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #c9a86c 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-12'
            }`}
          >
            {/* Section Label */}
            <div className="mb-6">
              <span
                className="block text-[#c9a86c] text-sm font-semibold uppercase tracking-[0.3em] mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                WHO
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-black"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                WE ARE
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p
                className={`transition-all duration-700 delay-200 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
                THE HURBERT is a value-driven business company specializing in
                the production and management of world-class events. With years
                of experience in the industry, we have established ourselves as
                the premier event management company in Rwanda.
              </p>
              <p
                className={`transition-all duration-700 delay-300 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
                Our comprehensive services include event planning, production,
                car rental, and Tourism. We pride ourselves on
                delivering exceptional experiences that exceed our clients'
                expectations.
              </p>
              <p
                className={`transition-all duration-700 delay-400 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
                From corporate conferences to cultural celebrations, we bring
                creativity, professionalism, and attention to detail to every
                project we undertake.
              </p>
            </div>

            {/* CTA Button */}
            <div
              className={`mt-10 transition-all duration-700 delay-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
            >
              <button
                onClick={() => scrollToSection('#booking')}
                className="group inline-flex items-center gap-3 bg-[#c9a86c] text-white px-8 py-4 font-semibold text-sm uppercase tracking-wider rounded transition-all duration-300 hover:bg-black hover:text-white"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Book Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>
          </div>

          {/* Video Section - Auto-playing company video with sound toggle */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-100 group">
              {showVideo && !videoError ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                    onError={handleVideoError}
                  >
                    <source src="/videoHURBERT.MP4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Sound Toggle Button */}
                  <button
                    onClick={toggleSound}
                    className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </>
              ) : videoError ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-gray-500 mb-2">Video preview not available</p>
                  <p className="text-gray-400 text-sm">Please contact us to see our company in action</p>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Loading video...</p>
                </div>
              )}

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#c9a86c]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#c9a86c]/10 rounded-full blur-xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}