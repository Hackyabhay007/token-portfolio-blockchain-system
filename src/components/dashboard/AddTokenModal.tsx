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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: '#212124D9' }}
      onClick={handleClose}
    >
      <div 
        className="flex flex-col modal-container w-full sm:w-[640px]"
        style={{
          backgroundColor: '#212124',
          borderRadius: '12px',
          boxShadow: '0px 0px 0px 1px #18181B inset, 0px 0px 0px 1.5px #FFFFFF0F inset, 0px -1px 0px 0px #FFFFFF0A, 0px 0px 0px 1px #FFFFFF1A, 0px 4px 8px 0px #00000052, 0px 8px 16px 0px #00000052',
          maxWidth: '640px',
          height: '480px',
          maxHeight: '90vh',
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
          backgroundColor: '#FFFFFF1A'
        }}></div>

        {/* Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#FFFFFF1A transparent'
          }}
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
          borderTop: '1px solid #FFFFFF1A',
          backgroundColor: '#27272A',
          paddingTop: '12px',
          paddingRight: '16px',
          paddingBottom: '12px',
          paddingLeft: '16px',
          height: '56px',
          gap: '12px',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
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
            className="font-medium transition-colors disabled:cursor-not-allowed"
            style={{
              backgroundColor: selectedTokens.size === 0 ? 'var(--bg-tertiary)' : '#A9E851',
              color: selectedTokens.size === 0 ? 'var(--text-secondary)' : '#000000',
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
              boxShadow: selectedTokens.size === 0 ? 'none' : '0px 0.75px 0px 0px #FFFFFF33 inset, 0px 1px 2px 0px #1F661966, 0px 0px 0px 1px #1F6619'
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
      className="flex items-center transition-colors w-full"
      style={{
        maxWidth: '624px',
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
            backgroundColor: '#A9E851',
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
