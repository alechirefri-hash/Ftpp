import React from 'react';
import { FilterStatus, Platform, SortOption, Game } from '../types';
import { Gamepad2, Play, Trophy, Clock, Heart, Bookmark, ArrowUpDown, Filter, Sparkles } from 'lucide-react';

interface GameFiltersProps {
  games: Game[];
  currentStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  allGenres: string[];
}

export const GameFilters: React.FC<GameFiltersProps> = ({
  games,
  currentStatus,
  onStatusChange,
  selectedPlatform,
  onPlatformChange,
  sortBy,
  onSortChange,
  selectedGenre,
  onGenreChange,
  allGenres,
}) => {
  // Compute counts for status badges
  const counts = {
    todos: games.length,
    jugando: games.filter((g) => g.status === 'jugando').length,
    completado: games.filter((g) => g.status === 'completado').length,
    pendiente: games.filter((g) => g.status === 'pendiente').length,
    deseado: games.filter((g) => g.status === 'deseado').length,
    favoritos: games.filter((g) => g.favorite).length,
  };

  const platforms: (Platform | 'Todas')[] = [
    'Todas',
    'Steam',
    'PC',
    'PlayStation',
    'Xbox',
    'Nintendo Switch',
    'Epic Games',
    'GOG',
    'Retro',
  ];

  const statusTabs: { id: FilterStatus; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'todos', label: 'Todos', icon: <Gamepad2 className="w-4 h-4" />, count: counts.todos },
    { id: 'jugando', label: 'Jugando', icon: <Play className="w-4 h-4 text-emerald-400" />, count: counts.jugando },
    { id: 'pendiente', label: 'Pendientes', icon: <Clock className="w-4 h-4 text-sky-400" />, count: counts.pendiente },
    { id: 'completado', label: 'Completados', icon: <Trophy className="w-4 h-4 text-amber-400" />, count: counts.completado },
    { id: 'favoritos', label: 'Favoritos', icon: <Heart className="w-4 h-4 text-rose-400" />, count: counts.favoritos },
    { id: 'deseado', label: 'Deseados', icon: <Bookmark className="w-4 h-4 text-purple-400" />, count: counts.deseado },
  ];

  return (
    <div className="space-y-4 mb-6">
      
      {/* Category / Status Navigation Tabs (Steam Store Inspired) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-slate-900/80 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary filter bar: Platform buttons & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        
        {/* Platforms Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Plataforma:
          </span>
          {platforms.map((plat) => {
            const isSelected = (plat === 'Todas' && !selectedPlatform) || selectedPlatform === plat;
            return (
              <button
                key={plat}
                onClick={() => onPlatformChange(plat === 'Todas' ? '' : plat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {plat}
              </button>
            );
          })}
        </div>

        {/* Sort & Genre Filters */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          
          {/* Genre select */}
          {allGenres.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer pr-2"
              >
                <option value="" className="bg-slate-900 text-slate-200">Todos los géneros</option>
                {allGenres.map((g) => (
                  <option key={g} value={g} className="bg-slate-900 text-slate-200">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer pr-2"
            >
              <option value="recientes" className="bg-slate-900 text-slate-200">Más recientes</option>
              <option value="rating" className="bg-slate-900 text-slate-200">Mejor puntuación</option>
              <option value="horas" className="bg-slate-900 text-slate-200">Más horas jugadas</option>
              <option value="titulo" className="bg-slate-900 text-slate-200">Nombre (A - Z)</option>
            </select>
          </div>

        </div>

      </div>

    </div>
  );
};
