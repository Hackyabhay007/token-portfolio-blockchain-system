import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="text-center">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="var(--neutral-600)" strokeWidth="4" opacity="0.3"/>
            <path d="M70 85L85 70M130 85L115 70M70 130C70 130 80 140 100 140C120 140 130 130 130 130" 
              stroke="var(--neutral-600)" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>

        {/* 404 Text */}
        <h1 
          className="mb-4"
          style={{ 
            fontSize: '72px',
            lineHeight: '1',
            letterSpacing: '-0.02em',
            fontWeight: 600,
            color: 'var(--text-bright)'
          }}
        >
          404
        </h1>

        {/* Description */}
        <p 
          className="mb-2"
          style={{ 
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 500,
            color: 'var(--text-bright)'
          }}
        >
          Page Not Found
        </p>

        <p 
          className="mb-8"
          style={{ 
            fontSize: '16px',
            lineHeight: '24px',
            color: 'var(--text-secondary)',
            maxWidth: '400px',
            margin: '0 auto 32px'
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back to Dashboard Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center font-medium transition-all hover:opacity-90"
          style={{ 
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--color-black)',
            height: '40px',
            borderRadius: '100px',
            gap: '8px',
            paddingTop: '10px',
            paddingRight: '24px',
            paddingBottom: '10px',
            paddingLeft: '24px',
            boxShadow: '0px 0.75px 0px 0px var(--shadow-inset-light) inset, 0px 1px 2px 0px var(--shadow-button), 0px 0px 0px 1px var(--accent-border)',
            justifyContent: 'center',
            textDecoration: 'none',
            fontSize: '16px',
            lineHeight: '20px',
            fontWeight: 500
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
