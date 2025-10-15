import { useState } from 'react';

interface TokenImageProps {
  src: string;
  alt: string;
  symbol: string;
  size?: number;
}

export const TokenImage = ({ src, alt, symbol, size = 32 }: TokenImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
      {!imageLoaded && !imageError && (
        <div 
          style={{ 
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(90deg, rgba(169, 232, 81, 0.05) 0%, rgba(169, 232, 81, 0.15) 50%, rgba(169, 232, 81, 0.05) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite'
          }}
        />
      )}
      {imageError ? (
        <div style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: 'rgba(169, 232, 81, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${size * 0.4375}px`,
          fontWeight: 600,
          color: '#A9E851'
        }}>
          {symbol.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className="rounded-full"
          style={{ 
            width: `${size}px`,
            height: `${size}px`,
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};
