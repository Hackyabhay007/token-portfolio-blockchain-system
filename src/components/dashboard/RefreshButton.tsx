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
          width: '36px',
          height: '36px',
          backgroundColor: '#FFFFFF0A',
          borderRadius: '6px',
          padding: '10.5px',
          boxShadow: '0px 1px 2px 0px #0000001F, 0px 0px 0px 1px #00000014'
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isRefreshing) {
            e.currentTarget.style.backgroundColor = '#FFFFFF14';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF0A';
        }}
      >
        <img 
          src="/icons/refresh.svg" 
          alt="Refresh" 
          style={{ 
            width: '15px', 
            height: '15px',
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
