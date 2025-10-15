import { Button } from '../common/Button';

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
  disabled?: boolean;
}

export const RefreshButton = ({ onClick, isRefreshing, disabled }: RefreshButtonProps) => {
  return (
    <>
      {/* Mobile - Icon only */}
      <button
        onClick={onClick}
        disabled={disabled || isRefreshing}
        className="lg:hidden flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          width: '44px',
          height: '44px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '12px',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isRefreshing) {
            e.currentTarget.style.backgroundColor = '#3d4149';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
        }}
      >
        <img 
          src="/icons/refresh.svg" 
          alt="Refresh" 
          style={{ 
            width: '20px', 
            height: '20px',
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
          }} 
        />
      </button>

      {/* Desktop - Full button */}
      <Button
        variant="secondary"
        onClick={onClick}
        disabled={disabled}
        isLoading={isRefreshing}
        icon={
          <img src="/icons/refresh.svg" alt="Refresh" style={{ width: '15px', height: '15px' }} />
        }
        className="hidden lg:flex"
      >
        Refresh Prices
      </Button>
    </>
  );
};
