import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addTokensToWatchlist } from '../../store/portfolioSlice';
import type { Token } from '../../store/portfolioSlice';
import { coinGeckoApi } from '../../services/coinGeckoApi';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTokenModal = ({ isOpen, onClose }: AddTokenModalProps) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Load trending tokens on mount
  useEffect(() => {
    if (isOpen) {
      loadTrendingTokens();
    }
  }, [isOpen]);

  const loadTrendingTokens = async () => {
    setIsLoadingTrending(true);
    try {
      const tokens = await coinGeckoApi.getTrendingTokens();
      setTrendingTokens(tokens);
    } catch (error) {
      console.error('Error loading trending tokens:', error);
    } finally {
      setIsLoadingTrending(false);
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
        try {
          const tokens = await coinGeckoApi.searchTokens(searchQuery);
          setSearchResults(tokens);
          setHasMore(tokens.length >= 20);
        } catch (error) {
          console.error('Error searching tokens:', error);
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
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setIsSearching(true);
      try {
        const nextPage = page + 1;
        const newTokens = await coinGeckoApi.getTopTokens(nextPage, 50);
        if (newTokens.length > 0) {
          setSearchResults((prev) => [...prev, ...newTokens]);
          setPage(nextPage);
          setHasMore(newTokens.length >= 50);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading more tokens:', error);
      } finally {
        setIsSearching(false);
      }
    }
  }, [isSearching, hasMore, page, searchQuery]);

  // Load initial top tokens when no search
  useEffect(() => {
    if (isOpen && !searchQuery && searchResults.length === 0) {
      loadInitialTokens();
    }
  }, [isOpen]);

  const loadInitialTokens = async () => {
    setIsSearching(true);
    try {
      const tokens = await coinGeckoApi.getTopTokens(1, 50);
      setSearchResults(tokens);
      setHasMore(tokens.length >= 50);
    } catch (error) {
      console.error('Error loading initial tokens:', error);
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

  const handleAddToWatchlist = () => {
    const tokensToAdd = [...searchResults, ...trendingTokens].filter((token) =>
      selectedTokens.has(token.id)
    );
    dispatch(addTokensToWatchlist(tokensToAdd));
    setSelectedTokens(new Set());
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setSelectedTokens(new Set());
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
      <div 
        className="flex flex-col w-full modal-container"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          border: '1px solid rgba(161, 161, 170, 0.2)',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.8)',
          maxWidth: '960px',
          maxHeight: '80vh'
        }}
      >
        {/* Search */}
        <div style={{ paddingTop: '12px', paddingRight: '16px', paddingBottom: '12px', paddingLeft: '16px' }}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tokens (e.g., ETH, SOL)..."
              className="w-full px-4 py-3 text-white focus:outline-none transition-colors"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(161, 161, 170, 0.2)',
                borderRadius: '0',
                fontSize: '16px',
                color: 'var(--text-secondary)'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4"
        >
          {/* Trending Section */}
          {!searchQuery && trendingTokens.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Trending</h3>
              <div className="space-y-1">
                {trendingTokens.map((token) => (
                  <TokenRow
                    key={token.id}
                    token={token}
                    isSelected={selectedTokens.has(token.id)}
                    onToggle={() => toggleTokenSelection(token.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search Results / Top Tokens */}
          <div>
            {searchQuery && (
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Search Results</h3>
            )}
            {isSearching && searchResults.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <div className="animate-spin w-8 h-8 border-2 border-[#a3e635] border-t-transparent rounded-full mx-auto mb-2"></div>
                Loading...
              </div>
            ) : searchResults.length === 0 && searchQuery ? (
              <div className="py-12 text-center text-gray-500">No tokens found</div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((token) => (
                  <TokenRow
                    key={token.id}
                    token={token}
                    isSelected={selectedTokens.has(token.id)}
                    onToggle={() => toggleTokenSelection(token.id)}
                  />
                ))}
                {isSearching && searchResults.length > 0 && (
                  <div className="py-4 text-center text-gray-500 text-sm">Loading more...</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between" style={{ 
          borderTop: '1px solid rgba(161, 161, 170, 0.2)',
          backgroundColor: 'var(--neutral-800)',
          paddingTop: '12px',
          paddingRight: '16px',
          paddingBottom: '12px',
          paddingLeft: '16px',
          height: '52px',
          gap: '12px'
        }}>
          <div className="text-sm text-gray-500">
            {selectedTokens.size > 0 ? (
              <>
                {selectedTokens.size} token{selectedTokens.size !== 1 ? 's' : ''} selected
              </>
            ) : (
              'Select tokens to add'
            )}
          </div>
          <button
            onClick={handleAddToWatchlist}
            disabled={selectedTokens.size === 0}
            className="text-black font-semibold transition-colors disabled:cursor-not-allowed"
            style={{
              backgroundColor: selectedTokens.size === 0 ? 'var(--bg-tertiary)' : '#A9E851',
              color: selectedTokens.size === 0 ? 'var(--text-secondary)' : '#000000',
              borderRadius: '12px',
              padding: '10px 24px',
              fontSize: '14px',
              height: '36px'
            }}
            onMouseEnter={(e) => {
              if (selectedTokens.size > 0) {
                e.currentTarget.style.backgroundColor = '#bef264';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTokens.size > 0) {
                e.currentTarget.style.backgroundColor = '#A9E851';
              }
            }}
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

interface TokenRowProps {
  token: Token;
  isSelected: boolean;
  onToggle: () => void;
}

const TokenRow = ({ token, isSelected, onToggle }: TokenRowProps) => {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center transition-colors"
      style={{
        borderRadius: '6px',
        backgroundColor: isSelected ? '#A9E8510F' : 'transparent',
        paddingTop: '8px',
        paddingRight: '8px',
        paddingBottom: '8px',
        paddingLeft: '8px',
        gap: '12px',
        height: '44px'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'rgba(161, 161, 170, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isSelected ? '#A9E8510F' : 'transparent';
      }}
    >
      <img src={token.image} alt={token.name} className="w-8 h-8 rounded-full" />
      <div className="flex-1 text-left">
        <div className="font-medium">{token.name}</div>
        <div className="text-sm text-gray-400">{token.symbol.toUpperCase()}</div>
      </div>
      {isSelected ? (
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#a3e635]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="w-5 h-5 rounded-full border-2 border-[#a3e635] bg-[#a3e635] flex items-center justify-center">
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
      )}
    </button>
  );
};
