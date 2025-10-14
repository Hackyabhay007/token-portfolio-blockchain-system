import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { updatePrices } from '../store/portfolioSlice';
import { coinGeckoApi } from '../services/coinGeckoApi';
import { 
  PortfolioTotal, 
  WatchlistTable, 
  WatchlistActions, 
  AddTokenModal 
} from '../components/dashboard';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { watchlist } = useSelector((state: RootState) => state.portfolio);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshPrices = async () => {
    if (watchlist.length === 0) return;

    setIsRefreshing(true);
    try {
      const tokenIds = watchlist.map((token) => token.id);
      const updatedTokens = await coinGeckoApi.getTokensByIds(tokenIds);
      dispatch(updatePrices(updatedTokens));
    } catch (error) {
      console.error('Error refreshing prices:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PortfolioTotal />

      <WatchlistActions
        onRefresh={handleRefreshPrices}
        onAddToken={() => setIsModalOpen(true)}
        isRefreshing={isRefreshing}
        hasTokens={watchlist.length > 0}
      />

      <WatchlistTable />

      <AddTokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};
