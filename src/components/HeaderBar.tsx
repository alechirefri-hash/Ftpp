import React, { useState } from 'react';
import { Search, ChevronDown, Check, SlidersHorizontal, Plus } from 'lucide-react';
import { SortOption } from '../types';

interface HeaderBarProps {
  totalCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  onOpenAddModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  totalCount,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenAddModal,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortLabels: Record<SortOption, string> = {
    default: 'Default',
    recientes: 'Recientes',
    rating: 'Mejor puntuación',
    horas: 'Más horas',
    titulo: 'Título (A - Z)',
  };

  const sortOptions: SortOption[] = ['default', 'recientes', 'rating', 'horas', 'titulo'];

  return (
    <header className="pt-5 pb-4 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Title Header with Purple Indicator (as shown in screenshot) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Vertical Purple Accent Bar */}
          <span className="w-1.5 h-7 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/50" />
          
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase font-['Space_Grotesk']">
            GAME LIBRARY
          </h1>

          <span className="text-slate-400 font-normal text-lg sm:text-xl ml-1">
            ({totalCount})
          </span>
        </div>

        {/* Add game button */}
        <button
          id="btn-add-game"
          type="button"
          onClick={onOpenAddModal}
          className="px-3 py-1.5 bg-[#171c2c] hover:bg-purple-600/20 border border-[#252e46] hover:border-purple-500/40 text-purple-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">Añadir juego</span>
        </button>
      </div>

      {/* Search Input Box */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="game-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title..."
          className="w-full pl-11 pr-10 py-3 bg-[#121522] border border-[#1f2638] focus:border-purple-500/80 text-white placeholder-slate-500 text-sm rounded-2xl outline-none transition-all shadow-inner focus:ring-1 focus:ring-purple-500/30"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded-md"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Filter / Sort Row (Screenshot shows "Default ⌄" in dark rounded box) */}
      <div className="flex items-center justify-between relative">
        <div className="relative inline-block">
          <button
            id="sort-dropdown-trigger"
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121522] hover:bg-[#181c2c] border border-[#1f2638] text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>{sortLabels[sortBy]}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isSortOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Sort Dropdown Menu */}
          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsSortOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-48 bg-[#121624] border border-[#222a3d] rounded-xl shadow-2xl p-1 z-30 backdrop-blur-md">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onSortChange(opt);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left cursor-pointer ${
                      sortBy === opt
                        ? 'bg-purple-600/20 text-purple-300 font-semibold'
                        : 'text-slate-300 hover:bg-[#1b2135] hover:text-white'
                    }`}
                  >
                    <span>{sortLabels[opt]}</span>
                    {sortBy === opt && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
