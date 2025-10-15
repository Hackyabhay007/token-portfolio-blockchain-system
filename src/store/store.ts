import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './portfolioSlice';
import type { PortfolioState } from '../types';

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
});

export type RootState = {
  portfolio: PortfolioState;
};

export type AppDispatch = typeof store.dispatch;
