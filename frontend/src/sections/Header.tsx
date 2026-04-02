import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About us', href: '#about' },
  {
    label: 'Services',
    href: '#services',
    children: [
      { label: 'Events Planning', href: '#services' },
      { label: 'Event Production', href: '#services' },
      { label: 'Car Rental', href: '#services' },
      { label: 'Tourism', href: '#services' },
    ],
  },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact us', href: '#contact' },
];

// Keep social links for mobile menu
const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/hirwa.cardinalloic', icon: 'facebook' },
  { name: 'Twitter', url: 'https://x.com/CardinalHirwa', icon: 'twitter' },
  { name: 'Instagram', url: 'https://www.instagram.com/_hirwa1/', icon: 'instagram' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/cardinal-loic-hirwa-48502b242/', icon: 'linkedin' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileDropdownOpen(null);
  };

  const scrollToBooking = () => {
    const element = document.querySelector('#booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === label ? null : label);
  };

  // Open THE HURBERT exact location in Google Maps
  const openCompanyLocation = () => {
    window.open('https://maps.google.com/?q=1+KN+78+St,+Kigali,+Rwanda', '_blank');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between">
          {/* Logo Image */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className="transition-all duration-300 hover:scale-105"
          >
            <img
              src="/theHubert.png"
              alt="THE HURBERT"
              className={`h-12 md:h-14 w-auto object-contain transition-all duration-300 ${
                isScrolled ? 'brightness-75' : 'brightness-100'
              }`}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={`flex items-center gap-1 text-sm font-medium uppercase tracking-wider transition-all duration-300 hover:text-[#c9a86c] ${
                    isScrolled ? 'text-black' : 'text-white'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </a>

                {/* Desktop Dropdown Menu */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden animate-fade-in">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(child.href);
                        }}
                        className="block px-5 py-3 text-sm text-black hover:bg-[#c9a86c] hover:text-white transition-colors duration-200"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Location Button + Book Now - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Rectangle Location Button with Flag */}
            <button
              onClick={openCompanyLocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:border-[#c9a86c] ${
                isScrolled 
                  ? 'border-gray-300 text-black hover:bg-gray-50' 
                  : 'border-white/50 text-white hover:bg-white/10'
              }`}
              aria-label="View THE HURBERT office location"
              title="1 KN 78 St, Kigali - Click to open in Google Maps"
            >
              <img 
                src="/flags/rwanda-flag.png" 
                alt="Rwanda" 
                className="w-5 h-4 object-cover rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/rw.png';
                }}
              />
              <span className="text-sm font-medium">Kigali</span>
            </button>

            {/* Book Now Button */}
            <button
              onClick={scrollToBooking}
              className="bg-[#c9a86c] text-white px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-black transition-all duration-300 hover:scale-105 shadow-md"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors duration-300 ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Location Button Removed */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl animate-slide-up max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-gray-100 pb-2">
                {item.children ? (
                  // Item with dropdown
                  <div>
                    <button
                      onClick={() => toggleMobileDropdown(item.label)}
                      className="w-full flex items-center justify-between text-black font-medium uppercase tracking-wider py-2 hover:text-[#c9a86c] transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <span>{item.label}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${
                          mobileDropdownOpen === item.label ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Mobile Dropdown */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        mobileDropdownOpen === item.label ? 'max-h-96 mt-2' : 'max-h-0'
                      }`}
                    >
                      <div className="pl-4 space-y-2 pb-2">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection(child.href);
                            }}
                            className="block text-gray-600 text-sm py-2 hover:text-[#c9a86c] transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular item without dropdown
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className="block text-black font-medium uppercase tracking-wider py-2 hover:text-[#c9a86c] transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}

            {/* Book Now Button - Mobile */}
            <div className="pt-4">
              <button
                onClick={scrollToBooking}
                className="w-full bg-[#c9a86c] text-white px-5 py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Book Now
              </button>
            </div>

            {/* Social Icons - Mobile */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-black hover:bg-[#c9a86c] hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  <SocialIcon name={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function SocialIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'facebook':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return null;
  }
}