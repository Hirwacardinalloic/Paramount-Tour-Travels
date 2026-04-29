import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      // When entering fullscreen, remove aspect ratio constraint
      if (videoContainerRef.current && isNowFullscreen) {
        videoContainerRef.current.classList.add('fullscreen-mode');
      } else if (videoContainerRef.current && !isNowFullscreen) {
        videoContainerRef.current.classList.remove('fullscreen-mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!isFullscreen) {
      // Enter fullscreen
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-12 lg:py-16 bg-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #2f8eb2 1px, transparent 0)`,
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
                className="block text-[#2f8eb2] text-sm font-semibold uppercase tracking-[0.3em] mb-2"
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
                At Paramount Adventure and Travels, we craft extraordinary journeys with expert care and a personal touch. 
                From the moment you dream of your next adventure to the day you return home, we stand by your 
                side handling every detail with precision and passion.
              </p>
              <p
                className={`transition-all duration-700 delay-300 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
               Our approach blends seamless planning with responsible exploration, ensuring that your travels are 
               not only stress free but also deeply meaningful. We believe the best journeys do more than show you 
               new places they transform you. They spark curiosity, build genuine connections, and leave a lasting 
               positive impact on both you and the communities you visit.
              </p>
              <p
                className={`transition-all duration-700 delay-400 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
                Whether you're seeking hidden trails, cultural encounters, or once in a lifetime experiences,
                 we turn your travels into transformative adventures connecting you deeply with the world 
                 and its people.
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
                className="group inline-flex items-center gap-3 bg-[#2f8eb2] text-white px-8 py-4 font-semibold text-sm uppercase tracking-wider rounded transition-all duration-300 hover:bg-black hover:text-white"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Book Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>
          </div>

          {/* Video Section */}  
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-12'
            }`}
          >
            <div 
              ref={videoContainerRef}
              className="relative rounded-2xl overflow-hidden shadow-2xl bg-black group"
            >
              {/* Video Container - Responsive height for normal view */}
              <div className="relative w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[450px] bg-black">
                {showVideo && !videoError ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-contain"
                      onError={handleVideoError}
                    >
                      <source src="/videoHURBERT.MP4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Control Buttons Container */}
                    <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                      {/* Sound Toggle Button */}
                      <button
                        onClick={toggleSound}
                        className="bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 backdrop-blur-sm"
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      
                      {/* Fullscreen Toggle Button */}
                      <button
                        onClick={toggleFullscreen}
                        className="bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 backdrop-blur-sm"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-5 h-5" />
                        ) : (
                          <Maximize2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </>
                ) : videoError ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-gray-400 mb-2">Video preview not available</p>
                    <p className="text-gray-500 text-sm">Please contact us to see our company in action</p>
                  </div>
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-[#2f8eb2] border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-gray-400 text-sm">Loading video...</p>
                    </div>
                  </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#2f8eb2]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#2f8eb2]/10 rounded-full blur-xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for fullscreen mode */}
      <style>{`
        .fullscreen-mode {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 0 !important;
          background-color: black !important;
          z-index: 9999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .fullscreen-mode video {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }
        
        .fullscreen-mode .rounded-2xl {
          border-radius: 0 !important;
        }
        
        /* Remove fixed height in fullscreen */
        .fullscreen-mode > div {
          height: 100vh !important;
          width: 100vw !important;
        }
        
        /* Hide decorative elements in fullscreen */
        .fullscreen-mode .absolute.-bottom-4,
        .fullscreen-mode .absolute.-top-4 {
          display: none !important;
        }
      `}</style>
    </section>
  );
}
