import React, { useState } from 'react';
import { Game, GameStatus } from '../types';
import {
  X,
  Star,
  Clock,
  Trophy,
  Play,
  Heart,
  Edit3,
  Trash2,
  Bookmark,
  Calendar,
  Save,
  Gamepad2,
  Sparkles,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Minus
} from 'lucide-react';

interface GameDetailModalProps {
  game: Game | null;
  onClose: () => void;
  onUpdateGame: (updated: Game) => void;
  onDeleteGame: (id: string) => void;
  onOpenEditForm: (game: Game) => void;
  globalAccessPin: string;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  onClose,
  onUpdateGame,
  onDeleteGame,
  onOpenEditForm,
  globalAccessPin,
}) => {
  if (!game) return null;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedReview, setEditedReview] = useState(game.review);
  const [editedNotes, setEditedNotes] = useState(game.personalNotes);
  const [editedGuide, setEditedGuide] = useState(game.guideNotes || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Access code unlock state
  const [enteredPin, setEnteredPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!game.isPrivateGuide);
  const [pinError, setPinError] = useState(false);

  // Sync state if game changes
  React.useEffect(() => {
    setEditedReview(game.review);
    setEditedNotes(game.personalNotes);
    setEditedGuide(game.guideNotes || '');
    setIsEditingNotes(false);
    setShowDeleteConfirm(false);
    setIsUnlocked(!game.isPrivateGuide);
    setEnteredPin('');
    setPinError(false);
  }, [game.id, game.isPrivateGuide]);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === globalAccessPin) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveInlineNotes = () => {
    onUpdateGame({
      ...game,
      review: editedReview,
      personalNotes: editedNotes,
      guideNotes: editedGuide,
    });
    setIsEditingNotes(false);
  };

  const handleStatusChange = (newStatus: GameStatus) => {
    const isNowCompleted = newStatus === 'completado';
    onUpdateGame({
      ...game,
      status: newStatus,
      finishedDate: isNowCompleted
        ? game.finishedDate || new Date().toISOString().split('T')[0]
        : game.finishedDate,
    });
  };

  const handleRatingClick = (newRating: number) => {
    onUpdateGame({
      ...game,
      rating: newRating,
    });
  };

  const handleHoursChange = (delta: number) => {
    const newHours = Math.max(0, (game.hoursPlayed || 0) + delta);
    onUpdateGame({
      ...game,
      hoursPlayed: newHours,
    });
  };

  const handleToggleFavorite = () => {
    onUpdateGame({
      ...game,
      favorite: !game.favorite,
    });
  };

  const statuses: { id: GameStatus; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'jugando',
      label: 'Jugando',
      icon: <Play className="w-3.5 h-3.5 fill-current" />,
      color: 'bg-purple-600/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'pendiente',
      label: 'Pendiente',
      icon: <Clock className="w-3.5 h-3.5" />,
      color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
    {
      id: 'completado',
      label: 'Completado',
      icon: <Trophy className="w-3.5 h-3.5" />,
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'deseado',
      label: 'Deseado',
      icon: <Bookmark className="w-3.5 h-3.5" />,
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'pausado',
      label: 'En Pausa',
      icon: <Minus className="w-3.5 h-3.5" />,
      color: 'bg-slate-800 text-slate-400 border-slate-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0f121d] border border-[#232a3f] rounded-3xl overflow-hidden shadow-2xl my-6">
        
        {/* Top Close Button */}
        <button
          id="btn-close-game-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={game.bannerUrl || game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover object-center filter brightness-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f121d] via-[#0f121d]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f121d]/90 via-transparent to-transparent" />

          {/* Quick Header Information */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              {/* Poster Thumbnail */}
              <div className="w-20 sm:w-28 h-28 sm:h-40 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 bg-slate-950 hidden xs:block">
                <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-black rounded-md bg-cyan-400 text-slate-950 uppercase tracking-wider shadow-sm">
                    {game.badge || 'NEW'}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {game.platformDisplay || game.platform}
                  </span>
                  {game.releaseYear && (
                    <span className="text-xs text-slate-400 font-medium">
                      {game.releaseYear}
                    </span>
                  )}
                  {game.developer && (
                    <span className="text-xs text-slate-400">
                      • {game.developer}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk'] drop-shadow">
                  {game.title}
                </h2>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {game.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#181d2e] text-slate-300 border border-[#242c44]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Favorite button */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                  game.favorite
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-[#181d2d] text-slate-300 border-[#262f48] hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${game.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{game.favorite ? 'En Favoritos' : 'Favorito'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[calc(85vh-16rem)] overflow-y-auto">
          
          {/* Quick interactive control ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#090b12] border border-[#1b2234]">
            
            {/* Status change selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                Estado en Biblioteca
              </label>
              <div className="flex flex-wrap gap-1">
                {statuses.map((s) => {
                  const isActive = game.status === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleStatusChange(s.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isActive
                          ? `${s.color} ring-1 ring-purple-400/30 font-bold`
                          : 'bg-[#121624] text-slate-400 border-[#1f2638] hover:text-slate-200'
                      }`}
                    >
                      {s.icon}
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                Tu Puntuación
              </label>
              <div className="flex items-center gap-1 pt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-0.5 text-slate-600 hover:text-amber-400 transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= game.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-white">
                  {game.rating} / 5
                </span>
              </div>
            </div>

            {/* Playtime Tracker */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Horas Jugadas
              </label>
              <div className="flex items-center gap-2 pt-0.5">
                <div className="text-lg font-bold font-mono text-white bg-[#121624] border border-[#1f2638] px-2.5 py-0.5 rounded-lg">
                  {game.hoursPlayed}h
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleHoursChange(-1)}
                    className="p-1 rounded-lg bg-[#181e30] hover:bg-[#222a42] text-slate-300 transition-colors cursor-pointer"
                    title="Restar 1h"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHoursChange(1)}
                    className="px-2 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/30 transition-colors cursor-pointer"
                  >
                    +1h
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHoursChange(5)}
                    className="px-2 py-1 rounded-lg bg-[#181e30] hover:bg-[#222a42] text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    +5h
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* SECURED GAMEPLAY GUIDE & NOTES SECTION (Protected by Access Code) */}
          <div className="p-4 rounded-2xl bg-[#090b12] border border-[#1e2538] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Guía de Juego, Configuración y Notas Privadas
                </h3>
              </div>

              {isUnlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Desbloqueado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <Lock className="w-3.5 h-3.5" />
                  Protegido con Código
                </span>
              )}
            </div>

            {!isUnlocked ? (
              /* Locked view asking for access code */
              <div className="p-4 rounded-xl bg-[#121522] border border-[#22293e] text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Introduce el código de acceso para desbloquear la guía
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Accede a las instrucciones de instalación offline, consejos de combate y trucos guardados.
                  </p>
                </div>

                <form onSubmit={handleVerifyPin} className="max-w-xs mx-auto flex items-center gap-2">
                  <input
                    type="password"
                    maxLength={10}
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Código (Ej: 1234)"
                    className={`w-full px-3 py-2 bg-[#0a0d16] border ${
                      pinError ? 'border-rose-500' : 'border-[#263048]'
                    } rounded-xl text-sm text-center text-white placeholder-slate-600 outline-none focus:border-purple-500`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 cursor-pointer whitespace-nowrap"
                  >
                    Desbloquear
                  </button>
                </form>

                {pinError && (
                  <p className="text-xs text-rose-400 font-medium">
                    Código de acceso incorrecto. (Código por defecto: {globalAccessPin})
                  </p>
                )}
              </div>
            ) : (
              /* Unlocked view showing the guide */
              <div className="space-y-2">
                {isEditingNotes ? (
                  <textarea
                    rows={3}
                    value={editedGuide}
                    onChange={(e) => setEditedGuide(e.target.value)}
                    placeholder="Escribe aquí las instrucciones de juego, consejos de inicio, configuración gráfica o trucos..."
                    className="w-full p-3 bg-[#0c0f18] border border-[#252f48] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 outline-none font-mono text-xs"
                  />
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#121624] border border-[#20273c]">
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {game.guideNotes || 'No hay guía personalizada añadida todavía. Haz clic en editar para agregar pasos o trucos.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Review Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Reseña Personal
              </h3>
              {!isEditingNotes && (
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar textos
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={editedReview}
                  onChange={(e) => setEditedReview(e.target.value)}
                  placeholder="¿Qué opinas de este juego?"
                  className="w-full p-3 bg-[#0c0f18] border border-[#252f48] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 outline-none"
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#090b12] border border-[#1b2234]">
                {game.review ? (
                  <p className="text-xs text-slate-200 leading-relaxed italic border-l-2 border-purple-500 pl-3">
                    "{game.review}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Sin reseña añadida aún.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Personal Notes Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              Notas de Partida & Logros
            </h3>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Notas de tu partida, builds, progreso..."
                  className="w-full p-3 bg-[#0c0f18] border border-[#252f48] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedReview(game.review);
                      setEditedNotes(game.personalNotes);
                      setEditedGuide(game.guideNotes || '');
                      setIsEditingNotes(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInlineNotes}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#090b12] border border-[#1b2234]">
                {game.personalNotes ? (
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {game.personalNotes}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Sin notas de partida registradas.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Dates & History */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#1b2234]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Añadido: {game.dateAdded}
            </span>
            {game.finishedDate && (
              <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Terminado: {game.finishedDate}
              </span>
            )}
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-[#0a0d16] border-t border-[#1b2234] flex flex-wrap items-center justify-between gap-3">
          {/* Delete action */}
          <div>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300">¿Eliminar del catálogo?</span>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteGame(game.id);
                    onClose();
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 py-1.5 px-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenEditForm(game)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#161b2c] hover:bg-[#20273d] text-slate-300 text-xs font-semibold rounded-xl border border-[#26304b] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
              Editar Todo
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/25"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
