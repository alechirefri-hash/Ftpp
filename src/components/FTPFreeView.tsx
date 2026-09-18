import React from 'react';
import { Gift, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Game } from '../types';

interface FTPFreeViewProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const FTPFreeView: React.FC<FTPFreeViewProps> = ({
  games,
  onSelectGame,
}) => {
  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Free Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#131a29] to-[#0f1322] border border-emerald-500/30 p-4 shadow-xl">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight font-['Space_Grotesk']">
              Juegos 100% Gratis
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium">
              Sin código requerido • Cuentas comunitarias públicas
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          Estos juegos se pueden desbloquear de inmediato sin ingresar códigos de admin de Discord. Disfruta de campañas completas en modo offline en Steam.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onSelectGame(game)}
            className="group rounded-2xl bg-[#0f1322] hover:bg-[#14192b] border border-[#1e263d] hover:border-emerald-500/50 p-2.5 transition-all cursor-pointer flex flex-col justify-between shadow-lg"
          >
            <div className="aspect-[3/4] rounded-xl overflow-hidden relative bg-slate-900 mb-2">
              <img
                src={game.coverUrl}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-emerald-400 text-slate-950 font-black text-[9px] rounded-md shadow">
                GRATIS
              </span>
            </div>

            <h3 className="font-bold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
              {game.title}
            </h3>

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1b2236]">
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Desbloqueado
              </span>
              <span className="text-[10px] text-slate-400">Jugar Ahora &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
