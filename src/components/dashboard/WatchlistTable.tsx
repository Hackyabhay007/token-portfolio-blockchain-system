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
  const itemsPerPage = 8;

  const totalPages = Math.max(1, Math.ceil(watchlist.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTokens = watchlist.slice(startIndex, endIndex);
  
  // Reset to page 1 if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

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
                          <div className="flex items-center" style={{ gap: '8px' }}>
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, token.id)}
                              className="text-sm focus:outline-none appearance-none"
                              style={{ 
                                width: '109px',
                                height: '32px',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                backgroundColor: 'var(--bg-tertiary)', 
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                boxShadow: '0px 0px 0px 1px #A9E851, 0px 0px 0px 4px #A9E85133'
                              }}
                              placeholder="0.0000"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveHoldings(token.id)}
                              className="text-black text-sm font-semibold transition-colors"
                              style={{ 
                                width: '51px',
                                height: '32px',
                                backgroundColor: 'var(--accent-primary)',
                                borderRadius: '6px',
                                paddingTop: '6px',
                                paddingBottom: '6px',
                                paddingLeft: '10px',
                                paddingRight: '10px'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div style={{ fontSize: '14px', fontWeight: 400 }}>
                            {token.holdings.toFixed(4)}
                          </div>
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
                            className="transition-opacity hover:opacity-80"
                          >
                            <img src="/icons/three-dots.svg" alt="Menu" style={{ width: '24px', height: '24px' }} />
                          </button>

                          {openMenuId === token.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              ></div>
                              <div 
                                className="absolute z-20 overflow-hidden" 
                                style={{ 
                                  width: '144px',
                                  height: '72px',
                                  backgroundColor: '#27272A', 
                                  borderRadius: '8px',
                                  padding: '4px',
                                  boxShadow: '0px 0px 0px 1px #00000014, 0px 4px 8px 0px #00000014, 0px 8px 16px 0px #00000014',
                                  top: '50%',
                                  right: '28px',
                                  transform: 'translateY(-50%)'
                                }}
                              >
                                <button
                                  onClick={() => {
                                    handleEditHoldings(token.id, token.holdings);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left text-sm transition-colors flex items-center gap-2"
                                  style={{ 
                                    color: 'var(--text-primary)', 
                                    height: '32px',
                                    padding: '8px',
                                    borderRadius: '4px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(161, 161, 170, 0.1)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <img src="/icons/edit.svg" alt="Edit" style={{ width: '15px', height: '16px' }} />
                                  Edit Holdings
                                </button>
                                <div style={{ 
                                  width: '152px', 
                                  height: '1px', 
                                  backgroundColor: '#212124',
                                  marginLeft: '-8px'
                                }}></div>
                                <button
                                  onClick={() => handleRemoveToken(token.id)}
                                  className="w-full text-left text-sm transition-colors flex items-center gap-2"
                                  style={{ 
                                    color: '#FB7185',
                                    height: '32px',
                                    padding: '8px',
                                    borderRadius: '4px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(161, 161, 170, 0.1)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <img src="/icons/delete.svg" alt="Delete" style={{ width: '15px', height: '16px' }} />
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
