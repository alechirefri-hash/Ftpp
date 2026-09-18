import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Shield, X, ArrowRight, Gamepad2 } from 'lucide-react';
import { LibraryNotification } from '../types';

interface NewGameToastNotificationProps {
  notification: LibraryNotification | null;
  onClose: () => void;
  onViewGame: (gameId: string) => void;
  duration?: number; // duration in ms, default 6000
}

export const NewGameToastNotification: React.FC<NewGameToastNotificationProps> = ({
  notification,
  onClose,
  onViewGame,
  duration = 6000,
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!notification) return;

    setProgress(100);
    startTimeRef.current = Date.now();
    remainingTimeRef.current = duration;

    const tick = () => {
      if (!isPaused) {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, remainingTimeRef.current - elapsed);
        const percent = (remaining / duration) * 100;
        setProgress(percent);

        if (remaining <= 0) {
          onClose();
          return;
        }
      }
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [notification, duration, onClose, isPaused]);

  // Handle pause on mouse hover
  const handleMouseEnter = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    startTimeRef.current = Date.now();
    setIsPaused(false);
  };

  if (!notification) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      id="new-game-toast-alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-[370px] animate-fadeIn transition-all duration-300 pointer-events-auto"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1020]/95 backdrop-blur-xl border border-purple-500/50 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(168,85,247,0.25)] p-3.5 space-y-3 group">
        {/* Top subtle glow line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400" />

        {/* Header: Badge & Close */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-black text-purple-300 uppercase tracking-wide shadow-sm">
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              <span>Nuevo Juego Añadido</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
              <Shield className="w-2.5 h-2.5" />
              <span>Admin</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Cover, Title, Info */}
        <div className="flex items-center gap-3">
          {notification.gameCoverUrl ? (
            <img
              src={notification.gameCoverUrl}
              alt={notification.gameTitle || 'Juego'}
              referrerPolicy="no-referrer"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover bg-slate-800 border border-white/10 shrink-0 shadow-md"
            />
          ) : (
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
              {notification.gameTitle || notification.title}
            </h4>
            <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
              {notification.gameCategory || 'Disponible en el catálogo de FTP'}
            </p>
            <span className="inline-block text-[10px] text-slate-400 mt-0.5">
              Agregado a la biblioteca hace un momento
            </span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Descartar
          </button>

          {notification.gameId && (
            <button
              type="button"
              onClick={() => {
                onViewGame(notification.gameId!);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
            >
              <span>Ver Juego</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Progress Bar Timer */}
        <div className="w-full h-1 bg-[#1a2035] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-75 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
