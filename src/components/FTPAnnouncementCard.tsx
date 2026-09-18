import React from 'react';
import { MessageSquare, ShieldCheck, Monitor, Edit3, Sparkles } from 'lucide-react';

interface FTPAnnouncementCardProps {
  onOpenSecurityGuide: () => void;
  customText?: string;
  isAdmin?: boolean;
  onEditAnnouncement?: () => void;
}

export const FTPAnnouncementCard: React.FC<FTPAnnouncementCardProps> = ({
  onOpenSecurityGuide,
  customText,
  isAdmin = false,
  onEditAnnouncement,
}) => {
  return (
    <div className="relative rounded-2xl bg-[#0b1329] border border-[#1d355e] p-3.5 sm:p-4 text-slate-200 shadow-xl mb-4 overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header with speech icon and Admin edit button */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold leading-none">
              COMUNICADO
            </span>
            <span className="block text-xs font-bold text-white tracking-wide leading-tight">
              AVISO DEL SITIO
            </span>
          </div>
        </div>

        {isAdmin && onEditAnnouncement && (
          <button
            type="button"
            onClick={onEditAnnouncement}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/40 text-blue-300 text-[11px] font-bold transition-colors cursor-pointer"
            title="Editar comunicado global (Admin)"
          >
            <Edit3 className="w-3 h-3 text-blue-400" />
            <span>Editar Aviso</span>
          </button>
        )}
      </div>

      {/* Text body */}
      {customText ? (
        <p className="text-[12px] sm:text-[13px] text-slate-300 leading-snug mb-3 whitespace-pre-line">
          {customText}
        </p>
      ) : (
        <p className="text-[12px] sm:text-[13px] text-slate-300 leading-snug mb-3">
          Nuestras cuentas <strong className="text-emerald-400">sí son compatibles</strong> con el cliente oficial de Steam para{' '}
          <span className="inline-flex items-center gap-1 font-semibold text-white bg-blue-900/40 px-1 py-0.2 rounded border border-blue-700/40">
            <Monitor className="w-3 h-3 text-blue-400 inline" /> PC
          </span>{' '}
          y con{' '}
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-300 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-600/40">
            <Sparkles className="w-3 h-3 text-emerald-400 inline" /> GeForce NOW
          </span>
          .{' '}
          <strong className="text-amber-300">Regla clave:</strong> Solo recuerda que{' '}
          <strong className="text-white underline decoration-amber-400 decoration-2">NO debes vincular la cuenta</strong>{' '}
          a servicios externos ni a tus perfiles personales (inicia sesión directamente en la sesión de juego).
        </p>
      )}

      {/* Security action button */}
      <div>
        <button
          type="button"
          onClick={onOpenSecurityGuide}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#173059] hover:bg-[#1e3e73] text-blue-200 border border-blue-500/40 rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
          <span>Seguridad de cuentas Steam</span>
        </button>
      </div>
    </div>
  );
};
