import React from 'react';
import { Bell, Shield, Cloud } from 'lucide-react';

interface FTPTopHeaderProps {
  onOpenNotifications: () => void;
  notificationCount?: number;
  profileAvatarUrl?: string;
  profileLevel?: number;
  isAdmin?: boolean;
  isCloudConnected?: boolean;
  onOpenAdminPanel?: () => void;
  onOpenProfile?: () => void;
  onLogoClick?: () => void;
}

export const FTPTopHeader: React.FC<FTPTopHeaderProps> = ({
  onOpenNotifications,
  notificationCount = 9,
  profileAvatarUrl,
  profileLevel = 12,
  isAdmin = false,
  isCloudConnected = true,
  onOpenAdminPanel,
  onOpenProfile,
  onLogoClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#090b14]/95 backdrop-blur-md border-b border-[#171b2b] px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* FTP Logo */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer select-none group"
          title="FTP - Inicio"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1.5px] shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-[#090b14] rounded-[9px] flex items-center justify-center">
              <span className="text-[10px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-['Space_Grotesk']">
                FTP
              </span>
            </div>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white font-['Space_Grotesk'] italic">
            F<span className="text-purple-400">T</span>P
          </span>
        </div>

        {/* Right Actions: Notifications Bell, Admin Panel trigger and Mini Profile Button */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Status Indicator */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#131728] border border-white/10 text-[9px] font-semibold text-slate-300 select-none"
            title={isCloudConnected ? "Datos alojados externamente en Google Cloud Firestore (Sincronizado en tiempo real)" : "Conectando con la base de datos externa..."}
          >
            <Cloud className={`w-3 h-3 ${isCloudConnected ? 'text-cyan-400' : 'text-amber-400 animate-pulse'}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}`} />
            <span className="hidden sm:inline text-[9px] text-slate-300 font-medium">
              {isCloudConnected ? 'Nube' : 'Sync'}
            </span>
          </div>

          {/* Admin Panel Button */}
          {isAdmin && onOpenAdminPanel && (
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 border border-amber-500/50 text-amber-300 font-extrabold text-[10px] tracking-wide shadow-md shadow-amber-500/10 transition-all cursor-pointer active:scale-95"
              title="Abrir Panel de Control Admin"
            >
              <Shield className="w-3 h-3 text-amber-400 fill-amber-400/30" />
              <span>ADMIN</span>
            </button>
          )}

          {/* Notifications Bell with +9 badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Notificaciones y avisos"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-1 px-1 min-w-[17px] h-[17px] bg-purple-600 border border-[#090b14] text-[10px] font-extrabold text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-600/40">
                +{notificationCount}
              </span>
            )}
          </button>

          {/* User Profile Mini Avatar */}
          {profileAvatarUrl && onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="relative group p-0.5 rounded-full ring-1 ring-purple-500/50 hover:ring-purple-400 transition-all cursor-pointer shrink-0"
              title="Mi Perfil Gamer"
            >
              <img
                src={profileAvatarUrl}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover bg-slate-800"
              />
              <span className="absolute -bottom-1 -right-1 px-1 bg-purple-600 border border-[#090b14] rounded-full text-[8px] font-black text-white">
                {profileLevel}
              </span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
