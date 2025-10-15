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
