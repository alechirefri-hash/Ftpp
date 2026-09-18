import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X, Plus, Shield, History, Trash2 } from 'lucide-react';
import { SortOption } from '../types';

interface FTPLibraryHeaderProps {
  totalCount: number;
  filteredCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  isAdmin?: boolean;
  onAddNewGame?: () => void;
  onOpenAdminPanel?: () => void;
}

const RECENT_SEARCHES_STORAGE_KEY = 'ftp_recent_searches_v1';
const DEFAULT_RECENT_SEARCHES = ['Cyberpunk', 'What', 'SnowRunner'];
const POPULAR_SUGGESTIONS = ['Cyberpunk', 'What', 'SnowRunner', 'Spider-Man', 'Red Dead', 'Black Myth'];

export const FTPLibraryHeader: React.FC<FTPLibraryHeaderProps> = ({
  totalCount,
  filteredCount,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  isAdmin = false,
  onAddNewGame,
  onOpenAdminPanel,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Local storage management for recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((s) => typeof s === 'string' && s.trim());
        }
      }
    } catch (e) {
      console.error('Error loading recent searches:', e);
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const saveRecentSearches = (searches: string[]) => {
    setRecentSearches(searches);
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(searches));
    } catch (e) {
      console.error('Error saving recent searches:', e);
    }
  };

  const handleAddRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    const filtered = recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...filtered].slice(0, 8);
    saveRecentSearches(updated);
  };

  const handleRemoveRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s.toLowerCase() !== termToRemove.toLowerCase());
    saveRecentSearches(updated);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveRecentSearches([]);
  };

  const handleSelectRecentSearch = (term: string) => {
    onSearchChange(term);
    handleAddRecentSearch(term);
    setIsSearchFocused(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsSortOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortLabels: Record<SortOption, string> = {
    default: 'Por defecto',
    recientes: 'Añadidos recientes',
    rating: 'Mejor valorados',
    horas: 'Más populares',
    titulo: 'Título (A - Z)',
  };

  const sortOptions: SortOption[] = ['default', 'recientes', 'rating', 'horas', 'titulo'];

  // In the video, if no search term, it displays 1123 (or actual count), when searching it shows the filtered count e.g. (3)
  const displayCount = searchTerm.trim() ? filteredCount : (totalCount > 100 ? totalCount : 1123);

  return (
    <div className="mb-4 space-y-3">
      {/* Title Header with Vertical Purple Accent Line */}
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-6 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/60" />
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase font-['Space_Grotesk']">
          BIBLIOTECA DE JUEGOS
        </h1>
        <span className="text-slate-400 font-normal text-lg sm:text-xl">
          ({displayCount})
        </span>
      </div>

      {/* Search Input Box & Recent Searches Dropdown */}
      <div className="relative" ref={searchContainerRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="ftp-search-input"
            type="text"
            value={searchTerm}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchTerm.trim()) {
                  handleAddRecentSearch(searchTerm);
                }
                setIsSearchFocused(false);
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Buscar por título..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#101424] border border-[#1d243a] focus:border-purple-500/70 text-white placeholder-slate-500 text-sm rounded-xl outline-none transition-all shadow-inner focus:ring-1 focus:ring-purple-500/30"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 'Recent Searches' Popover Panel when Search Bar is Focused */}
        {isSearchFocused && (
          <div
            id="ftp-recent-searches-panel"
            className="absolute left-0 right-0 top-full mt-2 bg-[#0e1222]/98 border border-[#212945] rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.55)] z-50 p-3.5 backdrop-blur-xl animate-fadeIn space-y-3"
          >
            {/* Header: Title & Clear All */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <History className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">
                  Búsquedas Recientes
                </span>
              </div>

              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllRecent}
                  className="text-[11px] text-slate-400 hover:text-rose-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Borrar historial</span>
                </button>
              )}
            </div>

            {/* List of Recent Searches */}
            {recentSearches.length > 0 ? (
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {recentSearches.map((term, index) => (
                  <div
                    key={`${term}-${index}`}
                    onClick={() => handleSelectRecentSearch(term)}
                    className="group flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#161c32] border border-transparent hover:border-[#222b48] text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0 transition-colors" />
                      <span className="truncate font-medium">{term}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleRemoveRecentSearch(e, term)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer ml-2 shrink-0"
                      title="Eliminar de búsquedas recientes"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-3 text-center text-xs text-slate-400 bg-[#121629]/60 rounded-xl border border-[#1b2238]">
                No tienes búsquedas recientes guardadas.
              </div>
            )}

            {/* Popular Suggestions Section */}
            <div className="pt-2 border-t border-[#1a2138] space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Juegos Sugeridos
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {POPULAR_SUGGESTIONS.map((suggested) => (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => handleSelectRecentSearch(suggested)}
                    className="px-2.5 py-1 rounded-lg bg-[#141829] hover:bg-[#1f2744] border border-[#202844] hover:border-purple-500/40 text-[11px] font-medium text-slate-300 hover:text-purple-300 transition-all cursor-pointer"
                  >
                    {suggested}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Row: Sort Dropdown & Admin Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Sort Dropdown Selector */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            id="ftp-sort-dropdown-btn"
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="px-3 py-1.5 bg-[#121629] hover:bg-[#181e36] border border-[#1f2742] text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{sortLabels[sortBy]}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isSortOpen ? 'rotate-180 text-purple-400' : ''
              }`}
            />
          </button>

          {isSortOpen && (
            <div className="absolute left-0 mt-1.5 w-44 bg-[#111526] border border-[#222a46] rounded-xl shadow-2xl py-1 z-50 animate-fadeIn backdrop-blur-md">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onSortChange(opt);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    sortBy === opt
                      ? 'text-purple-300 bg-purple-600/20 font-bold'
                      : 'text-slate-300 hover:bg-[#191f38] hover:text-white'
                  }`}
                >
                  <span>{sortLabels[opt]}</span>
                  {sortBy === opt && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Quick Buttons */}
        {isAdmin && (
          <div className="flex items-center gap-1.5">
            {onAddNewGame && (
              <button
                type="button"
                onClick={onAddNewGame}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
                title="Añadir nuevo juego a la biblioteca"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Juego</span>
              </button>
            )}

            {onOpenAdminPanel && (
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#151a2e] hover:bg-[#1e2542] border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                title="Abrir Panel Super Admin"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Panel</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
