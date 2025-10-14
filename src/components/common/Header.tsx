import { CustomConnectButton } from './CustomConnectButton';

export const Header = () => {
  return (
    <header className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Token Portfolio Logo" className="w-8 h-8" />
            <h1 className="text-xl font-semibold">Token Portfolio</h1>
          </div>

          <CustomConnectButton />
        </div>
      </div>
    </header>
  );
};
