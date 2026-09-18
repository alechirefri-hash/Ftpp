import React from 'react';
import { CircleDollarSign, ArrowRight, Star, ShieldCheck, Flame, Zap, MessageSquare, ExternalLink } from 'lucide-react';
import { Game } from '../types';

interface FTPHomeViewProps {
  onNavigateToGames: () => void;
  onNavigateToRental: () => void;
  onSelectGame: (game: Game) => void;
  featuredGames: Game[];
}

export const FTPHomeView: React.FC<FTPHomeViewProps> = ({
  onNavigateToGames,
  onNavigateToRental,
  onSelectGame,
  featuredGames,
}) => {
  const topHeroGame = featuredGames[0] || null;

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Hero Banner Section */}
      <div className="text-center pt-2 pb-1 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk'] uppercase leading-none">
          JUEGA CUALQUIER JUEGO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">
            OFFLINE
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
          Acceso exclusivo a cuentas de Steam precargadas con los mejores títulos AAA. Seguro, sencillo y totalmente gratis.
        </p>

        <div className="pt-1 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateToGames}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Explorar Biblioteca</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rental Games Section Header with Gold Coin */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Juegos en Alquiler
            </h2>
          </div>

          <button
            type="button"
            onClick={onNavigateToRental}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver Todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Big Poster Card (like in video Frame 00:00) */}
        {topHeroGame && (
          <div
            onClick={() => onSelectGame(topHeroGame)}
            className="group relative rounded-2xl overflow-hidden bg-[#101424] border border-[#212940] hover:border-amber-500/50 transition-all duration-300 shadow-2xl cursor-pointer"
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-slate-950 relative">
              <img
                src={topHeroGame.coverUrl}
                alt={topHeroGame.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1220] via-black/30 to-transparent" />

              {/* Logo FTP Watermark stamp in top right */}
              <div className="absolute top-3 right-3 text-right">
                <span className="text-sm font-black text-white/80 font-['Space_Grotesk'] italic tracking-tighter drop-shadow-md">
                  F<span className="text-purple-400">T</span>P
                </span>
              </div>

              {/* Badges in top left */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 rounded-md shadow-md">
                  ALQUILER VIP
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-purple-500 text-white rounded-md shadow-md">
                  AAA
                </span>
              </div>

              {/* Title overlay at bottom */}
              <div className="absolute bottom-3 inset-x-4 flex items-end justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {topHeroGame.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                    Lanzador Steam PC • Acceso Directo Inmediato
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shrink-0">
                  Jugar Ahora
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popular Trending Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Títulos AAA Populares
            </h3>
          </div>
          <button
            type="button"
            onClick={onNavigateToGames}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
          >
            Ver Biblioteca &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featuredGames.slice(1, 5).map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="group rounded-xl overflow-hidden bg-[#101424] border border-[#1e253c] hover:border-purple-500/50 p-2.5 transition-all cursor-pointer flex flex-col gap-2"
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {game.badge && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-cyan-400 text-slate-950 text-[9px] font-black rounded">
                    {game.badge === 'NEW' ? 'NUEVO' : game.badge}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-xs text-white truncate group-hover:text-purple-300">
                {game.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Official Discord Server Community Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#5865F2]/20 via-[#101424] to-[#14192e] border border-[#5865F2]/40 p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#5865F2]/30">
            <MessageSquare className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white">Comunidad Oficial FTP</h4>
              <span className="px-1.5 py-0.5 bg-[#5865F2] text-white text-[9px] font-black rounded-sm">
                DISCORD
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Únete a nuestro servidor para recibir claves, códigos de desbloqueo VIP y soporte en directo.
            </p>
          </div>
        </div>

        <a
          href="https://discord.gg/xzyz2UQyjY"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs transition-all shadow-md shadow-[#5865F2]/40 shrink-0 cursor-pointer"
        >
          <span>Entrar a Discord</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
