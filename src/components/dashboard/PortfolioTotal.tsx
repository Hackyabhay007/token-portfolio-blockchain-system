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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Left side - Total Value */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
        <div className="text-5xl font-semibold mb-6">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {lastUpdated && (
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Last updated: {lastUpdated}</div>
        )}
      </div>

      {/* Right side - Donut Chart */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Portfolio Total</div>
        <div className="flex items-center gap-6">
          {/* Chart */}
          <div className="w-40 h-40">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
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
          <div className="flex-1 space-y-2">
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
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No holdings yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
