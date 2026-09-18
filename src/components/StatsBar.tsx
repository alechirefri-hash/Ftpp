import React from 'react';
import { Game } from '../types';
import { Trophy, Clock, Star, Gamepad2, CheckCircle2, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  games: Game[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ games }) => {
  const total = games.length;
  if (total === 0) return null;

  const totalHours = games.reduce((acc, g) => acc + (g.hoursPlayed || 0), 0);
  const completed = games.filter((g) => g.status === 'completado').length;
  const playing = games.filter((g) => g.status === 'jugando').length;
  const wishlist = games.filter((g) => g.status === 'deseado').length;
  const pending = games.filter((g) => g.status === 'pendiente').length;

  const avgRating = total > 0
    ? (games.reduce((acc, g) => acc + (g.rating || 0), 0) / total).toFixed(1)
    : '0.0';

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Platform distribution
  const platformCounts = games.reduce((acc, g) => {
    acc[g.platform] = (acc[g.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
        
        {/* Total Games */}
        <div className="flex items-center gap-3.5 pr-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-['Space_Grotesk'] text-white">
              {total} <span className="text-xs font-normal text-slate-400">juegos</span>
            </div>
            <p className="text-xs text-slate-400">
              {playing} jugando • {pending} pendientes
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="flex items-center gap-3.5 sm:pl-4 pt-3 sm:pt-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-1.5">
              {completed} <span className="text-xs font-semibold text-amber-400">({completionRate}%)</span>
            </div>
            <p className="text-xs text-slate-400">Juegos completados</p>
          </div>
        </div>

        {/* Total Hours Played */}
        <div className="flex items-center gap-3.5 sm:pl-4 pt-3 sm:pt-0">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-['Space_Grotesk'] text-white">
              {totalHours} <span className="text-xs font-normal text-slate-400">horas</span>
            </div>
            <p className="text-xs text-slate-400">Tiempo de juego invertido</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="flex items-center gap-3.5 sm:pl-4 pt-3 sm:pt-0">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-1">
              {avgRating} <span className="text-xs font-normal text-slate-400">/ 5 estrellas</span>
            </div>
            <p className="text-xs text-slate-400">Puntuación media</p>
          </div>
        </div>

      </div>

      {/* Mini platform badges summary */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Distribución:
        </span>
        {Object.entries(platformCounts).map(([plat, count]) => (
          <span key={plat} className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-slate-300">
            {plat}: <span className="font-semibold text-cyan-400">{count}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
