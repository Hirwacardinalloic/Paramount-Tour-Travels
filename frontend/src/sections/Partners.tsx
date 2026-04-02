import { useEffect, useState } from 'react';

export default function Partners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/partners');
        const data = await response.json();
        const activePartners = data.filter((p: any) => p.status === 'active');
        
        // Update the partner data with correct URLs
        const updatedPartners = activePartners.map((partner: any) => {
          if (partner.name === 'Kivu Noir' || partner.name === 'Kivu Noire') {
            return { ...partner, website: 'https://rw.kivunoir.coffee/' };
          }
          if (partner.name === 'Zaria Court') {
            return { ...partner, website: 'https://www.zariacourt.com/' };
          }
          if (partner.name === 'Norrsken') {
            return { ...partner, website: 'http://norrsken.org/' };
          }
          if (partner.name === 'Kozo') {
            return { ...partner, website: 'https://www.kozogh.com/' };
          }
          return partner;
        });
        
        setPartners(updatedPartners);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartners();

    // Listen for admin updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-update') {
        fetchPartners();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getImageUrl = (image: string) => {
    if (!image) return '/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return image;
  };

  const getWebsiteUrl = (url: string) => {
    if (!url || url === '#') return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  if (loading) {
    return (
      <div style={{
        padding: '4rem 2rem',
        backgroundColor: 'white',
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
    <div
      id="partners"
      style={{
        padding: '5rem 2rem',
        backgroundColor: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header - SIMPLIFIED animations */}
      <div style={{
        textAlign: 'center',
        marginBottom: '4rem'
      }}>
        <span style={{
          color: '#c9a86c',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          display: 'block',
          marginBottom: '1rem'
        }}>
          Our
        </span>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 700,
          color: 'black',
          marginBottom: '1rem'
        }}>
          Partners
        </h2>
        <div style={{
          width: '5rem',
          height: '0.25rem',
          backgroundColor: '#c9a86c',
          margin: '0 auto',
          borderRadius: '0.25rem'
        }} />
      </div>

      {/* Partners Grid - SIMPLIFIED without opacity animations */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '3rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {partners.map((partner: any, index: number) => (
          <a
            key={partner.id}
            href={getWebsiteUrl(partner.website)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              width: '200px',
              transition: 'transform 0.3s ease',
              cursor: partner.website && partner.website !== '#' ? 'pointer' : 'default'
            }}
            onMouseEnter={(e) => {
              if (partner.website && partner.website !== '#') {
                e.currentTarget.style.transform = 'translateY(-8px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={(e) => {
              if (!partner.website || partner.website === '#') {
                e.preventDefault();
              }
            }}
          >
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
              border: '1px solid #eaeaea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (partner.website && partner.website !== '#') {
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.1)';
            }}>
              <img
                src={getImageUrl(partner.logo)}
                alt={partner.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (partner.website && partner.website !== '#') {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                }}
              />
            </div>
            <h3 style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#4a4a4a',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (partner.website && partner.website !== '#') {
                e.currentTarget.style.color = '#c9a86c';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#4a4a4a';
            }}>
              {partner.name}
            </h3>
          </a>
        ))}
      </div>

      {/* Message if no partners */}
      {partners.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>
          No partners to display at the moment.
        </p>
      )}
    </div>
  );
}