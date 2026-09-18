import React, { useState, useEffect } from 'react';
import { Game, Platform, GameStatus } from '../types';
import { PRESET_COVERS } from '../data/initialGames';
import {
  X,
  Plus,
  Star,
  Clock,
  Upload,
  Image as ImageIcon,
  Check,
  Sparkles,
  Gamepad2,
  Bookmark,
  Shield,
  KeyRound,
  Lock,
} from 'lucide-react';

interface GameFormModalProps {
  isOpen: boolean;
  gameToEdit?: Game | null;
  onClose: () => void;
  onSave: (gameData: Omit<Game, 'id' | 'dateAdded'> & { id?: string }) => void;
}

const PLATFORMS: Platform[] = [
  'Steam',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Epic Games',
  'GOG',
  'PC',
  'Retro',
  'Otro',
];

const COMMON_GENRES = [
  'Acción',
  'RPG',
  'Aventura',
  'Shooter',
  'Mundo Abierto',
  'Metroidvania',
  'Roguelike',
  'Indie',
  'Estrategia',
  'Terror',
  'Carreras',
  'Simulación',
  'Plataformas',
  'Deportes',
  'Puzzle',
];

export const GameFormModal: React.FC<GameFormModalProps> = ({
  isOpen,
  gameToEdit,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('Steam');
  const [platformDisplay, setPlatformDisplay] = useState<string>('Steam Offline');
  const [badge, setBadge] = useState<string>('NEW');
  const [accessBadge, setAccessBadge] = useState<string>('FREE');
  const [status, setStatus] = useState<GameStatus>('jugando');
  const [rating, setRating] = useState<number>(5);
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [genres, setGenres] = useState<string[]>(['Acción']);
  const [customGenreInput, setCustomGenreInput] = useState('');
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [developer, setDeveloper] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [guideNotes, setGuideNotes] = useState<string>('');
  const [isPrivateGuide, setIsPrivateGuide] = useState<boolean>(true);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [accountUsername, setAccountUsername] = useState<string>('');
  const [accountPassword, setAccountPassword] = useState<string>('');
  const [unlockCode, setUnlockCode] = useState<string>('H70409');
  const [isCodeLocked, setIsCodeLocked] = useState<boolean>(true);
  const [isRental, setIsRental] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(true);
  const [systemRequirementsMin, setSystemRequirementsMin] = useState<string>('');
  const [systemRequirementsRec, setSystemRequirementsRec] = useState<string>('');
  const [imageTab, setImageTab] = useState<'presets' | 'url' | 'upload'>('presets');

  // Initialize form when editing or adding
  useEffect(() => {
    if (gameToEdit) {
      setTitle(gameToEdit.title);
      setPlatform(gameToEdit.platform);
      setPlatformDisplay(gameToEdit.platformDisplay || (gameToEdit.platform === 'Steam' ? 'Steam Offline' : gameToEdit.platform));
      setBadge(gameToEdit.badge || 'NEW');
      setAccessBadge(gameToEdit.accessBadge || 'FREE');
      setStatus(gameToEdit.status);
      setRating(gameToEdit.rating);
      setHoursPlayed(gameToEdit.hoursPlayed);
      setCoverUrl(gameToEdit.coverUrl);
      setBannerUrl(gameToEdit.bannerUrl || '');
      setGenres(gameToEdit.genres || []);
      setReleaseYear(gameToEdit.releaseYear ? String(gameToEdit.releaseYear) : '');
      setDeveloper(gameToEdit.developer || '');
      setReview(gameToEdit.review || '');
      setPersonalNotes(gameToEdit.personalNotes || '');
      setGuideNotes(gameToEdit.guideNotes || '');
      setIsPrivateGuide(gameToEdit.isPrivateGuide !== false);
      setFavorite(gameToEdit.favorite || false);
      setAccountUsername(gameToEdit.accountUsername || '');
      setAccountPassword(gameToEdit.accountPassword || '');
      setUnlockCode(gameToEdit.unlockCode || 'H70409');
      setIsCodeLocked(gameToEdit.isCodeLocked !== false);
      setIsRental(gameToEdit.isRental || false);
      setIsFree(gameToEdit.isFree !== false);
      setSystemRequirementsMin(gameToEdit.systemRequirementsMin || '');
      setSystemRequirementsRec(gameToEdit.systemRequirementsRec || '');
    } else {
      setTitle('');
      setPlatform('Steam');
      setPlatformDisplay('Steam Offline');
      setBadge('NEW');
      setAccessBadge('FREE');
      setStatus('jugando');
      setRating(5);
      setHoursPlayed(0);
      setCoverUrl(PRESET_COVERS[0].url);
      setBannerUrl('');
      setGenres(['Acción']);
      setReleaseYear(new Date().getFullYear().toString());
      setDeveloper('');
      setReview('');
      setPersonalNotes('');
      setGuideNotes('');
      setIsPrivateGuide(true);
      setFavorite(false);
      setAccountUsername('STEAM_USER_VIP');
      setAccountPassword('SteamP@ss2026');
      setUnlockCode('H70409');
      setIsCodeLocked(true);
      setIsRental(false);
      setIsFree(true);
      setSystemRequirementsMin('Windows 10/11 64-bit, 8GB RAM, GTX 1060');
      setSystemRequirementsRec('Windows 11 64-bit, 16GB RAM, RTX 3060');
    }
  }, [gameToEdit, isOpen]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter((g) => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  const handleAddCustomGenre = () => {
    const trimmed = customGenreInput.trim();
    if (trimmed && !genres.includes(trimmed)) {
      setGenres([...genres, trimmed]);
      setCustomGenreInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...(gameToEdit ? { id: gameToEdit.id } : {}),
      title: title.trim(),
      platform,
      platformDisplay: platformDisplay.trim() || undefined,
      badge: badge.trim() || undefined,
      accessBadge: accessBadge.trim() || undefined,
      status,
      rating: Number(rating) || 5,
      hoursPlayed: Number(hoursPlayed) || 0,
      coverUrl: coverUrl.trim() || PRESET_COVERS[0].url,
      bannerUrl: bannerUrl.trim() || undefined,
      genres: genres.length > 0 ? genres : ['General'],
      releaseYear: releaseYear ? parseInt(releaseYear, 10) : undefined,
      developer: developer.trim() || undefined,
      review: review.trim(),
      personalNotes: personalNotes.trim(),
      guideNotes: guideNotes.trim() || undefined,
      isPrivateGuide,
      favorite,
      accountUsername: accountUsername.trim() || undefined,
      accountPassword: accountPassword.trim() || undefined,
      unlockCode: unlockCode.trim() || undefined,
      isCodeLocked,
      isRental,
      isFree,
      systemRequirementsMin: systemRequirementsMin.trim() || undefined,
      systemRequirementsRec: systemRequirementsRec.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                {gameToEdit ? 'Editar Ficha del Juego' : 'Registrar Nuevo Juego'}
              </h2>
              <p className="text-xs text-slate-400">
                Añade o modifica los datos en tu inventario digital
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Game Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Título del Videojuego *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Elden Ring, Hollow Knight, Cyberpunk 2077..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Platform & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Plataforma Base *
              </label>
              <select
                value={platform}
                onChange={(e) => {
                  const val = e.target.value as Platform;
                  setPlatform(val);
                  if (val === 'Steam') setPlatformDisplay('Steam Offline');
                  else setPlatformDisplay(val);
                }}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 focus:border-purple-500 outline-none cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Texto en Tarjeta (Ej: Steam Offline)
              </label>
              <input
                type="text"
                value={platformDisplay}
                onChange={(e) => setPlatformDisplay(e.target.value)}
                placeholder="Steam Offline"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Badges and Access Tier (Matches Screenshot: NEW, FREE) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Insignia Superior (Ej: NEW)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="NEW"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 focus:border-purple-500 outline-none uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Etiqueta de Acceso (Ej: FREE)
              </label>
              <input
                type="text"
                value={accessBadge}
                onChange={(e) => setAccessBadge(e.target.value)}
                placeholder="FREE"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 focus:border-purple-500 outline-none uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Estado Actual *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GameStatus)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 focus:border-purple-500 outline-none cursor-pointer"
              >
                <option value="jugando">🎮 Jugando actualmente</option>
                <option value="pendiente">⏳ Pendiente en biblioteca</option>
                <option value="completado">🏆 Completado</option>
                <option value="deseado">💡 Deseado (Wishlist)</option>
                <option value="pausado">⏸️ En pausa</option>
              </select>
            </div>
          </div>

          {/* Rating & Hours Played */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Calificación ({rating} / 5)
              </label>
              <div className="flex items-center gap-2 py-1 px-3 bg-slate-950 border border-slate-750 rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-400 ml-auto font-mono">
                  {rating === 5 ? '¡Excelente!' : rating >= 4 ? 'Muy bueno' : rating >= 3 ? 'Bueno' : 'Regular'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Horas Jugadas
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={hoursPlayed}
                  onChange={(e) => setHoursPlayed(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cover Art Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Carátula del Videojuego
              </label>
              {/* Tabs for image choice */}
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageTab('presets')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    imageTab === 'presets' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Galería
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    imageTab === 'upload' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Subir Foto
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    imageTab === 'url' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Enlace URL
                </button>
              </div>
            </div>

            {/* Presets Gallery */}
            {imageTab === 'presets' && (
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverUrl(preset.url)}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      coverUrl === preset.url
                        ? 'border-cyan-400 ring-2 ring-cyan-500/30 scale-102'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    title={preset.title}
                  >
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                    {coverUrl === preset.url && (
                      <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Upload from device */}
            {imageTab === 'upload' && (
              <div className="p-4 bg-slate-950/70 border border-dashed border-slate-700 rounded-xl text-center space-y-2">
                <Upload className="w-6 h-6 text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-300">
                  Selecciona una imagen desde tu ordenador o dispositivo
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                />
              </div>
            )}

            {/* Direct URL input */}
            {imageTab === 'url' && (
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://ejemplo.com/caratula-juego.jpg"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            )}
          </div>

          {/* Genres Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Géneros ({genres.length} seleccionados)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              {COMMON_GENRES.map((g) => {
                const isSelected = genres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            {/* Add custom genre */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customGenreInput}
                onChange={(e) => setCustomGenreInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomGenre();
                  }
                }}
                placeholder="Otro género (ej. Cyberpunk, Pixel Art)..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-750 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomGenre}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 cursor-pointer"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Developer & Release Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Desarrollador / Estudio
              </label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="Ej. FromSoftware, Bethesda, Nintendo..."
                className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Año de Lanzamiento
              </label>
              <input
                type="number"
                min="1970"
                max="2035"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                placeholder="2024"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* User Review (Reseña personal) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Tu Reseña Personal
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Escribe tu opinión sobre la historia, jugabilidad, dificultad y por qué lo recomiendas..."
              className="w-full p-3 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Personal Notes (Logros, builds, trucos) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              Notas Personales, Logros y Recordatorios
            </label>
            <textarea
              rows={2}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Ej. Build de Destreza/Magia, me falta el trofeo de rango S..."
              className="w-full p-3 bg-slate-950 border border-slate-750 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Gameplay Guide / Setup Instructions (Protected by Access Code) */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                Guía de Juego y Configuración Técnica
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivateGuide}
                  onChange={(e) => setIsPrivateGuide(e.target.checked)}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Bloquear con Código PIN</span>
              </label>
            </div>
            <textarea
              rows={3}
              value={guideNotes}
              onChange={(e) => setGuideNotes(e.target.value)}
              placeholder="Instrucciones paso a paso, consejos de rendimiento offline, rutas secretas..."
              className="w-full p-3 bg-slate-950 border border-slate-750 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-purple-500 outline-none"
            />
            <p className="text-[11px] text-slate-400">
              Si está marcado con PIN, los usuarios deberán introducir el código de acceso en la ficha para desbloquear y leer estas instrucciones.
            </p>
          </div>

          {/* Steam Account Credentials & Security Section (Admin Control) */}
          <div className="p-4 rounded-xl bg-[#0e1324] border border-cyan-500/30 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                Credenciales de Steam & Permisos de Acceso (Admin)
              </label>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                FTP ROOT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Usuario de Steam
                </label>
                <input
                  type="text"
                  value={accountUsername}
                  onChange={(e) => setAccountUsername(e.target.value)}
                  placeholder="Ej. Q2CHDPUNI6"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Contraseña de Steam
                </label>
                <input
                  type="text"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="Ej. SteamP@ss2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  Código VIP de Desbloqueo
                </label>
                <input
                  type="text"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value)}
                  placeholder="Ej. H70409"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-xl text-xs font-mono text-amber-300 placeholder-slate-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex flex-col justify-end space-y-1.5 pb-1">
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCodeLocked}
                    onChange={(e) => setIsCodeLocked(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>Bloquear con Código VIP (Discord)</span>
                </label>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Gratuito</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRental}
                      onChange={(e) => setIsRental(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span>En Alquiler</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Requisitos de Sistema */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Requisitos Mínimos
                </label>
                <input
                  type="text"
                  value={systemRequirementsMin}
                  onChange={(e) => setSystemRequirementsMin(e.target.value)}
                  placeholder="Ej. Win 10, 8GB RAM, GTX 1060"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-750 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Requisitos Recomendados
                </label>
                <input
                  type="text"
                  value={systemRequirementsRec}
                  onChange={(e) => setSystemRequirementsRec(e.target.value)}
                  placeholder="Ej. Win 11, 16GB RAM, RTX 3060"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-750 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {gameToEdit ? 'Guardar Cambios' : 'Registrar en la Biblioteca'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
