import { CustomConnectButton } from './CustomConnectButton';

export const Header = () => {
  return (
    <header className="pt-4 sm:pt-0" style={{ minHeight: '56px' }}>
      <div className="max-w-7xl mx-auto" style={{ padding: '12px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '12px' }}>
            <img src="/logo.svg" alt="Token Portfolio Logo" className="w-8 h-8" />
            <h1 
              style={{
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '24px',
                letterSpacing: '0%'
              }}
            >
              Token Portfolio
            </h1>
          </div>

          <CustomConnectButton />
        </div>
      </div>
    </header>
  );
};
