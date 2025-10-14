import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { updateHoldings, removeTokenFromWatchlist } from '../store/portfolioSlice';
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
    <div className="bg-[#23262f] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#a3e635]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xl font-semibold">Watchlist</span>
        </div>
      </div>

      {/* Table */}
      {watchlist.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-500">
          No tokens in watchlist. Click "Add Token" to get started.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="px-6 py-3 font-medium">Token</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">24h %</th>
                  <th className="px-6 py-3 font-medium">Sparkline (7d)</th>
                  <th className="px-6 py-3 font-medium">Holdings</th>
                  <th className="px-6 py-3 font-medium">Value</th>
                  <th className="px-6 py-3 font-medium"></th>
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
                      className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Token */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={token.image}
                            alt={token.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-gray-400">
                              {token.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-medium">
                        ${token.current_price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* 24h % */}
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            isPositive ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {token.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>

                      {/* Sparkline */}
                      <td className="px-6 py-4">
                        <div className="w-32 h-12">
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
                      <td className="px-6 py-4">
                        {editingId === token.id ? (
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, token.id)}
                                className="w-32 px-3 py-1.5 bg-[#2d3139] border border-gray-600 rounded-md text-sm focus:outline-none focus:border-[#a3e635] appearance-none"
                                placeholder="Select"
                                autoFocus
                              />
                              <svg
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
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
                              className="px-4 py-1.5 bg-[#a3e635] text-black text-sm font-semibold rounded-md hover:bg-[#bef264] transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditHoldings(token.id, token.holdings)}
                            className="text-left hover:text-[#a3e635] transition-colors"
                          >
                            {token.holdings.toFixed(4)}
                          </button>
                        )}
                      </td>

                      {/* Value */}
                      <td className="px-6 py-4 font-medium">
                        ${value.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Menu */}
                      <td className="px-6 py-4">
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
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
            <div className="text-sm text-gray-400">
              {startIndex + 1} — {Math.min(endIndex, watchlist.length)} of{' '}
              {watchlist.length} results
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-400 mr-2">
                {currentPage} of {totalPages} pages
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
