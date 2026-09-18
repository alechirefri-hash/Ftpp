import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { Play, Star, Clock, Trophy, ChevronRight, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';

interface StoreHeroBannerProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const StoreHeroBanner: React.FC<StoreHeroBannerProps> = ({ games, onSelectGame }) => {
  // Prefer games that are 'jugando' or 'favorite', or fallback to first few
  const featuredGames = games.filter((g) => g.favorite || g.status === 'jugando').slice(0, 5);
  const displayPool = featuredGames.length > 0 ? featuredGames : games.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banner every 8 seconds if there are multiple games
  useEffect(() => {
    if (displayPool.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayPool.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [displayPool.length]);

  if (displayPool.length === 0) return null;

  const currentGame = displayPool[currentIndex] || displayPool[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? displayPool.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayPool.length);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl group mb-8">
      {/* Background panoramic image with darkening gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentGame.bannerUrl || currentGame.coverUrl}
          alt={currentGame.title}
          className="w-full h-full object-cover object-center transform scale-105 filter blur-xs group-hover:scale-100 transition-all duration-700 brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        <div className="w-full md:max-w-2xl space-y-4">
          
          {/* Header pill tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Destacado en tu Biblioteca
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700">
              {currentGame.platform}
            </span>
            {currentGame.status === 'jugando' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                <Play className="w-3 h-3 fill-emerald-400" />
                Jugando actualmente
              </span>
            )}
            {currentGame.status === 'completado' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Trophy className="w-3 h-3" />
                Completado
              </span>
            )}
          </div>

          {/* Title & Metadata */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] drop-shadow-md">
              {currentGame.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-300">
              {currentGame.developer && <span>{currentGame.developer}</span>}
              {currentGame.releaseYear && <span>• {currentGame.releaseYear}</span>}
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{currentGame.rating}</span>
                <span className="text-slate-400">/ 5</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-300">
                <Clock className="w-4 h-4" />
                <span>{currentGame.hoursPlayed} horas registradas</span>
              </div>
            </div>
          </div>

          {/* Review snippet / note */}
          <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Tu Reseña Personal:
            </p>
            <p className="text-sm text-slate-200 line-clamp-2 italic">
              "{currentGame.review || 'Sin reseña aún. Haz click para añadir tus impresiones sobre la jugabilidad y la historia.'}"
            </p>
          </div>

          {/* Action button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onSelectGame(currentGame)}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Ver Ficha del Juego
            </button>
            <div className="flex gap-1.5">
              {currentGame.genres.map((genre) => (
                <span key={genre} className="hidden sm:inline-block px-2.5 py-1 text-xs bg-slate-800/80 text-slate-300 rounded-lg border border-slate-700/60">
                  {genre}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Carousel Indicators and Poster thumbnail */}
        <div className="shrink-0 flex md:flex-col items-center gap-4">
          <div
            onClick={() => onSelectGame(currentGame)}
            className="w-28 sm:w-36 h-40 sm:h-52 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 ring-1 ring-cyan-500/30 cursor-pointer hover:border-cyan-400 transition-all hover:scale-105"
          >
            <img
              src={currentGame.coverUrl}
              alt={currentGame.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 transition-colors"
              aria-label="Juego anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1.5">
              {displayPool.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Ir al juego ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700 transition-colors"
              aria-label="Siguiente juego"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
