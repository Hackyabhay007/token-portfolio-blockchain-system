import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { updatePrices, setInitialLoadComplete } from '../store/portfolioSlice';
import { coinGeckoApi } from '../services/coinGeckoApi';
import type { WatchlistToken } from '../types';
import { PortfolioTotal } from '../components/dashboard/PortfolioTotal';
import { WatchlistTable } from '../components/dashboard/WatchlistTable';
import { WatchlistActions } from '../components/dashboard/WatchlistActions';
import { AddTokenModal } from '../components/dashboard/AddTokenModal';
import { PortfolioSkeleton, TableSkeleton, WatchlistActionsSkeleton } from '../components/common/SkeletonLoader';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { watchlist, isInitialLoading } = useSelector((state: RootState) => state.portfolio);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial load time for shimmer effect
    const timer = setTimeout(() => {
      dispatch(setInitialLoadComplete());
    }, 800);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleRefreshPrices = async () => {
    if (watchlist.length === 0) return;

    setIsRefreshing(true);
    setRefreshError(null);
    try {
      const tokenIds = watchlist.map((token: WatchlistToken) => token.id);
      const updatedTokens = await coinGeckoApi.getTokensByIds(tokenIds);
      dispatch(updatePrices(updatedTokens));
    } catch (error) {
      console.error('Error refreshing prices:', error);
      setRefreshError('Failed to refresh prices. Please try again.');
      // Auto-clear error after 5 seconds
      setTimeout(() => setRefreshError(null), 5000);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto pt-6 pb-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="px-4 sm:px-0">
        {refreshError && (
          <div 
            className="mb-4 animate-fade-in" 
            style={{ 
              backgroundColor: '#27272A',
              borderRadius: '8px',
              padding: '12px 16px',
              border: '1px solid #EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ color: '#EF4444', fontSize: '14px' }}>{refreshError}</div>
            <button
              onClick={() => setRefreshError(null)}
              style={{ color: 'var(--text-secondary)', fontSize: '20px', lineHeight: '1' }}
            >
              ×
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 sm:mt-0">
        {isInitialLoading ? <PortfolioSkeleton /> : <PortfolioTotal />}
      </div>

      <div className="px-4 sm:px-0">
        {isInitialLoading ? (
          <WatchlistActionsSkeleton />
        ) : (
          <WatchlistActions
            onRefresh={handleRefreshPrices}
            onAddToken={() => setIsModalOpen(true)}
            isRefreshing={isRefreshing}
            hasTokens={watchlist.length > 0}
          />
        )}

        {isInitialLoading ? <TableSkeleton /> : <WatchlistTable onAddToken={() => setIsModalOpen(true)} />}
      </div>

      <AddTokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};
