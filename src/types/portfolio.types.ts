import type { WatchlistToken } from './token.types';

export interface PortfolioState {
  watchlist: WatchlistToken[];
  lastUpdated: string | null;
}
