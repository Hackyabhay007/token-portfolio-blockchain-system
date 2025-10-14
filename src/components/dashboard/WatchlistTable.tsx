import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { updateHoldings, removeTokenFromWatchlist } from '../../store/portfolioSlice';
import { Sparkline } from './Sparkline';

export const WatchlistTable = () => {
  const dispatch = useDispatch();
  const { watchlist } = useSelector((state: RootState) => state.portfolio);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(watchlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTokens = watchlist.slice(startIndex, endIndex);

  const handleEditHoldings = (id: string, currentHoldings: number) => {
    setEditingId(id);
    setEditValue(currentHoldings.toString());
  };

  const handleSaveHoldings = (id: string) => {
    const value = parseFloat(editValue) || 0;
    dispatch(updateHoldings({ id, holdings: value }));
    setEditingId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveHoldings(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleRemoveToken = (id: string) => {
    dispatch(removeTokenFromWatchlist(id));
    setOpenMenuId(null);
  };

  return (
    <div className="overflow-hidden" style={{ backgroundColor: 'var(--neutral-800)', borderRadius: '12px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(161, 161, 170, 0.2)' }}>
      {/* Table */}
      {watchlist.length === 0 ? (
        <div className="px-6 py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
          No tokens in watchlist. Click "Add Token" to get started.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--bg-component)' }}>
                <tr className="text-left" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>
                  <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: 500 }}>Token</th>
                  <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: 500 }}>Price</th>
                  <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: 500 }}>24h %</th>
                  <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: 500 }}>Sparkline (7d)</th>
                  <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: 500 }}>Holdings</th>
                  <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: 500 }}>Value</th>
                  <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: 500 }}></th>
                </tr>
              </thead>
              <tbody>
                {currentTokens.map((token) => {
                  const value = token.holdings * token.current_price;
                  const isPositive = token.price_change_percentage_24h >= 0;
                  const sparklineColor = isPositive ? '#10B981' : '#EF4444';

                  return (
                    <tr
                      key={token.id}
                      className="transition-colors"
                      style={{ 
                        backgroundColor: 'var(--bg-primary)',
                        height: '48px',
                        paddingLeft: '24px',
                        paddingRight: '24px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(161, 161, 170, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                    >
                      {/* Token */}
                      <td style={{ paddingLeft: '24px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <div className="flex items-center gap-3">
                          <img
                            src={token.image}
                            alt={token.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div style={{ fontSize: '14px', fontWeight: 400 }}>
                            {token.name} <span style={{ color: 'var(--text-secondary)' }}>({token.symbol.toUpperCase()})</span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px', fontSize: '14px', fontWeight: 400 }}>
                        ${token.current_price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* 24h % */}
                      <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: isPositive ? '#10B981' : '#EF4444'
                          }}
                        >
                          {isPositive ? '+' : ''}
                          {token.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>

                      {/* Sparkline */}
                      <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <div className="w-32 h-10">
                          {token.sparkline_in_7d?.price ? (
                            <Sparkline
                              data={token.sparkline_in_7d.price}
                              color={sparklineColor}
                            />
                          ) : (
                            <div className="text-gray-600 text-xs">No data</div>
                          )}
                        </div>
                      </td>

                      {/* Holdings */}
                      <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                        {editingId === token.id ? (
                          <div className="flex items-center gap-3">
                            <div className="relative" style={{
                              padding: '3px',
                              background: 'var(--accent-primary)',
                              borderRadius: '16px'
                            }}>
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, token.id)}
                                className="px-4 py-3 text-base focus:outline-none appearance-none"
                                style={{ 
                                  width: '280px',
                                  backgroundColor: 'var(--bg-tertiary)', 
                                  border: '2px solid var(--accent-primary)',
                                  borderRadius: '12px',
                                  color: 'var(--text-primary)'
                                }}
                                placeholder="Select"
                                autoFocus
                              />
                              <svg
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                            <button
                              onClick={() => handleSaveHoldings(token.id)}
                              className="px-8 py-3 text-black text-lg font-semibold transition-colors"
                              style={{ 
                                backgroundColor: 'var(--accent-primary)',
                                borderRadius: '12px'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditHoldings(token.id, token.holdings)}
                            className="text-left transition-colors"
                            style={{ fontSize: '14px', fontWeight: 400 }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                          >
                            {token.holdings.toFixed(4)}
                          </button>
                        )}
                      </td>

                      {/* Value */}
                      <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px', fontSize: '14px', fontWeight: 400 }}>
                        ${value.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Menu */}
                      <td style={{ paddingLeft: '12px', paddingRight: '24px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(openMenuId === token.id ? null : token.id)
                            }
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                          {openMenuId === token.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              ></div>
                              <div className="absolute right-0 top-8 z-20 w-40 bg-[#2d3139] rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                                <button
                                  onClick={() => handleRemoveToken(token.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors text-red-400"
                                >
                                  Remove
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid rgba(161, 161, 170, 0.2)' }}>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {startIndex + 1} — {Math.min(endIndex, watchlist.length)} of{' '}
              {watchlist.length} results
            </div>
            <div className="flex items-center gap-6">
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {currentPage} of {totalPages} pages
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  fontSize: '14px',
                  color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)',
                  background: 'transparent',
                  border: 'none',
                  padding: 0
                }}
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  fontSize: '14px',
                  color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--text-primary)',
                  background: 'transparent',
                  border: 'none',
                  padding: 0
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
