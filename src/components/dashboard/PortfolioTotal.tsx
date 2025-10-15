import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
    .filter((token) => token.holdings > 0)
    .map((token) => ({
      name: token.name,
      symbol: token.symbol,
      value: token.holdings * token.current_price,
      color: COLORS[watchlist.indexOf(token) % COLORS.length],
    }));

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);

  const chartData = portfolioData.map((item) => ({
    ...item,
    percentage: ((item.value / totalValue) * 100).toFixed(1),
  }));

  return (
    <div className="mb-4 sm:mb-8 relative" style={{ backgroundColor: 'var(--neutral-800)', borderRadius: '12px', padding: '24px' }}>
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
            <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
              Last updated: {lastUpdated}
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div>
          <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
          <div className="flex flex-col items-center" style={{ gap: '32px' }}>
            {/* Chart */}
            <div className="w-48 h-48 flex-shrink-0">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={78}
                      paddingAngle={0}
                      dataKey="value"
                      strokeWidth={1}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8" style={{ borderColor: 'var(--border-primary)' }}></div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="w-full space-y-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {item.name} ({item.symbol.toUpperCase()})
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.percentage}%</span>
                </div>
              ))}
              {chartData.length === 0 && (
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No holdings yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:grid lg:grid-cols-2" style={{ gap: '19px' }}>
        {/* Left Side - Total Value */}
        <div className="flex flex-col justify-start pt-2">
          <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
          <div 
            className="font-medium mb-16"
            style={{ 
              fontSize: '48px',
              lineHeight: '110%',
              letterSpacing: '-0.0224em',
              fontWeight: 500
            }}
          >
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {lastUpdated && (
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Last updated: {lastUpdated}
            </div>
          )}
        </div>

        {/* Right Side - Chart and Legend */}
        <div className="flex flex-col">
          <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
          <div className="flex items-start gap-8">
            {/* Chart */}
            <div className="w-36 h-36 flex-shrink-0">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={70}
                      paddingAngle={0}
                      dataKey="value"
                      strokeWidth={1}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8" style={{ borderColor: 'var(--border-primary)' }}></div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2.5 pt-1">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {item.name} ({item.symbol.toUpperCase()})
                    </span>
                  </div>
                  <span className="ml-4" style={{ color: 'var(--text-secondary)' }}>{item.percentage}%</span>
                </div>
              ))}
              {chartData.length === 0 && (
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No holdings yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
