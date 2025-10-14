import { getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Token Portfolio',
  projectId: 'a4b1f34b8c99b07a1b956035b455a0b2', 
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});

export const customTheme = darkTheme({
  accentColor: '#a3e635',
  accentColorForeground: '#000000',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});
