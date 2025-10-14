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
  const baseStyles = "px-6 font-semibold transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      color: '#000000',
      hoverColor: 'var(--accent-hover)',
      borderRadius: '12px',
      height: '36px',
      fontSize: '14px',
    },
    secondary: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      hoverColor: '#3d4149',
      borderRadius: '12px',
      height: '36px',
      fontSize: '14px',
    },
    danger: {
      backgroundColor: '#EF4444',
      color: '#FFFFFF',
      hoverColor: '#DC2626',
      borderRadius: '12px',
      height: '36px',
      fontSize: '14px',
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
