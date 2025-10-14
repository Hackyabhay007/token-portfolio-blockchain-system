import { RefreshButton } from './RefreshButton';
import { AddTokenButton } from './AddTokenButton';

interface WatchlistActionsProps {
  onRefresh: () => void;
  onAddToken: () => void;
  isRefreshing: boolean;
  hasTokens: boolean;
}

export const WatchlistActions = ({ 
  onRefresh, 
  onAddToken, 
  isRefreshing, 
  hasTokens 
}: WatchlistActionsProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <RefreshButton 
          onClick={onRefresh} 
          isRefreshing={isRefreshing} 
          disabled={!hasTokens}
        />
      </div>

      <AddTokenButton onClick={onAddToken} />
    </div>
  );
};
