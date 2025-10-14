import axios from 'axios';
import type { Token } from '../store/portfolioSlice';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-GaSU9qKnQGEJCSc9ZPZtvUry';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-cg-demo-api-key': API_KEY,
  },
});

export const coinGeckoApi = {
  searchTokens: async (query: string): Promise<Token[]> => {
    try {
      const response = await apiClient.get('/search', {
        params: { query },
      });
      
      // Get detailed info for the coins found
      const coinIds = response.data.coins.slice(0, 20).map((coin: any) => coin.id).join(',');
      if (!coinIds) return [];
      
      const detailsResponse = await apiClient.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: coinIds,
          order: 'market_cap_desc',
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
      
      return detailsResponse.data;
    } catch (error) {
      console.error('Error searching tokens:', error);
      return [];
    }
  },

  getTrendingTokens: async (): Promise<Token[]> => {
    try {
      const response = await apiClient.get('/search/trending');
      const trendingIds = response.data.coins.slice(0, 10).map((coin: any) => coin.item.id).join(',');
      
      if (!trendingIds) return [];
      
      const detailsResponse = await apiClient.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: trendingIds,
          order: 'market_cap_desc',
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
      
      return detailsResponse.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      return [];
    }
  },

  getTokensByIds: async (ids: string[]): Promise<Token[]> => {
    if (ids.length === 0) return [];
    
    try {
      const response = await apiClient.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: ids.join(','),
          order: 'market_cap_desc',
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tokens by IDs:', error);
      return [];
    }
  },

  getTopTokens: async (page: number = 1, perPage: number = 50): Promise<Token[]> => {
    try {
      const response = await apiClient.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: perPage,
          page,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching top tokens:', error);
      return [];
    }
  },
};
