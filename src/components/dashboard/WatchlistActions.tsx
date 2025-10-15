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
      <div className="flex items-center gap-2">
        <img src="/icons/star.svg" alt="Star" style={{ width: '28px', height: '28px' }} />
        <span 
          style={{
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '125%',
            letterSpacing: '-0.96%'
          }}
        >
          Watchlist
        </span>
      </div>
      <div className="flex items-center gap-3">
        <RefreshButton 
          onClick={onRefresh} 
          isRefreshing={isRefreshing} 
          disabled={!hasTokens}
        />
        <AddTokenButton onClick={onAddToken} />
      </div>
    </div>
  );
};
