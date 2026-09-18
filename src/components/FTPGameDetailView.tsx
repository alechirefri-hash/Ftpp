import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  KeyRound,
  Lock,
  Unlock,
  Copy,
  Check,
  Zap,
  Info,
  Send,
  ExternalLink,
  ShieldCheck,
  Radio,
  Shield,
  Edit3,
  Trash2,
} from 'lucide-react';
import { Game } from '../types';

interface FTPGameDetailViewProps {
  game: Game;
  onBack: () => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onUnlockGame: (gameId: string) => void;
  onOpenSteamGuide: () => void;
  onOpenDiscordChannel: () => void;
  isAdmin?: boolean;
  onEditGame?: (game: Game) => void;
  onDeleteGame?: (gameId: string) => void;
  onToggleLock?: (gameId: string) => void;
}

export const FTPGameDetailView: React.FC<FTPGameDetailViewProps> = ({
  game,
  onBack,
  onToggleFavorite,
  onUnlockGame,
  onOpenSteamGuide,
  onOpenDiscordChannel,
  isAdmin = false,
  onEditGame,
  onDeleteGame,
  onToggleLock,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!game.isCodeLocked);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(game.accountLikes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  // Comments state
  const [comments, setComments] = useState(game.comments || []);
  const [newCommentText, setNewCommentText] = useState('');

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow any 6-character code (or specifically H70409 from the video, or any code if user just clicks unlock)
    setIsUnlocked(true);
    onUnlockGame(game.id);
  };

  const handleLikeToggle = () => {
    if (hasLiked) {
      setLikeCount((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `comment-${Date.now()}`,
      author: 'JugadorSteam_Invitado',
      text: newCommentText.trim(),
      date: 'Hace un momento',
    };
    setComments((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Back to Library Button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs font-semibold py-1.5 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver a la Biblioteca</span>
        </button>
      </div>

      {/* Main Cover Poster */}
      <div className="relative rounded-2xl overflow-hidden bg-[#101424] border border-[#1c243a] shadow-2xl max-w-sm mx-auto aspect-[3/4]">
        <img
          src={game.coverUrl}
          alt={game.title}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://shared.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b14]/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Game Title & Favorite Heart Row */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk'] leading-tight">
          {game.title}
        </h1>

        <button
          type="button"
          onClick={(e) => onToggleFavorite(e, game.id)}
          className="w-10 h-10 shrink-0 rounded-full bg-[#131729] hover:bg-[#1a213b] border border-[#232b45] flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
          title={game.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              game.favorite
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-300 hover:text-rose-400'
            }`}
          />
        </button>
      </div>

      {/* Badges Row: Steam Offline | Code Locked / Unlocked | Added Date */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="px-3 py-1 rounded-lg bg-[#141828] border border-[#212940] text-slate-300 font-medium">
          Steam Offline
        </span>

        {isUnlocked ? (
          <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold flex items-center gap-1.5">
            <Unlock className="w-3 h-3" />
            <span>Desbloqueado</span>
          </span>
        ) : (
          <span className="px-3 py-1 rounded-lg bg-amber-950/50 border border-amber-500/50 text-amber-400 font-semibold flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>Bloqueado por código</span>
          </span>
        )}

        <span className="text-slate-400 text-xs ml-1">
          • Añadido {game.dateAdded || '16/9/2026'}
        </span>
      </div>

      {/* Admin Action Bar (Only visible when user is Admin) */}
      {isAdmin && (
        <div className="p-3 rounded-2xl bg-[#11162a] border border-purple-500/40 flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/40 flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-400" />
              MODO ADMIN
            </span>
            <span className="text-[11px] text-slate-300 font-mono">
              PIN VIP: <strong className="text-amber-400 font-bold">{game.unlockCode || 'H70409'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onEditGame && (
              <button
                type="button"
                onClick={() => onEditGame(game)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md shadow-purple-600/30"
                title="Editar título, carátula o credenciales de este juego"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Ficha</span>
              </button>
            )}

            {onToggleLock && (
              <button
                type="button"
                onClick={() => {
                  onToggleLock(game.id);
                  setIsUnlocked(!game.isCodeLocked);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1a2036] hover:bg-[#232b48] text-slate-200 text-xs font-bold border border-[#2b3558] transition-all cursor-pointer active:scale-95"
                title={game.isCodeLocked ? 'Desbloquear acceso para todos' : 'Bloquear con código VIP'}
              >
                {game.isCodeLocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                <span>{game.isCodeLocked ? 'Desbloquear' : 'Bloquear'}</span>
              </button>
            )}

            {onDeleteGame && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`¿Seguro que deseas eliminar permanentemente "${game.title}"?`)) {
                    onDeleteGame(game.id);
                    onBack();
                  }
                }}
                className="p-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                title="Eliminar juego de la biblioteca"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-2">
        <p>{game.review}</p>
      </div>

      {/* System Requirements */}
      {(game.systemRequirementsMin || game.systemRequirementsRec) && (
        <div className="rounded-2xl bg-[#0f1322] border border-[#1b233a] p-4 text-xs space-y-2 text-slate-300">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Requisitos del Sistema:
          </h4>
          {game.systemRequirementsMin && (
            <p className="leading-relaxed text-slate-400">
              <strong className="text-slate-200">Mínimos:</strong>{' '}
              {game.systemRequirementsMin}
            </p>
          )}
          {game.systemRequirementsRec && (
            <p className="leading-relaxed text-slate-400">
              <strong className="text-slate-200">Recomendados:</strong>{' '}
              {game.systemRequirementsRec}
            </p>
          )}
        </div>
      )}

      {/* Steam Accounts Section (Locked vs Unlocked Card) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Cuentas de Steam
          </h2>
        </div>

        {!isUnlocked ? (
          /* Enter Game Code Card */
          <div className="rounded-2xl bg-[#0e1220] border border-amber-500/25 p-4 sm:p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                Ingresar Código del Juego
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Este juego está protegido. Ingresa el código de 6 caracteres compartido por el admin en este{' '}
                <button
                  type="button"
                  onClick={onOpenDiscordChannel}
                  className="text-[#5865F2] hover:text-indigo-300 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Servidor Oficial de Discord (#codigos-vip)
                </button>
                .
              </p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-3">
              <input
                id="unlock-game-code-input"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="A1B2C3"
                maxLength={10}
                className="w-full px-4 py-3 bg-[#13182b] border border-amber-500/40 focus:border-amber-400 text-amber-200 placeholder-slate-600 rounded-xl outline-none font-mono text-center tracking-[0.3em] font-bold text-base transition-all focus:ring-1 focus:ring-amber-500/30"
              />

              <button
                id="unlock-game-btn"
                type="submit"
                className="w-full py-3 bg-transparent hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 border border-amber-500/50 hover:border-amber-400 font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer active:scale-[0.99]"
              >
                DESBLOQUEAR
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsUnlocked(true);
                    onUnlockGame(game.id);
                  }}
                  className="w-full py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Desbloqueo Inmediato Maestro (Bypass Admin)</span>
                </button>
              )}
            </form>
          </div>
        ) : (
          /* Unlocked Active Access Card */
          <div className="rounded-2xl bg-[#0e1220] border border-purple-500/30 p-4 sm:p-5 shadow-xl space-y-4 animate-fadeIn">
            {/* Active Access Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    ACCESO ACTIVO
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {game.accountUpdatedAgo ? `HACE ${game.accountUpdatedAgo.toUpperCase()}` : 'HACE UN MOMENTO'}
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-[#00c9e6] text-[#090b14] rounded-md">
                NUEVO
              </span>
            </div>

            {/* Username Row */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                USUARIO
              </span>
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#141829] border border-[#212942] rounded-xl text-xs">
                <span className="font-mono text-slate-200 font-bold tracking-wide select-all">
                  {game.accountUsername || 'Q2CHDPUNI6'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(game.accountUsername || 'Q2CHDPUNI6', 'user')
                  }
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                  title="Copiar usuario"
                >
                  {copiedField === 'user' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Row */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CONTRASEÑA
              </span>
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#141829] border border-[#212942] rounded-xl text-xs">
                <span className="font-mono text-slate-200 font-medium tracking-wide truncate max-w-[220px] select-all">
                  {game.accountPassword || '92https://discord.gg/xzyz2UQyjY'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      game.accountPassword || '92https://discord.gg/xzyz2UQyjY',
                      'pass'
                    )
                  }
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer shrink-0"
                  title="Copiar contraseña"
                >
                  {copiedField === 'pass' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions Row: Heart Counter | DIRECT STEAM START | Copy All */}
            <div className="flex items-center justify-between pt-2 gap-2">
              <button
                type="button"
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  hasLiked
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                    : 'bg-[#141829] border-[#212942] text-slate-400 hover:text-slate-200'
                }`}
                title="Votar por este juego"
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasLiked ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span>{likeCount}</span>
              </button>

              <button
                type="button"
                onClick={onOpenSteamGuide}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>INICIAR EN STEAM</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `Usuario: ${game.accountUsername || 'STEAM_USER'} | Contraseña: ${game.accountPassword || ''}`,
                    'all'
                  )
                }
                className="px-3 py-2 rounded-xl bg-[#141829] hover:bg-[#1a2036] border border-[#212942] flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copiar credenciales completas"
              >
                {copiedField === 'all' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="hidden sm:inline text-[11px] font-semibold">Copiar Todo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="space-y-3 pt-4 border-t border-[#1a2136]">
        <h3 className="text-sm font-bold text-white">Comentarios</h3>

        {comments.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs italic bg-[#0c101c]/50 border border-dashed border-[#1a2136] rounded-2xl p-4">
            Aún no hay comentarios. ¡Sé el primero en compartir tu experiencia!
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-[#0e1220] border border-[#1b233a] rounded-xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span className="font-semibold text-purple-300">{c.author}</span>
                  <span>{c.date}</span>
                </div>
                <p className="text-slate-200">{c.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add comment form */}
        <form onSubmit={handlePostComment} className="flex gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Comparte tu experiencia con este juego..."
            className="flex-1 px-3 py-2 bg-[#121626] border border-[#1d253c] focus:border-purple-500 text-slate-100 placeholder-slate-500 text-xs rounded-xl outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Send className="w-3 h-3" />
            <span className="hidden sm:inline">Publicar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
