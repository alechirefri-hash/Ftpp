import React from 'react';
import { Game } from '../types';
import { Heart, Star, Clock } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelect,
  onToggleFavorite,
}) => {
  const displayPlatform =
    game.platformDisplay ||
    (game.platform === 'Steam' ? 'Steam Offline' : game.platform);

  const displayBadge = game.badge || 'NEW';
  const displayAccessBadge = game.accessBadge || 'FREE';

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onSelect(game)}
      className="group flex flex-col bg-[#121520] hover:bg-[#161a28] rounded-2xl overflow-hidden border border-[#1f2638] hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 cursor-pointer transform hover:-translate-y-1.5 select-none"
    >
      {/* Poster Cover Section */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
        <img
          src={game.coverUrl}
          alt={game.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://shared.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg';
          }}
        />

        {/* Gradient shadow at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121520] via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Controls */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
          {/* Favorite Heart Button (Top Left) */}
          <button
            id={`fav-btn-${game.id}`}
            type="button"
            onClick={(e) => onToggleFavorite(e, game.id)}
            className="pointer-events-auto w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 text-white shadow-md"
            title={game.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                game.favorite
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-white/90 hover:text-rose-400'
              }`}
            />
          </button>

          {/* Badge (Top Right, e.g. "NEW" in cyan) */}
          {displayBadge && (
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950 rounded-md shadow-md pointer-events-none">
              {displayBadge}
            </span>
          )}
        </div>

        {/* Subtle Rating overlay pill on hover */}
        <div className="absolute bottom-2 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] text-amber-400 border border-white/10">
          <Star className="w-3 h-3 fill-amber-400" />
          <span className="font-bold text-white">{game.rating}</span>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 bg-[#121520]">
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg leading-tight group-hover:text-purple-300 transition-colors line-clamp-1">
            {game.title}
          </h3>
        </div>

        {/* Platform & Access Badge Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Platform with Radio Dot (matching screenshot) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-3.5 h-3.5 rounded-full border border-slate-500 flex items-center justify-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            </span>
            <span className="font-medium text-slate-300 truncate max-w-[100px] sm:max-w-[130px]">
              {displayPlatform}
            </span>
          </div>

          {/* Access / Status Pill Badge (e.g. FREE) */}
          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded border border-[#2d3748] bg-[#1a2130]/90 text-slate-300 shadow-sm">
            {displayAccessBadge}
          </span>
        </div>
      </div>
    </div>
  );
};
