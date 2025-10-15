export const WatchlistActionsSkeleton = () => {
  return (
    <div className="flex items-center justify-between mb-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="shimmer" style={{ width: '28px', height: '28px', borderRadius: '4px' }}></div>
        <div className="shimmer" style={{ width: '120px', height: '30px', borderRadius: '4px' }}></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="shimmer" style={{ width: '40px', height: '40px', borderRadius: '8px' }}></div>
        <div className="shimmer" style={{ width: '120px', height: '40px', borderRadius: '8px' }}></div>
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="overflow-hidden animate-fade-in" style={{ backgroundColor: 'var(--neutral-800)', borderRadius: '12px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(161, 161, 170, 0.2)' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '800px' }}>
          <thead style={{ backgroundColor: 'var(--bg-component)' }}>
            <tr className="text-left" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>
              <th style={{ paddingLeft: '24px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Token</th>
              <th style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Price</th>
              <th style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px', fontSize: '14px', fontWeight: 500 }}>24h %</th>
              <th style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Sparkline (7d)</th>
              <th style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Holdings</th>
              <th style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px', fontSize: '14px', fontWeight: 500 }}>Value</th>
              <th style={{ paddingLeft: '12px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px', fontSize: '14px', fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr
                key={index}
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
              >
                {/* Token */}
                <td style={{ paddingLeft: '24px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <div className="shimmer" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
                    <div className="shimmer" style={{ width: '120px', height: '16px', borderRadius: '4px' }}></div>
                  </div>
                </td>

                {/* Price */}
                <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                  <div className="shimmer" style={{ width: '80px', height: '16px', borderRadius: '4px' }}></div>
                </td>

                {/* 24h % */}
                <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                  <div className="shimmer" style={{ width: '60px', height: '16px', borderRadius: '4px' }}></div>
                </td>

                {/* Sparkline */}
                <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                  <div className="shimmer" style={{ width: '128px', height: '40px', borderRadius: '4px' }}></div>
                </td>

                {/* Holdings */}
                <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                  <div className="shimmer" style={{ width: '70px', height: '16px', borderRadius: '4px' }}></div>
                </td>

                {/* Value */}
                <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                  <div className="shimmer" style={{ width: '90px', height: '16px', borderRadius: '4px' }}></div>
                </td>

                {/* Menu */}
                <td style={{ paddingLeft: '12px', paddingRight: '24px', paddingTop: '12px', paddingBottom: '12px' }}>
                  <div className="shimmer" style={{ width: '36px', height: '36px', borderRadius: '6px' }}></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid rgba(161, 161, 170, 0.2)' }}>
        <div className="shimmer" style={{ width: '120px', height: '16px', borderRadius: '4px' }}></div>
        <div className="flex items-center gap-6">
          <div className="shimmer" style={{ width: '80px', height: '16px', borderRadius: '4px' }}></div>
          <div className="flex gap-4">
            <div className="shimmer" style={{ width: '40px', height: '16px', borderRadius: '4px' }}></div>
            <div className="shimmer" style={{ width: '40px', height: '16px', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PortfolioSkeleton = () => {
  return (
    <div className="mb-6 sm:mb-12 relative sm:rounded-xl animate-fade-in" style={{ backgroundColor: 'var(--neutral-800)', padding: '24px' }}>
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="mb-6">
          <div className="shimmer" style={{ width: '100px', height: '14px', borderRadius: '4px', marginBottom: '8px' }}></div>
          <div className="shimmer" style={{ width: '200px', height: '44px', borderRadius: '6px', marginBottom: '8px' }}></div>
          <div className="shimmer" style={{ width: '150px', height: '12px', borderRadius: '4px' }}></div>
        </div>
        <div>
          <div className="shimmer" style={{ width: '100px', height: '14px', borderRadius: '4px', marginBottom: '16px' }}></div>
          <div className="flex flex-col items-center" style={{ gap: '32px' }}>
            <div className="shimmer" style={{ width: '192px', height: '192px', borderRadius: '50%' }}></div>
            <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[...Array(3)].map((_, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <div className="shimmer" style={{ width: '120px', height: '16px', borderRadius: '4px' }}></div>
                  <div className="shimmer" style={{ width: '50px', height: '16px', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2" style={{ gap: '19px' }}>
        <div className="flex flex-col justify-between pt-2">
          <div>
            <div className="shimmer" style={{ width: '100px', height: '14px', borderRadius: '4px', marginBottom: '12px' }}></div>
            <div className="shimmer" style={{ width: '250px', height: '53px', borderRadius: '6px' }}></div>
          </div>
          <div className="shimmer" style={{ width: '180px', height: '12px', borderRadius: '4px' }}></div>
        </div>

        <div className="flex flex-col">
          <div className="shimmer" style={{ width: '100px', height: '14px', borderRadius: '4px', marginBottom: '16px' }}></div>
          <div className="flex items-start gap-8">
            <div className="shimmer" style={{ width: '144px', height: '144px', borderRadius: '50%', flexShrink: 0 }}></div>
            <div className="flex-1 pt-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[...Array(3)].map((_, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <div className="shimmer" style={{ width: '140px', height: '16px', borderRadius: '4px' }}></div>
                  <div className="shimmer" style={{ width: '50px', height: '16px', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
