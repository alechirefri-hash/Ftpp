import React, { useState } from 'react';
import { Search, ChevronDown, Check, SlidersHorizontal, Radio, Hash, Sparkles } from 'lucide-react';
import { SortStatusOption } from '../types';

interface DashboardHeaderProps {
  totalProfilesCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  sortStatus: SortStatusOption;
  onSortStatusChange: (val: SortStatusOption) => void;
  onChannelClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalProfilesCount,
  searchTerm,
  onSearchChange,
  sortStatus,
  onSortStatusChange,
  onChannelClick,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions: { id: SortStatusOption; label: string }[] = [
    { id: 'all', label: 'All Statuses' },
    { id: 'synced', label: 'SYNCED (Operational)' },
    { id: 'action_required', label: 'ACTION REQUIRED (Key Needed)' },
    { id: 'waiting', label: 'WAITING... (Processing)' },
    { id: 'favorites', label: 'Favorites First' },
    { id: 'az', label: 'Alphabetical (A - Z)' },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.id === sortStatus)?.label || 'Sort by Status';

  return (
    <header className="pt-5 pb-3 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-3">
      {/* Screen Header: GAME LIBRARY (24 PROFILES) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Vertical Purple Indicator */}
          <span className="w-1.5 h-7 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/60" />

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase font-['Space_Grotesk']">
            GAME LIBRARY{' '}
            <span className="text-slate-400 font-normal text-lg sm:text-xl ml-1 font-mono">
              ({totalProfilesCount} PROFILES)
            </span>
          </h1>
        </div>

        {/* Live sync pulse badge */}
        <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-[#131726] border border-[#20273c] rounded-full text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>NETWORK ONLINE</span>
        </div>
      </div>

      {/* Search Bar titled 'Search by profile or status...' */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="profile-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by profile or status..."
          className="w-full pl-11 pr-10 py-3 bg-[#121522] border border-[#1f2638] focus:border-purple-500/80 text-white placeholder-slate-500 text-sm rounded-2xl outline-none transition-all shadow-inner focus:ring-1 focus:ring-purple-500/30 font-medium"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded-md"
          >
            Clear
          </button>
        )}
      </div>

      {/* Dropdown for 'Sort by Status' */}
      <div className="flex items-center justify-between">
        <div className="relative inline-block">
          <button
            id="sort-status-dropdown-btn"
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121522] hover:bg-[#181d2e] border border-[#1f2638] text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold text-white">Sort by Status:</span>
            <span className="text-purple-300 font-medium">{currentSortLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isSortOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsSortOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-64 bg-[#121624] border border-[#222a3d] rounded-2xl shadow-2xl p-1.5 z-40 backdrop-blur-md animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-[#1b2234] mb-1">
                  Filter & Sort Profiles
                </div>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSortStatusChange(opt.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors text-left cursor-pointer ${
                      sortStatus === opt.id
                        ? 'bg-purple-600/20 text-purple-300 font-bold'
                        : 'text-slate-300 hover:bg-[#1b2135] hover:text-white font-medium'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortStatus === opt.id && (
                      <Check className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Horizontal Info Banner: CONNECTED CHANNEL: Sync Status > #notifications */}
      <div
        id="channel-info-banner"
        onClick={onChannelClick}
        className="w-full px-4 py-2.5 bg-[#0f121e] hover:bg-[#141828] border border-[#20273c] hover:border-purple-500/40 rounded-2xl flex items-center justify-between text-xs text-slate-300 transition-all cursor-pointer shadow-md group"
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>

          <div className="truncate font-mono tracking-tight text-[11px] sm:text-xs">
            <span className="font-bold text-slate-400 uppercase">CONNECTED CHANNEL:</span>{' '}
            <span className="text-white font-semibold">Sync Status &gt;</span>{' '}
            <span className="text-purple-400 font-bold bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40 inline-flex items-center gap-0.5">
              <Hash className="w-3 h-3 text-purple-400" />
              notifications
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 group-hover:text-purple-300 transition-colors shrink-0 ml-2">
          <span>FEED LIVE</span>
        </div>
      </div>
    </header>
  );
};
