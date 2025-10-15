import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { addTokensToWatchlist } from '../../store/portfolioSlice';
import type { Token, AddTokenModalProps, TokenRowProps } from '../../types';
import { coinGeckoApi } from '../../services/coinGeckoApi';
import { TokenImage } from '../common/TokenImage';

export const AddTokenModal = ({ isOpen, onClose }: AddTokenModalProps) => {
  const dispatch = useDispatch();
  const { watchlist } = useSelector((state: RootState) => state.portfolio);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loadedTokenIds, setLoadedTokenIds] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Get scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      // Add padding to prevent layout shift when scrollbar disappears
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Load trending tokens on mount
  useEffect(() => {
    if (isOpen) {
      loadTrendingTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, watchlist.length]);

  const loadTrendingTokens = async () => {
    try {
      const tokens = await coinGeckoApi.getTrendingTokens();
      // Filter out already added tokens
      const filteredTokens = tokens.filter(
        (token: Token) => !watchlist.some((w: { id: string }) => w.id === token.id)
      );
      setTrendingTokens(filteredTokens);
    } catch (error) {
      console.error('Error loading trending tokens:', error);
      // Silently fail - trending is optional
    }
  };

  // Search tokens with debounce
  useEffect(() => {
    if (searchQuery.trim()) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        setPage(1);
        setError(null);
        try {
          const tokens = await coinGeckoApi.searchTokens(searchQuery);
          // Filter out already added tokens
          const filteredTokens = tokens.filter(
            (token: Token) => !watchlist.some((w: { id: string }) => w.id === token.id)
          );
          setSearchResults(filteredTokens);
          setLoadedTokenIds(new Set(filteredTokens.map(t => t.id)));
          setHasMore(tokens.length >= 20);
        } catch (error) {
          console.error('Error searching tokens:', error);
          setError('Failed to search tokens. Please try again.');
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setPage(1);
      setHasMore(true);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Infinite scroll handler
  const handleScroll = useCallback(async () => {
    const container = scrollContainerRef.current;
    if (!container || isSearching || !hasMore || searchQuery.trim()) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    // Trigger earlier - when 80% scrolled instead of 150%
    if (scrollHeight - scrollTop <= clientHeight * 1.2) {
      setIsSearching(true);
      try {
        const nextPage = page + 1;
        const newTokens = await coinGeckoApi.getTopTokens(nextPage, 50);
        // Filter out already added tokens
        const filteredTokens = newTokens.filter(
          (token: Token) => !watchlist.some((w: { id: string }) => w.id === token.id)
        );
        if (filteredTokens.length > 0) {
          // Add small delay for smoother transition
          await new Promise(resolve => setTimeout(resolve, 150));
          setSearchResults((prev) => [...prev, ...filteredTokens]);
          // Mark new tokens as not loaded yet so they animate
          setTimeout(() => {
            setLoadedTokenIds((prev) => new Set([...prev, ...filteredTokens.map(t => t.id)]));
          }, 50);
          setPage(nextPage);
          setHasMore(newTokens.length >= 50);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading more tokens:', error);
        setError('Failed to load more tokens');
      } finally {
        setIsSearching(false);
      }
    }
  }, [isSearching, hasMore, page, searchQuery, watchlist]);

  // Load initial top tokens when no search
  useEffect(() => {
    if (isOpen && !searchQuery && searchResults.length === 0) {
      loadInitialTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, watchlist.length]);

  const loadInitialTokens = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const tokens = await coinGeckoApi.getTopTokens(1, 50);
      // Filter out already added tokens
      const filteredTokens = tokens.filter(
        (token: Token) => !watchlist.some((w: { id: string }) => w.id === token.id)
      );
      setSearchResults(filteredTokens);
      setHasMore(tokens.length >= 50);
      setLoadedTokenIds(new Set(filteredTokens.map(t => t.id)));
    } catch (error) {
      console.error('Error loading initial tokens:', error);
      setError('Failed to load tokens. Please check your connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleTokenSelection = (tokenId: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(tokenId)) {
      newSelected.delete(tokenId);
    } else {
      newSelected.add(tokenId);
    }
    setSelectedTokens(newSelected);
  };

  const handleAddToWatchlist = async () => {
    setIsAdding(true);
    const tokensToAdd = [...searchResults, ...trendingTokens].filter((token) =>
      selectedTokens.has(token.id)
    );
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch(addTokensToWatchlist(tokensToAdd));
    setSelectedTokens(new Set());
    setSearchQuery('');
    setIsAdding(false);
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before closing
    setTimeout(() => {
      setSelectedTokens(new Set());
      setSearchQuery('');
      setSearchResults([]);
      setLoadedTokenIds(new Set());
      setIsClosing(false);
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ backgroundColor: 'var(--bg-overlay)' }}
      onClick={handleClose}
    >
      <div 
        className={`flex flex-col modal-container w-full sm:w-[640px] ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          boxShadow: '0px 0px 0px 1px var(--bg-dark) inset, 0px 0px 0px 1.5px #FFFFFF0F inset, 0px -1px 0px 0px #FFFFFF0A, 0px 0px 0px 1px var(--border-light), 0px 4px 8px 0px var(--shadow-dark), 0px 8px 16px 0px var(--shadow-dark)',
          maxWidth: '640px',
          height: '480px',
          justifyContent: 'space-between'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div style={{ 
          width: '100%',
          height: '52px',
          gap: '12px',
          paddingTop: '12px', 
          paddingRight: '16px', 
          paddingBottom: '12px', 
          paddingLeft: '16px'
        }}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tokens (e.g., ETH, SOL)..."
              className="w-full focus:outline-none transition-colors"
              style={{
                height: '28px',
                gap: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0',
                fontSize: '16px',
                color: 'var(--text-secondary)',
                padding: 0
              }}
            />
          </div>
        </div>
        
        {/* Divider */}
        <div style={{ 
          width: '100%', 
          height: '1px', 
          backgroundColor: 'var(--border-light)'
        }}></div>

        {/* Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border-light) transparent',
            minHeight: '320px',
            scrollBehavior: 'smooth'
          }}
        >
          {/* Trending Section */}
          {!searchQuery && trendingTokens.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Trending</h3>
              <div className="space-y-1">
                {trendingTokens.map((token, index) => (
                  <TokenRow
                    key={token.id}
                    token={token}
                    isSelected={selectedTokens.has(token.id)}
                    onToggle={() => toggleTokenSelection(token.id)}
                    index={index}
                    animate={!loadedTokenIds.has(token.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search Results / Top Tokens */}
          <div>
            {searchQuery && (
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Search Results</h3>
            )}
            {error ? (
              <div className="py-12 text-center">
                <div className="text-sm mb-3" style={{ color: 'var(--color-error)' }}>{error}</div>
                <button
                  onClick={() => {
                    if (searchQuery) {
                      setSearchQuery('');
                      setError(null);
                    } else {
                      loadInitialTokens();
                    }
                  }}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--accent-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  {searchQuery ? 'Clear search' : 'Try again'}
                </button>
              </div>
            ) : isSearching && searchResults.length === 0 ? (
              <div className="py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                <div className="animate-spin w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full mx-auto mb-2"></div>
                <div className="text-sm">Loading...</div>
              </div>
            ) : searchResults.length === 0 && searchQuery ? (
              <div className="py-12 text-center">
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No tokens found</div>
                <div className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Try a different search term</div>
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((token, index) => (
                  <TokenRow
                    key={token.id}
                    token={token}
                    isSelected={selectedTokens.has(token.id)}
                    onToggle={() => toggleTokenSelection(token.id)}
                    index={index}
                    animate={!loadedTokenIds.has(token.id)}
                  />
                ))}
                {isSearching && searchResults.length > 0 && (
                  <div className="py-4 flex items-center justify-center gap-2 animate-fade-in" style={{ color: 'var(--text-secondary)' }}>
                    <div className="animate-spin" style={{ 
                      width: '14px', 
                      height: '14px', 
                      border: '2px solid rgba(169, 232, 81, 0.3)',
                      borderTopColor: 'var(--accent-primary)',
                      borderRadius: '50%'
                    }}></div>
                    <span className="text-sm">Loading more...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end" style={{ 
          borderTop: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-secondary)',
          paddingTop: '12px',
          paddingRight: '16px',
          paddingBottom: '12px',
          paddingLeft: '16px',
          height: '56px',
          gap: '12px',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }}>
          <button
            onClick={handleAddToWatchlist}
            disabled={selectedTokens.size === 0 || isAdding}
            className="font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              backgroundColor: selectedTokens.size === 0 || isAdding ? 'var(--bg-secondary)' : 'var(--accent-primary)',
              color: selectedTokens.size === 0 || isAdding ? 'var(--text-secondary)' : 'var(--color-black)',
              borderRadius: '6px',
              paddingTop: '6px',
              paddingBottom: '6px',
              paddingLeft: '10px',
              paddingRight: '10px',
              fontSize: '13px',
              height: '32px',
              width: '114px',
              gap: '6px',
              fontWeight: 500,
              lineHeight: '20px',
              letterSpacing: '0%',
              border: selectedTokens.size === 0 || isAdding ? '1px solid var(--border-light)' : 'none',
              boxShadow: selectedTokens.size === 0 || isAdding ? 'none' : '0px 0.75px 0px 0px var(--shadow-inset) inset, 0px 1px 2px 0px var(--accent-border-light), 0px 0px 0px 1px var(--accent-border)',
              opacity: isAdding ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (selectedTokens.size > 0 && !isAdding) {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTokens.size > 0 && !isAdding) {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              }
            }}
          >
            {isAdding ? (
              <div className="animate-spin" style={{ width: '14px', height: '14px', border: '2px solid var(--text-secondary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
            ) : (
              'Add to Wishlist'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const TokenRow = ({ token, isSelected, onToggle, index = 0, animate = false }: TokenRowProps) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center transition-colors w-full ${animate ? 'animate-modal-row' : ''}`}
      style={{
        maxWidth: '624px',
        borderRadius: '6px',
        backgroundColor: isSelected ? 'var(--accent-selected)' : 'transparent',
        paddingTop: '8px',
        paddingRight: '8px',
        paddingBottom: '8px',
        paddingLeft: '8px',
        gap: '8px',
        height: '44px',
        ...(animate && { animationDelay: `${Math.min(index * 0.02, 0.5)}s` })
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'rgba(161, 161, 170, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isSelected ? 'var(--accent-selected)' : 'transparent';
      }}
    >
      <TokenImage src={token.image} alt={token.name} symbol={token.symbol} variant="modal" />
      <div className="flex-1 text-left" style={{ 
        fontWeight: 400, 
        fontSize: '14px', 
        lineHeight: '20px', 
        letterSpacing: '0%' 
      }}>
        <div style={{ fontWeight: 400 }}>{token.name}</div>
        <div className="text-sm text-gray-400">{token.symbol.toUpperCase()}</div>
      </div>
      {isSelected ? (
        <div className="flex items-center" style={{ gap: '6px' }}>
          <img src="/icons/star.svg" alt="Star" style={{ width: '15px', height: '15px', flexShrink: 0 }} />
          <div className="rounded-full flex items-center justify-center" style={{ 
            width: '15px', 
            height: '15px',
            minWidth: '15px',
            minHeight: '15px',
            backgroundColor: 'var(--accent-primary)',
            flexShrink: 0
          }}>
            <img src="/icons/check.svg" alt="Check" style={{ width: '9px', height: '9px' }} />
          </div>
        </div>
      ) : (
        <img src="/icons/circle.svg" alt="Circle" style={{ width: '15px', height: '15px', minWidth: '15px', minHeight: '15px', flexShrink: 0 }} />
      )}
    </button>
  );
};
