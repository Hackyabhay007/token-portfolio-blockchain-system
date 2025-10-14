import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
  market_cap_rank?: number;
}

export interface WatchlistToken extends Token {
  holdings: number;
}

interface PortfolioState {
  watchlist: WatchlistToken[];
  lastUpdated: string | null;
}

const loadState = (): PortfolioState => {
  try {
    const serializedState = localStorage.getItem('portfolioState');
    if (serializedState === null) {
      return { watchlist: [], lastUpdated: null };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { watchlist: [], lastUpdated: null };
  }
};

const saveState = (state: PortfolioState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('portfolioState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState: PortfolioState = loadState();

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addTokensToWatchlist: (state, action: PayloadAction<Token[]>) => {
      action.payload.forEach((token) => {
        const exists = state.watchlist.find((t) => t.id === token.id);
        if (!exists) {
          state.watchlist.push({ ...token, holdings: 0 });
        }
      });
      state.lastUpdated = new Date().toLocaleString();
      saveState(state);
    },
    removeTokenFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter((t) => t.id !== action.payload);
      state.lastUpdated = new Date().toLocaleString();
      saveState(state);
    },
    updateHoldings: (state, action: PayloadAction<{ id: string; holdings: number }>) => {
      const token = state.watchlist.find((t) => t.id === action.payload.id);
      if (token) {
        token.holdings = action.payload.holdings;
        state.lastUpdated = new Date().toLocaleString();
        saveState(state);
      }
    },
    updatePrices: (state, action: PayloadAction<Token[]>) => {
      action.payload.forEach((updatedToken) => {
        const token = state.watchlist.find((t) => t.id === updatedToken.id);
        if (token) {
          token.current_price = updatedToken.current_price;
          token.price_change_percentage_24h = updatedToken.price_change_percentage_24h;
          token.sparkline_in_7d = updatedToken.sparkline_in_7d;
          token.image = updatedToken.image;
        }
      });
      state.lastUpdated = new Date().toLocaleString();
      saveState(state);
    },
  },
});

export const { addTokensToWatchlist, removeTokenFromWatchlist, updateHoldings, updatePrices } =
  portfolioSlice.actions;

export default portfolioSlice.reducer;
