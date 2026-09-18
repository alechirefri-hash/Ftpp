import React, { useState } from 'react';
import { Game, UserProfile } from '../types';
import { getAdminPassword, setAdminPassword } from '../utils/adminAuth';
import {
  X,
  Shield,
  Gamepad2,
  KeyRound,
  MessageSquare,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Copy,
  Check,
  RotateCcw,
  Trophy,
  Activity,
  Server,
  Zap,
  CheckCircle2,
  Search,
  ExternalLink,
  Users,
  Bell,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  userProfile: UserProfile;
  announcementText: string;
  onUpdateAnnouncement: (text: string) => void;
  onAddNewGame: () => void;
  onEditGame: (game: Game) => void;
  onDeleteGame: (gameId: string) => void;
  onToggleGameLock: (gameId: string) => void;
  onUnlockAllGames: () => void;
  onLockAllGames: () => void;
  onResetDefaultGames: () => void;
  onToggleAdminProfile: () => void;
  onUnlockAllAchievements: () => void;
  onMaxLevel: () => void;
  onTestNewGameNotification?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  games,
  userProfile,
  announcementText,
  onUpdateAnnouncement,
  onAddNewGame,
  onEditGame,
  onDeleteGame,
  onToggleGameLock,
  onUnlockAllGames,
  onLockAllGames,
  onResetDefaultGames,
  onToggleAdminProfile,
  onUnlockAllAchievements,
  onMaxLevel,
  onTestNewGameNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'games' | 'accounts' | 'announcement' | 'powers'>('games');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customAnnouncement, setCustomAnnouncement] = useState(announcementText);
  const [announcementSavedToast, setAnnouncementSavedToast] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [currentAdminPassword, setCurrentAdminPassword] = useState(() => getAdminPassword());

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 2500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAnnouncement = () => {
    onUpdateAnnouncement(customAnnouncement);
    setAnnouncementSavedToast(true);
    setTimeout(() => setAnnouncementSavedToast(false), 2500);
  };

  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.accountUsername || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGames = games.length;
  const lockedGames = games.filter((g) => g.isCodeLocked).length;
  const unlockedGames = totalGames - lockedGames;
  const rentalGames = games.filter((g) => g.isRental).length;
  const freeGames = games.filter((g) => g.isFree).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0d111e] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1b2238] bg-[#090c17]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 shadow-lg shadow-purple-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d111e] rounded-[14px] flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5 fill-amber-400/20 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-['Space_Grotesk'] tracking-tight">
                  Panel de Control Super Admin FTP
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase">
                  ROOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Operador: <strong className="text-purple-300">{userProfile.username}</strong> • Permisos Totales Habilitados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#151a2d] hover:bg-[#1e2540] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toast Notification */}
        {(actionSuccessToast || announcementSavedToast) && (
          <div className="mx-4 mt-3 py-2 px-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessToast || 'Aviso global del sitio actualizado correctamente'}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#1b2238] bg-[#0b0e1b] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'games'
                ? 'border-purple-500 text-white bg-[#14192b]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Gestor de Juegos ({totalGames})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-purple-500 text-white bg-[#14192b]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Cuentas Steam</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('powers')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'powers'
                ? 'border-purple-500 text-white bg-[#14192b]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Superpoderes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcement')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'announcement'
                ? 'border-purple-500 text-white bg-[#14192b]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Aviso del Sitio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'stats'
                ? 'border-purple-500 text-white bg-[#14192b]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Métricas</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: GESTOR DE JUEGOS */}
          {activeTab === 'games' && (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar juego por título o usuario..."
                    className="w-full pl-9 pr-3 py-2 bg-[#121628] border border-[#1e253e] rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAddNewGame();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar Nuevo Juego</span>
                </button>

                {onTestNewGameNotification && (
                  <button
                    type="button"
                    onClick={() => {
                      onTestNewGameNotification();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#171c30] hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 hover:text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                    title="Previsualizar alerta toast de nuevo juego"
                  >
                    <Bell className="w-3.5 h-3.5 text-purple-400" />
                    <span>Probar Alerta Toast</span>
                  </button>
                )}
              </div>

              {/* Games Table/List */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#121628] border border-[#1e2640] hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={game.coverUrl}
                          alt={game.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">
                            {game.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="font-mono text-purple-300">
                              {game.accountUsername || 'Sin cuenta'}
                            </span>
                            <span>•</span>
                            <span className={game.isCodeLocked ? 'text-amber-400' : 'text-emerald-400'}>
                              {game.isCodeLocked ? 'Bloqueado con código' : 'Desbloqueado'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onToggleGameLock(game.id);
                            showToast(game.isCodeLocked ? `Juego "${game.title}" desbloqueado` : `Juego "${game.title}" protegido con código`);
                          }}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            game.isCodeLocked
                              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
                              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                          }`}
                          title={game.isCodeLocked ? 'Desbloquear juego para usuarios' : 'Bloquear con código VIP'}
                        >
                          {game.isCodeLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onEditGame(game);
                          }}
                          className="p-2 rounded-xl bg-[#1a2038] hover:bg-[#242c4c] border border-[#263052] text-slate-200 hover:text-white transition-colors cursor-pointer"
                          title="Editar ficha y credenciales"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`¿Seguro que deseas eliminar permanentemente "${game.title}" de la biblioteca?`)) {
                              onDeleteGame(game.id);
                              showToast(`Juego "${game.title}" eliminado`);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-500/30 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                          title="Eliminar juego"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-xs text-slate-400">
                    No se encontraron juegos con ese criterio de búsqueda.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CUENTAS STEAM */}
          {activeTab === 'accounts' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Inventario centralizado de credenciales de Steam compartidas para el catálogo de juegos.
              </p>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="p-3 rounded-2xl bg-[#121628] border border-[#1f2742] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[200px]">
                        {game.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                        Código VIP: {game.unlockCode || 'H70409'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#0b0e1b] border border-[#1b223a]">
                        <span className="text-slate-400 text-[11px]">Usuario:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-300 font-bold">{game.accountUsername || 'STEAM_VIP'}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(game.accountUsername || '', `usr-${game.id}`)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            title="Copiar usuario"
                          >
                            {copiedId === `usr-${game.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#0b0e1b] border border-[#1b223a]">
                        <span className="text-slate-400 text-[11px]">Contraseña:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-blue-300 truncate max-w-[120px]">{game.accountPassword || '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(game.accountPassword || '', `pwd-${game.id}`)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            title="Copiar contraseña"
                          >
                            {copiedId === `pwd-${game.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUPERPODERES Y ACCIONES MAESTRAS */}
          {activeTab === 'powers' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-white">Comandos Maestros del Sistema</h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    Ejecuta acciones globales instantáneas sobre toda la base de datos de juegos y sobre el perfil de usuario.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Unlock All Games */}
                <button
                  type="button"
                  onClick={() => {
                    onUnlockAllGames();
                    showToast('¡Todos los juegos han sido desbloqueados sin códigos!');
                  }}
                  className="p-3 rounded-2xl bg-[#13182b] hover:bg-[#1b223d] border border-[#212946] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Unlock className="w-4 h-4" />
                    <span>Desbloquear Todos los Juegos</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Elimina el bloqueo por código VIP en toda la biblioteca completa.
                  </p>
                </button>

                {/* Lock All Games */}
                <button
                  type="button"
                  onClick={() => {
                    onLockAllGames();
                    showToast('Todos los juegos vuelven a requerir código VIP de Discord');
                  }}
                  className="p-3 rounded-2xl bg-[#13182b] hover:bg-[#1b223d] border border-[#212946] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Lock className="w-4 h-4" />
                    <span>Bloquear Todos con Código VIP</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Exige a los usuarios introducir el código de Discord para ver las credenciales.
                  </p>
                </button>

                {/* Max Out Level */}
                <button
                  type="button"
                  onClick={() => {
                    onMaxLevel();
                    showToast('Perfil elevado a Nivel 99 con 99,999 XP');
                  }}
                  className="p-3 rounded-2xl bg-[#13182b] hover:bg-[#1b223d] border border-[#212946] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <Trophy className="w-4 h-4" />
                    <span>Otorgar Nivel 99 y XP Máxima</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ajusta inmediatamente el nivel del perfil actual a Nivel 99.
                  </p>
                </button>

                {/* Unlock All Achievements */}
                <button
                  type="button"
                  onClick={() => {
                    onUnlockAllAchievements();
                    showToast('¡Todos los logros del perfil han sido desbloqueados!');
                  }}
                  className="p-3 rounded-2xl bg-[#13182b] hover:bg-[#1b223d] border border-[#212946] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Desbloquear Todos los Logros</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Otorga todas las medallas y logros disponibles en la cuenta.
                  </p>
                </button>

                {/* Toggle Admin / User Profile */}
                <button
                  type="button"
                  onClick={() => {
                    onToggleAdminProfile();
                    showToast(userProfile.isAdmin ? 'Cambiado a Perfil Gamer Estándar' : 'Cambiado a Perfil Super Admin Maestro');
                  }}
                  className="p-3 rounded-2xl bg-[#13182b] hover:bg-[#1b223d] border border-[#212946] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Users className="w-4 h-4" />
                    <span>{userProfile.isAdmin ? 'Cambiar a Perfil Gamer Estándar' : 'Activar Perfil Super Admin'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Alterna entre el perfil Alex_Gamer y el perfil raíz Admin_FTP_Master.
                  </p>
                </button>

                {/* Reset Default Games */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Deseas restaurar la lista de juegos de fábrica a su estado original?')) {
                      onResetDefaultGames();
                      showToast('Biblioteca restaurada a los juegos predeterminados');
                    }
                  }}
                  className="p-3 rounded-2xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <RotateCcw className="w-4 h-4" />
                    <span>Restaurar Juegos de Fábrica</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Reinicia las credenciales y títulos al catálogo base predeterminado.
                  </p>
                </button>

                {/* Admin Password Management */}
                <div className="p-3.5 rounded-2xl bg-[#13182b] border border-amber-500/30 text-left space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>Contraseña de Acceso del Administrador</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Clave actual: {currentAdminPassword ? '••••••••' : 'admin123'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Cambia la contraseña requerida para acceder a la cuenta de Super Admin y proteger las funciones de gestión.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="password"
                      placeholder="Escribe la nueva contraseña de Super Admin"
                      value={adminPassInput}
                      onChange={(e) => setAdminPassInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0e1222] border border-[#232c48] focus:border-amber-500 text-white rounded-xl text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!adminPassInput.trim() || adminPassInput.trim().length < 4) {
                          showToast('La contraseña debe tener al menos 4 caracteres');
                          return;
                        }
                        setAdminPassword(adminPassInput.trim());
                        setCurrentAdminPassword(adminPassInput.trim());
                        setAdminPassInput('');
                        showToast('✓ Contraseña de Super Admin actualizada correctamente');
                      }}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-md shrink-0"
                    >
                      Guardar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AVISO DEL SITIO */}
          {activeTab === 'announcement' && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-300 leading-relaxed">
                Modifica el texto del comunicado oficial del sitio que ven los usuarios al ingresar a la biblioteca de juegos.
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Contenido del Comunicado
                </label>
                <textarea
                  rows={5}
                  value={customAnnouncement}
                  onChange={(e) => setCustomAnnouncement(e.target.value)}
                  className="w-full p-3.5 bg-[#121628] border border-[#1f2742] rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:border-purple-500 outline-none leading-relaxed"
                  placeholder="Escribe el aviso que se mostrará a los usuarios..."
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCustomAnnouncement(
                      'Nuestras cuentas sí son compatibles con el lanzador oficial de Steam para PC y con GeForce NOW. Solo recuerda que no debes vincular la cuenta a servicios externos.'
                    );
                  }}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Restablecer texto original
                </button>

                <button
                  type="button"
                  onClick={handleSaveAnnouncement}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Comunicado</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: MÉTRICAS Y ESTADO */}
          {activeTab === 'stats' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#121628] border border-[#1f2742]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Juegos</span>
                  <div className="text-xl font-black text-white mt-0.5">{totalGames}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#121628] border border-[#1f2742]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Desbloqueados</span>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">{unlockedGames}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#121628] border border-[#1f2742]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">En Alquiler</span>
                  <div className="text-xl font-black text-purple-400 mt-0.5">{rentalGames}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#121628] border border-[#1f2742]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Gratuitos</span>
                  <div className="text-xl font-black text-cyan-400 mt-0.5">{freeGames}</div>
                </div>
              </div>

              {/* Infrastructure Status */}
              <div className="p-4 rounded-2xl bg-[#121628] border border-[#1f2742] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-400" />
                    Pasarela de Servidores FTP
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                    100% OPERATIVO
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Todos los nodos de entrega y almacenamiento de licencias en la nube están sincronizados con la aplicación de escritorio de Steam en PC.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1b2238] bg-[#090c17]/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Consola de Administrador Conectada</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1a2035] hover:bg-[#242c4b] text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-[#2b3554] transition-colors cursor-pointer"
          >
            Cerrar Consola
          </button>
        </div>

      </div>
    </div>
  );
};
