import { useState } from 'react';
import type { TokenImageProps } from '../../types';

export const TokenImage = ({ src, alt, symbol, size, variant = 'modal' }: TokenImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Default sizes based on variant
  const defaultSize = variant === 'table' ? 32 : 28;
  const actualSize = size ?? defaultSize;

  // Styling based on variant
  const isTable = variant === 'table';
  const containerStyle = isTable
    ? {
        position: 'relative' as const,
        width: `${actualSize}px`,
        height: `${actualSize}px`,
        flexShrink: 0,
        borderRadius: '4px',
        border: '0.5px solid var(--border-light)'
      }
    : {
        position: 'relative' as const,
        width: `${actualSize}px`,
        height: `${actualSize}px`,
        flexShrink: 0,
        borderRadius: '6px',
        padding: '2px',
        background: 'var(--bg-primary)',
        boxShadow: '0px 0px 0px 1px var(--shadow-darker), 0px 1px 2px 0px var(--shadow-light)'
      };

  const innerSize = isTable ? actualSize : actualSize - 4;
  const innerBorderRadius = isTable ? '4px' : '4px';

  return (
    <div style={containerStyle}>
      {!imageLoaded && !imageError && (
        <div 
          style={{ 
            position: 'absolute',
            inset: isTable ? 0 : '2px',
            borderRadius: innerBorderRadius,
            background: 'linear-gradient(90deg, rgba(169, 232, 81, 0.05) 0%, rgba(169, 232, 81, 0.15) 50%, rgba(169, 232, 81, 0.05) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite'
          }}
        />
      )}
      {imageError ? (
        <div style={{
          width: `${innerSize}px`,
          height: `${innerSize}px`,
          borderRadius: innerBorderRadius,
          backgroundColor: 'rgba(169, 232, 81, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${innerSize * 0.4375}px`,
          fontWeight: 600,
          color: 'var(--accent-primary)'
        }}>
          {symbol.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            width: `${innerSize}px`,
            height: `${innerSize}px`,
            borderRadius: innerBorderRadius,
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            objectFit: 'cover'
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};
