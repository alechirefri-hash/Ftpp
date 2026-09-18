import React from 'react';
import { X, Bell, MessageSquare, ShieldCheck, CheckCircle2, ExternalLink, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { LibraryNotification } from '../types';

interface FTPNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSecurityNotice: () => void;
  localNotifications?: LibraryNotification[];
  onSelectGame?: (gameId: string) => void;
  onClearLocalNotifications?: () => void;
}

export const FTPNotificationsModal: React.FC<FTPNotificationsModalProps> = ({
  isOpen,
  onClose,
  onOpenSecurityNotice,
  localNotifications = [],
  onSelectGame,
  onClearLocalNotifications,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Aviso: Compatibilidad con GeForce NOW y Steam PC',
      desc: 'Las cuentas sí son compatibles con GeForce NOW y Steam PC. Recuerda: solo no tienes que vincular la cuenta a perfiles externos.',
      date: 'Hace 10m',
      urgent: true,
      action: onOpenSecurityNotice,
      actionText: 'Ver Aviso de Seguridad',
    },
    {
      id: 2,
      title: 'Nuevas Cuentas de Steam Añadidas',
      desc: 'Nuevas licencias añadidas para What Remains of Edith Finch, SnowRunner y Hell is Us.',
      date: 'Hace 2h',
      urgent: false,
    },
    {
      id: 3,
      title: 'Rotación de Códigos de Discord',
      desc: 'Los códigos semanales de 6 caracteres del admin han sido renovados en el canal de Discord para los títulos AAA protegidos.',
      date: 'Hace 5h',
      urgent: false,
    },
    {
      id: 4,
      title: 'Pasarela de Servidores Operativa',
      desc: 'Los servidores de descarga y acceso directo a bibliotecas están operando al 100% de capacidad.',
      date: 'Hace 1d',
      urgent: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0e1220] border border-purple-500/40 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notificaciones y Avisos</h3>
              <span className="text-[11px] text-purple-300">Novedades en Directo de FTP</span>
            </div>
          </div>

          {localNotifications.length > 0 && onClearLocalNotifications && (
            <button
              type="button"
              onClick={onClearLocalNotifications}
              className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Limpiar avisos recientes"
            >
              <Trash2 className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Local Admin-Added Game Alerts */}
        {localNotifications.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Nuevos Juegos Añadidos por Admin</span>
              </span>
              <span className="text-[10px] text-purple-300/70 font-semibold">
                {localNotifications.length} {localNotifications.length === 1 ? 'nuevo' : 'nuevos'}
              </span>
            </div>

            <div className="space-y-2">
              {localNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#131728] to-[#101424] border border-purple-500/40 shadow-lg space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    {notif.gameCoverUrl && (
                      <img
                        src={notif.gameCoverUrl}
                        alt={notif.gameTitle || 'Cover'}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-white/10 shrink-0 shadow-sm"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">
                          {notif.gameTitle || notif.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 shrink-0">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-300 line-clamp-1">
                        {notif.gameCategory || 'Añadido recientemente'}
                      </p>
                    </div>
                  </div>

                  {notif.gameId && onSelectGame && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectGame(notif.gameId!);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <span>Ver juego en la biblioteca</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global/Static System Notices */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">
            Avisos Generales del Sistema
          </span>
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border transition-all ${
                n.urgent
                  ? 'bg-blue-950/40 border-blue-500/40'
                  : 'bg-[#131728] border-[#1f263d]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">{n.title}</span>
                <span>{n.date}</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">{n.desc}</p>
              {n.action && (
                <button
                  type="button"
                  onClick={() => {
                    n.action?.();
                    onClose();
                  }}
                  className="mt-2 text-[11px] text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{n.actionText}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
