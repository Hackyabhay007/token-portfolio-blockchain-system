import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { WatchlistToken } from '../../types';

// Get colors from CSS variables
const getChartColors = () => {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return [
    style.getPropertyValue('--chart-purple').trim() || '#8b5cf6',
    style.getPropertyValue('--chart-orange').trim() || '#f97316',
    style.getPropertyValue('--chart-cyan').trim() || '#06b6d4',
    style.getPropertyValue('--chart-green').trim() || '#10b981',
    style.getPropertyValue('--chart-red').trim() || '#ef4444',
    style.getPropertyValue('--chart-yellow').trim() || '#f59e0b',
  ];
};

export const PortfolioTotal = () => {
  const { watchlist, lastUpdated } = useSelector((state: RootState) => state.portfolio);
  const COLORS = getChartColors();

  const portfolioData = watchlist
    .filter((token: WatchlistToken) => token.holdings > 0)
    .map((token: WatchlistToken) => ({
      name: token.name,
      symbol: token.symbol,
      value: token.holdings * token.current_price,
      color: COLORS[watchlist.indexOf(token) % COLORS.length],
    }));

  const totalValue = portfolioData.reduce((sum: number, item: { value: number }) => sum + item.value, 0);

  const chartData = portfolioData.map((item: { name: string; symbol: string; value: number; color: string }) => ({
    ...item,
    percentage: ((item.value / totalValue) * 100).toFixed(1),
  }));

  return (
    <div className="mb-6 sm:mb-12 relative sm:rounded-xl" style={{ backgroundColor: 'var(--neutral-800)', padding: '24px' }}>
      {/* Mobile Layout - Stacked */}
      <div className="block lg:hidden">
        {/* Total Value */}
        <div className="mb-6">
          <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
          <div 
            className="font-medium"
            style={{ 
              fontSize: '40px',
              lineHeight: '110%',
              letterSpacing: '-0.0224em',
              fontWeight: 500
            }}
          >
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {lastUpdated && (
            <div className="mt-2" style={{ 
              color: 'var(--text-secondary)',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '20px',
              letterSpacing: '0%'
            }}>
              Last updated: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div>
          <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
          <div className="flex flex-col items-center" style={{ gap: '32px' }}>
            {/* Chart */}
            <div className="w-64 h-64 flex-shrink-0 relative" style={{ pointerEvents: 'none', userSelect: 'none' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                    
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={110}
                      paddingAngle={0}
                      dataKey="value"
                      strokeWidth={1}
                    >
                      {chartData.map((entry: { color: string }, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="128" cy="128" r="110" stroke="var(--neutral-600)" strokeWidth="10" opacity="0.6"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ pointerEvents: 'auto' }}>
                    <div style={{ 
                      fontSize: '18px',
                      lineHeight: '24px',
                      fontWeight: 500,
                      color: 'var(--text-bright)',
                      marginBottom: '4px'
                    }}>
                      No holdings yet
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {chartData.map((item: { name: string; symbol: string; percentage: string; color: string }, index: number) => (
                <div key={index} style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ 
                    color: item.color,
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0%'
                  }}>
                    {item.name} ({item.symbol.toUpperCase()})
                  </div>
                  <div style={{ 
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0%',
                    textAlign: 'right'
                  }}>
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:grid lg:grid-cols-2" style={{ gap: '19px' }}>
        {/* Left Side - Total Value */}
        <div className="flex flex-col justify-between pt-2">
          <div>
            <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
            <div 
              style={{ 
                fontSize: '48px',
                lineHeight: '110%',
                letterSpacing: '-2.24%',
                fontWeight: 500,
                fontStyle: 'normal',
                color: 'var(--text-bright)'
              }}
            >
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          {lastUpdated && (
            <div style={{ 
              color: 'var(--text-secondary)',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '20px',
              letterSpacing: '0%'
            }}>
              Last updated: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
          )}
        </div>

        {/* Right Side - Chart and Legend */}
        <div className="flex flex-col">
          <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
          <div className="flex items-start gap-8">
            {/* Chart */}
            <div className="w-48 h-48 flex-shrink-0 relative" style={{ pointerEvents: 'none', userSelect: 'none' }}>
              <div className="w-full h-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={85}
                        paddingAngle={0}
                        dataKey="value"
                        strokeWidth={1}
                      >
                        {chartData.map((entry: { color: string }, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="96" cy="96" r="85" stroke="var(--neutral-600)" strokeWidth="10" opacity="0.6"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ pointerEvents: 'auto' }}>
                      <div style={{ 
                        fontSize: '16px',
                        lineHeight: '20px',
                        fontWeight: 500,
                        color: 'var(--text-bright)'
                      }}>
                        No holdings yet
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 pt-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {chartData.map((item: { name: string; symbol: string; percentage: string; color: string }, index: number) => (
                <div key={index} style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ 
                    color: item.color,
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0%'
                  }}>
                    {item.name} ({item.symbol.toUpperCase()})
                  </div>
                  <div style={{ 
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0%',
                    textAlign: 'right'
                  }}>
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
