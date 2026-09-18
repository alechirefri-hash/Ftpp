import React from 'react';
import { CircleDollarSign, ShieldCheck, Zap, ArrowRight, Clock } from 'lucide-react';
import { Game } from '../types';

interface FTPRentalViewProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const FTPRentalView: React.FC<FTPRentalViewProps> = ({
  games,
  onSelectGame,
}) => {
  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/50 via-[#161a29] to-[#0f1322] border border-amber-500/30 p-4 shadow-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <CircleDollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight font-['Space_Grotesk']">
              Catálogo de Juegos en Alquiler
            </h2>
            <span className="text-[11px] text-amber-400/90 font-medium">
              Espacios VIP Dedicados • Sin Colas de Espera • Partidas Guardadas Seguras
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          Alquila espacios dedicados en bibliotecas de Steam para PC con los mejores lanzamientos AAA. Incluye credenciales de acceso directo y bloqueo privado de licencia offline.
        </p>
      </div>

      {/* Grid of Rental Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onSelectGame(game)}
            className="group p-3 rounded-2xl bg-[#0f1322] hover:bg-[#14192b] border border-[#1d253c] hover:border-amber-500/50 transition-all cursor-pointer flex gap-3.5 shadow-lg"
          >
            <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden relative bg-slate-900">
              <img
                src={game.coverUrl}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] rounded">
                VIP
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {game.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {game.review}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  $1.99 / día
                </span>
                <span className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 rounded-lg text-[11px] font-bold transition-colors">
                  Alquilar Espacio
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
