# Token Portfolio - Blockchain Dashboard

A modern cryptocurrency portfolio tracker built with React, TypeScript, and Web3 technologies. Track your token holdings, view real-time prices, and connect your wallet seamlessly.

## Features

- 🔗 **Wallet Connection** - Connect via RainbowKit with support for multiple wallets
- 📊 **Portfolio Dashboard** - View your token holdings and total portfolio value
- 💰 **Real-time Prices** - Live cryptocurrency prices from CoinGecko API
- 📈 **Charts & Analytics** - Visualize your portfolio performance with Recharts
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS
- ⚡ **Fast & Responsive** - Powered by Vite and React 19

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi, Viem, RainbowKit
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- A **CoinGecko API key** (free tier available at [CoinGecko](https://www.coingecko.com/en/api))
- A **WalletConnect Project ID** (free at [WalletConnect Cloud](https://cloud.walletconnect.com/))

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd token-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then edit the `.env` file and add your API keys:

```env
VITE_COINGECKO_API_KEY=your_actual_api_key_here
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

**Getting a CoinGecko API Key:**
1. Visit [CoinGecko API](https://www.coingecko.com/en/api)
2. Sign up for a free account
3. Navigate to your dashboard to get your API key
4. Copy the key and paste it in your `.env` file

**Getting a WalletConnect Project ID:**
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up for a free account
3. Create a new project
4. Copy the Project ID from your project dashboard
5. Paste it in your `.env` file

### 4. Run the Development Server

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).

### 5. Build for Production

To create a production build:

```bash
npm run build
```

The optimized files will be generated in the `dist` directory.

### 6. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
token-portfolio/
├── src/
│   ├── components/        # React components
│   │   └── dashboard/     # Dashboard-specific components
│   ├── store/            # Redux store configuration
│   ├── rainbowConfig.ts  # RainbowKit configuration
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── .env                  # Environment variables (create this)
├── .env.example          # Environment variables template
└── package.json          # Project dependencies
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### API Rate Limiting
The free tier of CoinGecko API has rate limits. If you encounter rate limiting errors, consider:
- Implementing caching strategies
- Upgrading to a paid CoinGecko plan
- Reducing the frequency of API calls

### Wallet Connection Issues
- Ensure you have a Web3 wallet extension installed (MetaMask, Rainbow, etc.)
- Check that your wallet is unlocked
- Try refreshing the page and reconnecting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
