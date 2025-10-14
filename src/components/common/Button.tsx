import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
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
  const baseStyles = "px-4 py-2 font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      color: '#000000',
      hoverColor: 'var(--accent-hover)',
    },
    secondary: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      hoverColor: '#3d4149',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <button
      className={`${baseStyles} ${className}`}
      style={{
        backgroundColor: currentVariant.backgroundColor,
        color: currentVariant.color,
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
