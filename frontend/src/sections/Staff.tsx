import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Linkedin, Mail, ChevronRight } from 'lucide-react';

export default function Staff() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

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

  // Fetch staff with React Query
  const { data: staff = [], refetch, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/staff');
      const data = await response.json();
      return data.filter((s: any) => s.status === 'active');
    },
  });

  // Listen for storage events (when admin makes changes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-update') {
        refetch();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refetch]);

  const getImageUrl = (image: string) => {
    if (!image) return '/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return image;
  };

  const styles = `
    .staff-section {
      position: relative;
      width: 100%;
      padding: 6rem 0;
      background-color: #f9fafb;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .staff-pattern {
      position: absolute;
      inset: 0;
      opacity: 0.05;
      background-image: radial-gradient(circle at 2px 2px, #c9a86c 1px, transparent 0);
      background-size: 50px 50px;
      pointer-events: none;
    }

    .staff-container {
      position: relative;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .staff-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .staff-subtitle {
      color: #c9a86c;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      display: block;
      margin-bottom: 1rem;
    }

    .staff-title {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 700;
      color: black;
      margin-bottom: 1rem;
    }

    .staff-divider {
      width: 5rem;
      height: 0.25rem;
      background-color: #c9a86c;
      margin: 0 auto;
      border-radius: 9999px;
    }

    .staff-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .staff-card {
      cursor: pointer;
      background-color: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid #e5e7eb;
    }

    .staff-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }

    .staff-image-container {
      aspect-ratio: 3/4;
      overflow: hidden;
      background-color: #f3f4f6;
    }

    .staff-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .staff-card:hover .staff-image {
      transform: scale(1.1);
    }

    .staff-info {
      padding: 1.5rem;
      text-align: center;
    }

    .staff-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: black;
      margin-bottom: 0.25rem;
    }

    .staff-role {
      color: #c9a86c;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0,0,0,0.8);
      backdrop-filter: blur(4px);
      padding: 1rem;
    }

    .modal-container {
      position: relative;
      width: 100%;
      max-width: 56rem;
      max-height: 90vh;
      background-color: white;
      border-radius: 1rem;
      overflow: hidden;
    }

    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 20;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: rgba(0,0,0,0.5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .modal-close:hover {
      background-color: #c9a86c;
    }

    .modal-content {
      overflow-y: auto;
      max-height: 90vh;
    }

    .modal-body {
      padding: 2rem;
      background-color: white;
    }

    .modal-bio {
      color: #4b5563;
      line-height: 1.6;
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    .modal-contact-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-top: 1px solid #e5e7eb;
      padding-top: 1.5rem;
    }

    .modal-contact-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #4b5563;
      text-decoration: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
    }

    .modal-contact-link:hover {
      background-color: #f3f4f6;
      color: #c9a86c;
    }

    .modal-button {
      width: 100%;
      background-color: #c9a86c;
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: none;
      cursor: pointer;
      margin-top: 2rem;
      transition: background-color 0.2s ease;
    }

    .modal-button:hover {
      background-color: black;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .staff-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .staff-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        padding: '6rem 0',
        backgroundColor: '#f9fafb',
        textAlign: 'center'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '4px solid #c9a86c',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <section
        id="staff"
        ref={sectionRef}
        className="staff-section"
      >
        <div className="staff-pattern" />
        
        <div className="staff-container">
          {/* Section Header */}
          <div className="staff-header">
            <span className="staff-subtitle">Meet</span>
            <h2 className="staff-title">Our Team</h2>
            <div className="staff-divider" />
          </div>

          {/* Staff Grid */}
          {staff.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No team members to display.</p>
          ) : (
            <div className="staff-grid">
              {staff.map((member: any) => (
                <div
                  key={member.id}
                  className="staff-card"
                  onClick={() => setSelectedStaff(member)}
                >
                  <div className="staff-image-container">
                    <img
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      className="staff-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="staff-info">
                    <h3 className="staff-name">{member.name}</h3>
                    <p className="staff-role">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Staff Detail Modal */}
        {selectedStaff && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedStaff(null)}
          >
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedStaff(null)}
              >
                <X size={20} />
              </button>

              <div className="modal-content">
                {/* Image section showing FULL image */}
                <div style={{
                  width: '100%',
                  backgroundColor: '#f3f4f6',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: '300px'
                }}>
                  <img
                    src={getImageUrl(selectedStaff.image)}
                    alt={selectedStaff.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      backgroundColor: '#f3f4f6'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                  
                  {/* Gradient overlay for text */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '120px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    pointerEvents: 'none'
                  }} />
                  
                  {/* Text overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '2rem',
                    right: '2rem',
                    pointerEvents: 'none'
                  }}>
                    <h2 style={{
                      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                      fontWeight: 700,
                      color: 'white',
                      marginBottom: '0.5rem',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {selectedStaff.name}
                    </h2>
                    <p style={{
                      color: '#c9a86c',
                      fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                      fontWeight: 500,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      {selectedStaff.role}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="modal-body">
                  <p className="modal-bio">
                    {selectedStaff.bio || 'No biography available.'}
                  </p>

                  <div className="modal-contact-section">
                    <a
                      href={`mailto:${selectedStaff.email}`}
                      className="modal-contact-link"
                    >
                      <Mail size={20} />
                      <span>{selectedStaff.email}</span>
                    </a>
                    
                    {selectedStaff.linkedin && (
                      <a
                        href={selectedStaff.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-contact-link"
                      >
                        <Linkedin size={20} />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedStaff(null);
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="modal-button"
                  >
                    Contact This Team Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}