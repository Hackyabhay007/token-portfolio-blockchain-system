import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { updateHoldings, removeTokenFromWatchlist } from '../../store/portfolioSlice';
import { Sparkline } from './Sparkline';
import { TokenImage } from '../common/TokenImage';
import type { WatchlistToken } from '../../types';

interface WatchlistTableProps {
  onAddToken?: () => void;
}

export const WatchlistTable = ({ onAddToken }: WatchlistTableProps = {}) => {
  const dispatch = useDispatch();
  const { watchlist } = useSelector((state: RootState) => state.portfolio);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(watchlist.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTokens = watchlist.slice(startIndex, endIndex);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);
  
  // Reset to page 1 if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const handleEditHoldings = (id: string, currentHoldings: number) => {
    setOpenMenuId(null); // Close menu when editing
    setEditingId(id);
    // Show current value if greater than 0, otherwise empty
    setEditValue(currentHoldings > 0 ? currentHoldings.toString() : '');
  };

  const handleSaveHoldings = async (id: string) => {
    if (!editValue || editValue.trim() === '') return; // Don't save if empty
    setIsSaving(true);
    const value = parseFloat(editValue) || 0;
    dispatch(updateHoldings({ id, holdings: value }));
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSaving(false);
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' && editValue && editValue.trim() !== '') {
      handleSaveHoldings(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleRemoveToken = (id: string) => {
    setRemovingId(id);
    setOpenMenuId(null);
    // Wait for animation to complete before removing
    setTimeout(() => {
      dispatch(removeTokenFromWatchlist(id));
      setRemovingId(null);
    }, 200);
  };

  return (
    <div className="overflow-hidden animate-fade-in" style={{ backgroundColor: 'var(--neutral-800)', borderRadius: '12px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(161, 161, 170, 0.2)' }}>
      {/* Table */}
      {watchlist.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <button
            onClick={onAddToken}
            className="transition-all"
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(169, 232, 81, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(169, 232, 81, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(169, 232, 81, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8V24M8 16H24" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={{ 
            color: 'var(--text-primary)', 
            fontSize: '18px', 
            fontWeight: 500,
            marginBottom: '8px'
          }}>
            No tokens in watchlist
          </div>
          <div style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '14px'
          }}>
            Click "Add Token" to start tracking your portfolio
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto lg:overflow-x-visible">
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
                {currentTokens.map((token: WatchlistToken) => {
                  const value = token.holdings * token.current_price;
                  const isPositive = token.price_change_percentage_24h >= 0;
                  const sparklineColor = isPositive ? 'var(--color-success)' : 'var(--color-error)';

                  return (
                    <tr
                      key={token.id}
                      className={`transition-colors ${removingId === token.id ? 'animate-row-out' : 'animate-row-in'}`}
                      style={{ 
                        backgroundColor: 'var(--bg-primary)',
                        height: '48px',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        transform: editingId === token.id ? 'scale(1.01)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => {
                        // Close menu when clicking on any row
                        if (openMenuId !== null) {
                          setOpenMenuId(null);
                        }
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(161, 161, 170, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                    >
                      {/* Token */}
                      <td style={{ paddingLeft: '24px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                          <TokenImage src={token.image} alt={token.name} symbol={token.symbol} variant="table" />
                          <div style={{ fontSize: '14px', fontWeight: 400 }}>
                            {token.name} <span style={{ color: 'var(--text-secondary)' }}>({token.symbol.toUpperCase()})</span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ 
                        paddingLeft: '12px', 
                        paddingRight: '12px', 
                        paddingTop: '12px', 
                        paddingBottom: '12px', 
                        fontSize: '13px', 
                        fontWeight: 400,
                        lineHeight: '20px',
                        letterSpacing: '0%',
                        color: 'var(--text-secondary)'
                      }}>
                        ${token.current_price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* 24h % */}
                      <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 400,
                            lineHeight: '20px',
                            letterSpacing: '0%',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {isPositive ? '+' : ''}
                          {token.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>

                      {/* Sparkline */}
                      <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <div className="w-32 h-10" style={{ outline: 'none' }}>
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
                      <td style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px', paddingBottom: '12px', width: '180px' }}>
                        {editingId === token.id ? (
                          <div className="flex items-center animate-scale-in" style={{ gap: '8px' }}>
                            <div className="number-input-wrapper">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Only allow numbers and limit to 5 digits before decimal
                                  if (value === '' || /^\d{0,5}(\.\d*)?$/.test(value)) {
                                    setEditValue(value);
                                  }
                                }}
                                onKeyDown={(e) => handleKeyPress(e, token.id)}
                                onBlur={(e) => {
                                  // Don't close if clicking on spinner buttons
                                  if (!e.relatedTarget?.classList.contains('spinner-button')) {
                                    if (!editValue || editValue.trim() === '') {
                                      setTimeout(() => setEditingId(null), 150);
                                    }
                                  }
                                }}
                                className="text-sm focus:outline-none"
                                style={{ 
                                  width: '109px',
                                  height: '32px',
                                  paddingLeft: '8px',
                                  paddingRight: '28px',
                                  backgroundColor: 'var(--bg-tertiary)', 
                                  borderRadius: '6px',
                                  color: 'var(--text-primary)',
                                  boxShadow: '0px 0px 0px 1px var(--accent-primary), 0px 0px 0px 4px var(--accent-shadow)',
                                  transition: 'all 0.2s ease'
                                }}
                                placeholder="Enter amount"
                                min="0"
                                max="99999"
                                step="any"
                                autoFocus
                              />
                              <div className="number-spinner">
                                <button
                                  type="button"
                                  className="spinner-button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    const currentVal = parseFloat(editValue) || 0;
                                    if (currentVal < 99999) {
                                      setEditValue((currentVal + 1).toString());
                                    }
                                  }}
                                >
                                  <svg viewBox="0 0 8 6" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 0L8 6H0L4 0Z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  className="spinner-button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    const currentVal = parseFloat(editValue) || 0;
                                    if (currentVal > 0) {
                                      setEditValue(Math.max(0, currentVal - 1).toString());
                                    }
                                  }}
                                >
                                  <svg viewBox="0 0 8 6" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L0 0H8L4 6Z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => handleSaveHoldings(token.id)}
                              disabled={isSaving || !editValue || editValue.trim() === ''}
                              className="text-black text-sm font-semibold transition-colors flex items-center justify-center"
                              style={{ 
                                width: '51px',
                                height: '32px',
                                backgroundColor: (isSaving || !editValue || editValue.trim() === '') ? 'var(--bg-secondary)' : 'var(--accent-primary)',
                                color: (isSaving || !editValue || editValue.trim() === '') ? 'var(--text-secondary)' : 'var(--color-black)',
                                borderRadius: '6px',
                                paddingTop: '6px',
                                paddingBottom: '6px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                opacity: isSaving ? 0.7 : 1,
                                cursor: (isSaving || !editValue || editValue.trim() === '') ? 'not-allowed' : 'pointer',
                                border: (isSaving || !editValue || editValue.trim() === '') ? '1px solid var(--border-light)' : 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSaving && editValue && editValue.trim() !== '') {
                                  e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSaving && editValue && editValue.trim() !== '') {
                                  e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                                }
                              }}
                            >
                              {isSaving ? (
                                <div className="animate-spin" style={{ width: '14px', height: '14px', border: '2px solid var(--text-secondary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                              ) : (
                                'Save'
                              )}
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="animate-fade-in"
                            style={{ 
                              fontSize: '13px', 
                              fontWeight: 400,
                              lineHeight: '20px',
                              letterSpacing: '0%',
                              color: 'var(--text-bright)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {token.holdings.toFixed(4)}
                          </div>
                        )}
                      </td>

                      {/* Value */}
                      <td style={{ 
                        paddingLeft: '12px', 
                        paddingRight: '12px', 
                        paddingTop: '12px', 
                        paddingBottom: '12px', 
                        fontSize: '13px', 
                        fontWeight: 400,
                        lineHeight: '20px',
                        letterSpacing: '0%',
                        color: 'var(--text-bright)'
                      }}>
                        ${value.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Menu */}
                      <td style={{ paddingLeft: '12px', paddingRight: '24px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === token.id ? null : token.id);
                            }}
                            className="transition-all hover:opacity-80 hover:bg-opacity-10 flex items-center justify-center"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(161, 161, 170, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <img src="/icons/three-dots.svg" alt="Menu" style={{ width: '18px', height: '18px' }} />
                          </button>

                          {openMenuId === token.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              ></div>
                              <div 
                                className="absolute z-20 overflow-hidden animate-slide-down" 
                                style={{ 
                                  width: '144px',
                                  backgroundColor: 'var(--bg-secondary)', 
                                  borderRadius: '8px',
                                  padding: '4px',
                                  boxShadow: '0px 0px 0px 1px var(--shadow-darker), 0px 4px 8px 0px var(--shadow-darker), 0px 8px 16px 0px var(--shadow-darker)',
                                  top: '50%',
                                  right: '28px',
                                  transform: 'translateY(-50%)'
                                }}
                              >
                                <button
                                  onClick={() => {
                                    handleEditHoldings(token.id, token.holdings);
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
                                  backgroundColor: 'var(--bg-divider)',
                                  marginLeft: '-8px'
                                }}></div>
                                <button
                                  onClick={() => handleRemoveToken(token.id)}
                                  className="w-full text-left text-sm transition-colors flex items-center gap-2"
                                  style={{ 
                                    color: 'var(--color-warning)',
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
