import React from 'react';
import {
  ShieldAlert,
  Monitor,
  CloudOff,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

export const FTPRulesView: React.FC = () => {
  const rules = [
    {
      num: '01',
      title: 'Steam para PC y GeForce NOW',
      desc: 'Nuestras cuentas sí son compatibles con el cliente oficial de Steam para PC y con GeForce NOW. Regla indispensable: solo no tienes que vincular la cuenta a perfiles externos ni cuentas de terceros (inicia sesión directamente en la sesión de juego para jugar sin vincular).',
      icon: Monitor,
      status: 'Obligatorio',
    },
    {
      num: '02',
      title: 'Activa Siempre el Modo Desconectado',
      desc: 'Inmediatamente después de iniciar sesión en la cuenta compartida y descargar tu juego, DEBES cambiar Steam a modo Desconectado: haz clic en Steam en el menú superior izquierdo > Cambiar a modo Desconectado... Esto evita desconexiones y conflictos de licencia con otros jugadores de la comunidad.',
      icon: CloudOff,
      status: 'Crucial',
    },
    {
      num: '03',
      title: 'Nunca Modifiques los Datos de la Cuenta',
      desc: 'No intentes cambiar la contraseña, correo, teléfono o datos de la cuenta. Las cuentas están monitoreadas 24/7; los intentos de modificación no autorizados bloquearán permanentemente el ID de tu hardware.',
      icon: Lock,
      status: 'Protegido',
    },
    {
      num: '04',
      title: 'Desactiva Steam Cloud',
      desc: 'Para proteger tus partidas guardadas personales y evitar que sean sobrescritas por otros jugadores offline, desactiva la sincronización de Steam Cloud en las propiedades del juego (Clic derecho en el juego > Propiedades > General > Desmarcar Steam Cloud).',
      icon: AlertTriangle,
      status: 'Recomendado',
    },
    {
      num: '05',
      title: 'Acceso Directo Sin Verificaciones Adicionales',
      desc: 'Nuestras cuentas están preparadas para acceso directo. Solo ingresa el usuario y contraseña proporcionados para entrar inmediatamente y jugar sin esperas.',
      icon: KeyRound,
      status: 'Directo',
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#141829] to-[#0e1220] border border-purple-500/30 p-4 shadow-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight font-['Space_Grotesk']">
              Reglas de la Comunidad FTP
            </h2>
            <span className="text-[11px] text-purple-400 font-medium">
              Términos de Acceso a Cuentas Offline y Uso Justo
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mt-1">
          Para mantener un servicio 100% operativo y disponible para todos, todos los usuarios deben seguir estas 5 reglas fundamentales.
        </p>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {rules.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.num}
              className="p-4 rounded-2xl bg-[#0e1220] border border-[#1b233a] space-y-2 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-purple-400 text-xs font-bold px-1.5 py-0.5 bg-purple-500/10 rounded border border-purple-500/20">
                    {r.num}
                  </span>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span>{r.title}</span>
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{r.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Official Discord Server Link */}
      <div className="p-4 rounded-2xl bg-[#0f1324] border border-[#5865F2]/40 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
              <MessageSquare className="w-4 h-4 fill-[#5865F2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">¿Necesitas Ayuda o Tienes Dudas?</h4>
              <span className="text-[10px] text-slate-400">Canal de asistencia y comunidad en Discord</span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 bg-[#5865F2] text-white text-[9px] font-black rounded">
            DISCORD
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          Para reportar incidencias con cuentas, solicitar códigos o enterarte de nuevos lanzamientos, únete a nuestro servidor oficial.
        </p>

        <a
          href="https://discord.gg/xzyz2UQyjY"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs transition-all shadow-md shadow-[#5865F2]/30 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-white" />
          <span>Unirse al Servidor (discord.gg/xzyz2UQyjY)</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>
    </div>
  );
};
