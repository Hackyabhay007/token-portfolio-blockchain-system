import { Button } from '../common/Button';

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
  disabled?: boolean;
}

export const RefreshButton = ({ onClick, isRefreshing, disabled }: RefreshButtonProps) => {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      disabled={disabled}
      isLoading={isRefreshing}
      icon={
        <img src="/assets/refresh.svg" alt="Refresh" className="w-4 h-4" />
      }
    >
      Refresh Prices
    </Button>
  );
};
