import React from 'react';
import { Heart } from 'lucide-react';
import { Game } from '../types';

interface FTPGameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

export const FTPGameCard: React.FC<FTPGameCardProps> = ({
  game,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative flex flex-col bg-[#0e1220] rounded-2xl overflow-hidden border border-[#1b233a] hover:border-purple-500/60 transition-all duration-200 shadow-lg hover:shadow-purple-900/20 cursor-pointer select-none active:scale-[0.98]"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141829]">
        <img
          src={game.coverUrl}
          alt={game.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://shared.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg';
          }}
        />

        {/* Subtle gradient vignette at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1220] via-transparent to-black/30 pointer-events-none" />

        {/* Top-Left: Frosted Glass Heart Button */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(e, game.id)}
          className="absolute top-2 left-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-90 cursor-pointer shadow-md"
          title={game.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              game.favorite
                ? 'fill-rose-500 text-rose-500'
                : 'text-white/90 hover:text-rose-400'
            }`}
          />
        </button>

        {/* Top-Right: Cyan "NUEVO" Pill Badge */}
        {game.badge && (
          <div className="absolute top-2 right-2 z-10">
            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#00c9e6] text-[#090b14] rounded-md shadow-md">
              {game.badge === 'NEW' ? 'NUEVO' : game.badge}
            </span>
          </div>
        )}

        {/* Bottom Game Title directly over card */}
        <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 bg-gradient-to-t from-[#0e1220] via-[#0e1220]/90 to-transparent">
          <h3 className="font-bold text-white text-xs sm:text-sm leading-tight group-hover:text-purple-300 transition-colors line-clamp-2">
            {game.title}
          </h3>
        </div>
      </div>
    </div>
  );
};
