import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
}

export const Button = ({ 
  variant = 'primary', 
  children, 
  icon, 
  isLoading = false,
  disabled,
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = "font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      color: 'var(--color-black)',
      hoverColor: 'var(--accent-hover)',
      borderRadius: '6px',
      height: '36px',
      fontSize: '14px',
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingTop: '8px',
      paddingBottom: '8px',
      gap: '6px',
      lineHeight: '20px',
      boxShadow: '0px 0.75px 0px 0px var(--shadow-inset) inset, 0px 1px 2px 0px var(--accent-border-light), 0px 0px 0px 1px var(--accent-border)',
    },
    secondary: {
      backgroundColor: 'var(--bg-button-secondary)',
      color: 'var(--text-primary)',
      hoverColor: 'var(--bg-button-secondary-hover)',
      borderRadius: '6px',
      height: '36px',
      fontSize: '14px',
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingTop: '8px',
      paddingBottom: '8px',
      gap: '6px',
      lineHeight: '20px',
      boxShadow: '0px 0.75px 0px 0px var(--shadow-inset) inset, 0px 1px 2px 0px var(--shadow-light), 0px 0px 0px 1px var(--shadow-darker)',
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: 'var(--color-white)',
      hoverColor: '#DC2626',
      borderRadius: '6px',
      height: '36px',
      fontSize: '14px',
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingTop: '8px',
      paddingBottom: '8px',
      gap: '6px',
      lineHeight: '20px',
      boxShadow: 'none',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <button
      className={`${baseStyles} ${className}`}
      style={{
        backgroundColor: currentVariant.backgroundColor,
        color: currentVariant.color,
        borderRadius: currentVariant.borderRadius,
        height: currentVariant.height,
        fontSize: currentVariant.fontSize,
        paddingLeft: currentVariant.paddingLeft,
        paddingRight: currentVariant.paddingRight,
        paddingTop: currentVariant.paddingTop,
        paddingBottom: currentVariant.paddingBottom,
        gap: currentVariant.gap,
        lineHeight: currentVariant.lineHeight,
        fontWeight: 500,
        letterSpacing: '0%',
        boxShadow: currentVariant.boxShadow,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.backgroundColor = currentVariant.hoverColor;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = currentVariant.backgroundColor;
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {icon && (
        <span className={isLoading ? 'animate-spin' : ''}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};
