import type { Token } from './token.types';

export interface TokenImageProps {
  src: string;
  alt: string;
  symbol: string;
  size?: number;
  variant?: 'modal' | 'table';
}

export interface TokenRowProps {
  token: Token;
  isSelected: boolean;
  onToggle: () => void;
  index?: number;
  animate?: boolean;
}

export interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}
