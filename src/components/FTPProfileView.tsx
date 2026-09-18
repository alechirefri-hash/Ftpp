import React, { useState } from 'react';
import {
  UserProfile,
  UnlockedGameHistoryItem,
  Game,
} from '../types';
import { BANNER_PRESETS, AVATAR_PRESETS } from '../data/initialProfile';
import { ImageUploadDropzone } from './ImageUploadDropzone';
import {
  Camera,
  Edit3,
  CheckCircle2,
  Calendar,
  Gamepad2,
  Trophy,
  Shield,
  KeyRound,
  ExternalLink,
  Trash2,
  Settings,
  Flame,
  Clock,
  Sparkles,
  Share2,
  Save,
  X,
  Plus,
  Tv,
  BellRing,
  RotateCcw,
  Check,
  ChevronRight,
  Hash,
  Monitor,
  WifiOff,
  MessageSquare,
  ShieldCheck,
  Zap,
  Crown,
  UploadCloud,
  Image as ImageIcon,
  Link,
  Lock,
  LogOut,
  User,
} from 'lucide-react';

interface FTPProfileViewProps {
  profile: UserProfile;
  games: Game[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectGame: (gameId: string) => void;
  onClearHistory: () => void;
  onOpenAdminPanel?: () => void;
  onToggleAdminProfile?: () => void;
  onUnlockAllGames?: () => void;
  onMaxLevel?: () => void;
  onUnlockAllAchievements?: () => void;
  onSwitchAccount?: () => void;
  onLogout?: () => void;
}

export const FTPProfileView: React.FC<FTPProfileViewProps> = ({
  profile,
  games,
  onUpdateProfile,
  onSelectGame,
  onClearHistory,
  onOpenAdminPanel,
  onToggleAdminProfile,
  onUnlockAllGames,
  onMaxLevel,
  onUnlockAllAchievements,
  onSwitchAccount,
  onLogout,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'historial' | 'cuenta' | 'logros'>('historial');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Edit form state
  const [formData, setFormData] = useState({
    username: profile.username,
    tag: profile.tag,
    bio: profile.bio,
    discordHandle: profile.discordHandle,
    steamId64: profile.steamId64,
    preferredRegion: profile.preferredRegion,
  });

  // Custom URLs input state
  const [customBannerUrl, setCustomBannerUrl] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Upload modal tabs & preview states
  const [bannerTab, setBannerTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [uploadedBannerData, setUploadedBannerData] = useState<string | null>(null);
  const [avatarTab, setAvatarTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [uploadedAvatarData, setUploadedAvatarData] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSaveProfileInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      username: formData.username.trim() || profile.username,
      tag: formData.tag.startsWith('#') ? formData.tag.trim() : `#${formData.tag.trim()}`,
      bio: formData.bio.trim(),
      discordHandle: formData.discordHandle.trim(),
      steamId64: formData.steamId64.trim(),
      preferredRegion: formData.preferredRegion,
    });
    setIsEditingProfile(false);
  };

  const handleSelectBanner = (url: string) => {
    onUpdateProfile({ ...profile, bannerUrl: url });
    setIsBannerModalOpen(false);
  };

  const handleSelectAvatar = (url: string) => {
    onUpdateProfile({ ...profile, avatarUrl: url });
    setIsAvatarModalOpen(false);
  };

  const handleToggleSetting = (key: keyof typeof profile.settings) => {
    onUpdateProfile({
      ...profile,
      settings: {
        ...profile.settings,
        [key]: !profile.settings[key],
      },
    });
  };

  const handleRemoveHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProfile({
      ...profile,
      unlockedHistory: profile.unlockedHistory.filter((item) => item.id !== id),
    });
  };

  // Calculate stats
  const unlockedCount = profile.unlockedHistory.length;
  const favoriteCount = games.filter((g) => g.favorite).length;
  const totalHoursLogged = games
    .filter((g) => profile.unlockedHistory.some((h) => h.gameId === g.id))
    .reduce((sum, g) => sum + (g.hoursPlayed || 0), 0);

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      
      {/* Profile Header & Banner Card */}
      <div className="relative rounded-3xl bg-[#0f1220] border border-[#1f263c] overflow-hidden shadow-2xl">
        
        {/* Banner Image with Overlay */}
        <div className="relative h-36 sm:h-44 w-full bg-[#151928] overflow-hidden group">
          <img
            src={profile.bannerUrl}
            alt="Banner de perfil"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0f1220]" />
          
          {/* Change Banner Button */}
          <button
            type="button"
            onClick={() => setIsBannerModalOpen(true)}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all active:scale-95 cursor-pointer shadow-lg"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Cambiar Banner</span>
          </button>
        </div>

        {/* User Identity Container */}
        <div className="relative px-4 pb-4 -mt-14 sm:-mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            
            {/* Avatar with Level Badge */}
            <div className="relative group">
              <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-2xl">
                <img
                  src={profile.avatarUrl}
                  alt={profile.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-[22px] object-cover bg-[#090b14]"
                />
              </div>

              {/* Avatar change overlay trigger */}
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute inset-0 rounded-3xl bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer text-[10px] font-bold"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                Editar
              </button>

              {/* Level indicator pill */}
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-[#090b14] border border-purple-500 rounded-full text-[10px] font-black text-purple-300 shadow-md">
                Nv. {profile.level}
              </div>
            </div>

            {/* Edit Profile CTA */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1a2035] hover:bg-[#232b45] text-slate-100 text-xs font-bold border border-[#2b3552] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Editar Perfil</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(window.location.href, 'share')}
                className="p-2 rounded-xl bg-[#1a2035] hover:bg-[#232b45] text-slate-300 hover:text-white border border-[#2b3552] transition-colors cursor-pointer"
                title="Compartir perfil"
              >
                {copiedText === 'share' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Username, Tag and Badges */}
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-white font-['Space_Grotesk'] tracking-tight">
                {profile.username}
              </h2>
              <span className="text-sm font-mono font-bold text-purple-400">
                {profile.tag}
              </span>

              <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/50 text-purple-300 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                {profile.tierBadge}
              </span>
            </div>

            {/* Bio */}
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {profile.bio || 'Sin descripción aún. ¡Personaliza tu biografía gamer!'}
            </p>

            {/* Metadata Tags: Discord & Steam PC ID */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              {profile.discordHandle && (
                <div
                  onClick={() => handleCopy(profile.discordHandle, 'discord')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#5865F2]/15 border border-[#5865F2]/30 text-indigo-300 hover:bg-[#5865F2]/25 cursor-pointer transition-colors"
                  title="Copiar Discord"
                >
                  <MessageSquare className="w-3 h-3 text-[#5865F2]" />
                  <span>{profile.discordHandle}</span>
                  {copiedText === 'discord' && (
                    <span className="text-[9px] text-emerald-400 font-bold">¡Copiado!</span>
                  )}
                </div>
              )}

              {/* Official Discord Server Link */}
              <a
                href="https://discord.gg/xzyz2UQyjY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium cursor-pointer transition-colors shadow-sm shadow-[#5865F2]/30"
                title="Unirse al Servidor de Discord de FTP"
              >
                <MessageSquare className="w-3 h-3 fill-white" />
                <span>discord.gg/xzyz2UQyjY</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>

              {profile.steamId64 && (
                <div
                  onClick={() => handleCopy(profile.steamId64, 'steam')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14192b] border border-[#232b45] text-slate-300 hover:bg-[#1b223a] cursor-pointer transition-colors"
                  title="Copiar Steam ID"
                >
                  <Monitor className="w-3 h-3 text-blue-400" />
                  <span className="font-mono">Steam: {profile.steamId64}</span>
                  {copiedText === 'steam' && (
                    <span className="text-[9px] text-emerald-400 font-bold">¡Copiado!</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1 text-slate-400 text-[10px] ml-auto">
                <Calendar className="w-3 h-3" />
                <span>Desde {profile.memberSince}</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4 pt-3 border-t border-[#1a2135] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Progreso de Rango FTP
              </span>
              <span className="font-mono text-purple-300 font-bold text-[11px]">
                {profile.xp} / 3500 XP
              </span>
            </div>
            <div className="h-2 w-full bg-[#121626] rounded-full overflow-hidden p-0.5 border border-[#1f2740]">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.round((profile.xp / 3500) * 100))}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Super Admin Status & Powers Banner */}
      {profile.isAdmin ? (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/50 to-indigo-950/40 border border-amber-500/40 p-4 shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold leading-none">
                  ROL MAESTRO
                </span>
                <span className="block text-sm font-bold text-white tracking-wide">
                  Super Administrador FTP
                </span>
              </div>
            </div>

            {onOpenAdminPanel && (
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Abrir Panel de Control</span>
              </button>
            )}
          </div>

          <p className="text-xs text-amber-200/80 leading-relaxed">
            Tienes autorización total sobre la plataforma. Puedes editar cualquier juego, gestionar credenciales de Steam, publicar comunicados y usar superpoderes instantáneos.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-500/20">
            {onUnlockAllGames && (
              <button
                type="button"
                onClick={onUnlockAllGames}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Desbloquea instantáneamente todos los juegos"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Desbloquear Todo</span>
              </button>
            )}

            {onMaxLevel && (
              <button
                type="button"
                onClick={onMaxLevel}
                className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Sube al nivel 99 con 99,999 XP"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Nivel 99 Máx</span>
              </button>
            )}

            {onUnlockAllAchievements && (
              <button
                type="button"
                onClick={onUnlockAllAchievements}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Desbloquea todos los logros gamer"
              >
                <Trophy className="w-3 h-3 text-emerald-400" />
                <span>Todos los Logros</span>
              </button>
            )}

            {onToggleAdminProfile && (
              <button
                type="button"
                onClick={onToggleAdminProfile}
                className="ml-auto px-2.5 py-1.5 rounded-xl bg-[#14192b] hover:bg-[#1a2139] border border-[#232c4a] text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                title="Cerrar sesión de administrador y volver al modo gamer estándar"
              >
                <LogOut className="w-3 h-3 text-slate-400" />
                <span>Cerrar Modo Admin</span>
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="p-3 rounded-2xl bg-[#0f1220] border border-[#1d2338] text-center space-y-0.5">
          <div className="flex items-center justify-center text-purple-400 mb-1">
            <KeyRound className="w-4 h-4" />
          </div>
          <div className="text-lg font-black text-white font-['Space_Grotesk']">
            {unlockedCount}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Desbloqueados
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#0f1220] border border-[#1d2338] text-center space-y-0.5">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-lg font-black text-white font-['Space_Grotesk']">
            {totalHoursLogged}h
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Horas Jugadas
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#0f1220] border border-[#1d2338] text-center space-y-0.5">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-lg font-black text-white font-['Space_Grotesk']">
            {profile.achievements.filter((a) => a.unlocked).length}/{profile.achievements.length}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Logros VIP
          </div>
        </div>
      </div>

      {/* Profile Section Subtabs */}
      <div className="flex items-center p-1 bg-[#0c0f1d] border border-[#1a2135] rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveSubTab('historial')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'historial'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Historial ({unlockedCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('cuenta')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'cuenta'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Gestionar Cuenta</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('logros')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'logros'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Logros</span>
        </button>
      </div>

      {/* SUBTAB 1: UNLOCKED GAMES HISTORY */}
      {activeSubTab === 'historial' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              Juegos Desbloqueados en esta Cuenta
            </h3>
            {profile.unlockedHistory.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Vaciar historial
              </button>
            )}
          </div>

          {profile.unlockedHistory.length > 0 ? (
            <div className="space-y-2">
              {profile.unlockedHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectGame(item.gameId)}
                  className="p-3 rounded-2xl bg-[#0f1220] border border-[#1e253c] hover:border-purple-500/40 transition-all cursor-pointer group flex items-center gap-3"
                >
                  {/* Game Cover */}
                  <img
                    src={item.coverUrl}
                    alt={item.gameTitle}
                    className="w-12 h-16 rounded-xl object-cover bg-[#151928] shrink-0 group-hover:scale-105 transition-transform"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                        {item.gameTitle}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[9px] shrink-0">
                        DESBLOQUEADO
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>Cuenta: <strong>{item.accountUsername}</strong></span>
                      <span>•</span>
                      <span>Código: <strong>{item.unlockCodeUsed}</strong></span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                      <span>{item.unlockedAt}</span>
                      <span className="text-purple-400 group-hover:underline flex items-center gap-0.5">
                        Ver Credenciales
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Delete individual record */}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveHistoryItem(item.id, e)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
                    title="Eliminar del historial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#0f1220]/60 border border-dashed border-[#1f2740] space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">
                Aún no has desbloqueado ningún juego
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Visita la pestaña Juegos, introduce el código de Discord H70409 y desbloquea títulos para que aparezcan aquí automáticamente.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: ACCOUNT MANAGEMENT & SETTINGS */}
      {activeSubTab === 'cuenta' && (
        <div className="space-y-4">
          
          {/* Identity Quick Edit */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-[#1e253c] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-400" />
                Datos de la Cuenta Gamer
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
              >
                Editar Todo
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#141829] border border-[#212942]">
                <span className="text-[10px] text-slate-400 block">Usuario y Tag</span>
                <span className="font-bold text-white">
                  {profile.username} <span className="text-purple-400">{profile.tag}</span>
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141829] border border-[#212942]">
                <span className="text-[10px] text-slate-400 block">Servidor Discord</span>
                <span className="font-bold text-indigo-300 truncate block">
                  {profile.discordHandle}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141829] border border-[#212942]">
                <span className="text-[10px] text-slate-400 block">Steam ID (PC)</span>
                <span className="font-mono text-slate-200 truncate block">
                  {profile.steamId64}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141829] border border-[#212942]">
                <span className="text-[10px] text-slate-400 block">Región Preferida</span>
                <span className="font-bold text-slate-200 truncate block">
                  {profile.preferredRegion}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Customization Buttons */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-[#1e253c] space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              Personalización Visual
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(true)}
                className="p-3 rounded-xl bg-[#141829] hover:bg-[#1a2035] border border-[#212942] text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                  Selector de Banner
                </div>
                <div className="text-[10px] text-slate-400">
                  Temas Cyber, Espacio, Synthwave
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="p-3 rounded-xl bg-[#141829] hover:bg-[#1a2035] border border-[#212942] text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  Selector de Avatar
                </div>
                <div className="text-[10px] text-slate-400">
                  Iconos gamer y perfiles 3D
                </div>
              </button>
            </div>
          </div>

          {/* Preferences and Privacy Toggles */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-[#1e253c] space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-emerald-400" />
              Ajustes de Seguridad y Modo Offline
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141829] border border-[#212942]">
                <div>
                  <span className="font-bold text-slate-200 block">Recordatorio de Modo Desconectado</span>
                  <span className="text-[10px] text-slate-400">
                    Avisar para cambiar Steam a Offline tras desbloquear
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('autoOfflinePrompt')}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 ${
                    profile.settings.autoOfflinePrompt ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      profile.settings.autoOfflinePrompt ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141829] border border-[#212942]">
                <div>
                  <span className="font-bold text-slate-200 block">Modo Streamer / Antiespía</span>
                  <span className="text-[10px] text-slate-400">
                    Ocultar contraseñas en pantalla por defecto
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('streamerMode')}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 ${
                    profile.settings.streamerMode ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      profile.settings.streamerMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#141829] border border-[#212942] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block text-xs">Sincronización con Discord</span>
                    <span className="text-[10px] text-slate-400">
                      Conectar estado VIP al servidor <strong className="text-indigo-300">discord.gg/xzyz2UQyjY</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting('discordSync')}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 ${
                      profile.settings.discordSync ? 'bg-[#5865F2]' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        profile.settings.discordSync ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="pt-1 flex justify-end">
                  <a
                    href="https://discord.gg/xzyz2UQyjY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-indigo-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 text-[#5865F2]" />
                    <span>Abrir servidor discord.gg/xzyz2UQyjY</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Account Session Management */}
          <div className="p-4 rounded-2xl bg-[#0f1220] border border-[#1e253c] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Sesión de Cuenta</h3>
                  <span className="text-[10px] text-slate-400">Conectado actualmente como <strong className="text-purple-300">{profile.username}</strong></span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Inicia sesión con otra cuenta existente o cambia de perfil gamer en cualquier momento.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {onSwitchAccount && (
                <button
                  type="button"
                  onClick={onSwitchAccount}
                  className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#141829] hover:bg-[#1c223a] border border-[#232c48] text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cambiar de Cuenta / Iniciar Sesión</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3: ACHIEVEMENTS & VIP TIER */}
      {activeSubTab === 'logros' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-[#0f1220] border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest block">
                Nivel de Membresía
              </span>
              <h4 className="text-sm font-black text-white">
                Rango Actual: {profile.tierBadge}
              </h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="space-y-2">
            {profile.achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                  ach.unlocked
                    ? 'bg-[#0f1220] border-emerald-500/30'
                    : 'bg-[#0a0d17] border-[#1a2135] opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Trophy className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white truncate">
                      {ach.title}
                    </h5>
                    {ach.unlocked && ach.unlockedAt && (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {ach.unlockedAt}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROFILE FORM */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0e1220] border border-purple-500/40 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Editar Perfil Gamer</h3>
                <span className="text-[11px] text-purple-300">Gestiona tus datos personales</span>
              </div>
            </div>

            {/* Quick Upload Action Bar inside edit form */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141829] border border-[#232c48]">
              <div className="relative shrink-0">
                <img
                  src={profile.avatarUrl}
                  alt={profile.username}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover border border-purple-500/50 bg-[#0b0e1b]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-white block">Foto de Perfil y Banner</span>
                <span className="text-[10px] text-slate-400 block truncate">Sube tu PFP y Banner desde tu PC o móvil</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-1">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white rounded-lg text-[10px] font-bold border border-purple-500/40 transition-colors cursor-pointer"
                >
                  Subir PFP
                </button>
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(true)}
                  className="px-2.5 py-1 bg-[#1e253c] hover:bg-[#283252] text-slate-300 hover:text-white rounded-lg text-[10px] font-bold border border-[#313c60] transition-colors cursor-pointer"
                >
                  Subir Banner
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveProfileInfo} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#141829] border border-[#232c48] focus:border-purple-500 text-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Tag Gamer (ej: #0704)
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#141829] border border-[#232c48] focus:border-purple-500 text-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Biografía
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#141829] border border-[#232c48] focus:border-purple-500 text-white rounded-xl outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Usuario o Tag de Discord
                </label>
                <input
                  type="text"
                  value={formData.discordHandle}
                  onChange={(e) => setFormData({ ...formData, discordHandle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141829] border border-[#232c48] focus:border-purple-500 text-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Steam ID64 de PC
                </label>
                <input
                  type="text"
                  value={formData.steamId64}
                  onChange={(e) => setFormData({ ...formData, steamId64: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141829] border border-[#232c48] focus:border-purple-500 text-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Región
                </label>
                <select
                  value={formData.preferredRegion}
                  onChange={(e) => setFormData({ ...formData, preferredRegion: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141829] border border-[#232c48] focus:border-purple-500 text-white rounded-xl outline-none"
                >
                  <option value="América Latina (Global)">América Latina (Global)</option>
                  <option value="España / Europa">España / Europa</option>
                  <option value="Norteamérica (US/CA)">Norteamérica (US/CA)</option>
                  <option value="Global Internacional">Global Internacional</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2 rounded-xl bg-[#1a2035] hover:bg-[#232b45] text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BANNER PICKER */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0e1220] border border-purple-500/40 p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setIsBannerModalOpen(false);
                setUploadedBannerData(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Personalizar Banner de Perfil</h3>
            </div>

            {/* Sub-tabs selector */}
            <div className="flex rounded-xl bg-[#141829] p-1 border border-[#232c48] text-xs">
              <button
                type="button"
                onClick={() => setBannerTab('upload')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  bannerTab === 'upload'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Subir Archivo</span>
              </button>
              <button
                type="button"
                onClick={() => setBannerTab('presets')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  bannerTab === 'presets'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Galería</span>
              </button>
              <button
                type="button"
                onClick={() => setBannerTab('url')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  bannerTab === 'url'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Enlace URL</span>
              </button>
            </div>

            {/* Tab 1: Direct File Upload */}
            {bannerTab === 'upload' && (
              <div className="space-y-3">
                <ImageUploadDropzone
                  label="Arrastra y suelta tu nuevo Banner"
                  sublabel="O haz clic para buscar una imagen en tu PC o teléfono"
                  aspectType="banner"
                  onImageReady={(dataUrl) => setUploadedBannerData(dataUrl)}
                />

                {uploadedBannerData && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectBanner(uploadedBannerData);
                      setUploadedBannerData(null);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Aplicar este Banner</span>
                  </button>
                )}
              </div>
            )}

            {/* Tab 2: Gallery Presets */}
            {bannerTab === 'presets' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">Selecciona un arte de nuestra colección:</p>
                <div className="grid grid-cols-2 gap-2">
                  {BANNER_PRESETS.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBanner(b.url)}
                      className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        profile.bannerUrl === b.url
                          ? 'border-purple-500 shadow-md shadow-purple-500/30 scale-102'
                          : 'border-[#222a42] hover:border-purple-400/50'
                      }`}
                    >
                      <img src={b.url} alt={b.name} className="w-full h-18 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex items-end">
                        <span className="text-[10px] font-bold text-white truncate">
                          {b.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Custom URL */}
            {bannerTab === 'url' && (
              <div className="space-y-2 text-xs">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Ingresa un enlace directo a la imagen del banner
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customBannerUrl}
                    onChange={(e) => setCustomBannerUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-[#141829] border border-[#232c48] focus:border-purple-500 text-white rounded-xl outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customBannerUrl.trim()) {
                        handleSelectBanner(customBannerUrl.trim());
                      }
                    }}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: AVATAR PICKER */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0e1220] border border-cyan-500/40 p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setIsAvatarModalOpen(false);
                setUploadedAvatarData(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Personalizar Foto de Perfil (PFP)</h3>
            </div>

            {/* Sub-tabs selector */}
            <div className="flex rounded-xl bg-[#141829] p-1 border border-[#232c48] text-xs">
              <button
                type="button"
                onClick={() => setAvatarTab('upload')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarTab === 'upload'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Subir mi Foto</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab('presets')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarTab === 'presets'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Anime</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab('url')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  avatarTab === 'url'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Enlace URL</span>
              </button>
            </div>

            {/* Tab 1: Direct File Upload */}
            {avatarTab === 'upload' && (
              <div className="space-y-3">
                <ImageUploadDropzone
                  label="Arrastra y suelta tu foto o avatar"
                  sublabel="O haz clic para seleccionar una foto desde tus archivos"
                  aspectType="avatar"
                  onImageReady={(dataUrl) => setUploadedAvatarData(dataUrl)}
                />

                {uploadedAvatarData && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectAvatar(uploadedAvatarData);
                      setUploadedAvatarData(null);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4 text-black" />
                    <span>Guardar y Usar como Foto de Perfil</span>
                  </button>
                )}
              </div>
            )}

            {/* Tab 2: Anime Gallery Presets */}
            {avatarTab === 'presets' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">Colección exclusiva de personajes anime:</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {AVATAR_PRESETS.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleSelectAvatar(a.url)}
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all p-0.5 ${
                        profile.avatarUrl === a.url
                          ? 'border-cyan-400 shadow-md shadow-cyan-400/30 scale-105'
                          : 'border-[#222a42] hover:border-cyan-400/50'
                      }`}
                    >
                      <img
                        src={a.url}
                        alt={a.name}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      <span className="text-[9px] font-bold text-slate-300 block text-center mt-1 truncate">
                        {a.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Custom URL */}
            {avatarTab === 'url' && (
              <div className="space-y-2 text-xs">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Ingresa un enlace directo a tu foto / avatar
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-[#141829] border border-[#232c48] focus:border-cyan-400 text-white rounded-xl outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAvatarUrl.trim()) {
                        handleSelectAvatar(customAvatarUrl.trim());
                      }
                    }}
                    className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
