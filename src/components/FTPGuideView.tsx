import React from 'react';
import {
  BookOpen,
  Search,
  KeyRound,
  Copy,
  Zap,
  CloudOff,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const FTPGuideView: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Busca tu Juego en la Biblioteca FTP',
      desc: 'Explora el catálogo o usa la barra de búsqueda para encontrar el título que deseas jugar (ej. What Remains of Edith Finch, SnowRunner, Black Myth: Wukong).',
      icon: Search,
    },
    {
      step: 2,
      title: 'Desbloquea la Cuenta con el Código de Admin',
      desc: 'Si el juego está bloqueado por código, ingresa el código de 6 caracteres (como H70409) compartido en el Servidor de Discord (#codigos-vip) y presiona DESBLOQUEAR.',
      icon: KeyRound,
    },
    {
      step: 3,
      title: 'Copia las Credenciales en el Cliente de Steam',
      desc: 'Abre tu cliente de escritorio de Steam en PC. Copia el USUARIO y la CONTRASEÑA suministrados por FTP y pégalos en la pantalla de login. Marca "Recordar mi contraseña".',
      icon: Copy,
    },
    {
      step: 4,
      title: 'Acceso Directo Instantáneo a la Biblioteca',
      desc: 'Nuestras cuentas cuentan con acceso directo sin verificaciones ni confirmaciones secundarias. Iniciarás sesión de inmediato sin pausas.',
      icon: CheckCircle2,
    },
    {
      step: 5,
      title: 'Descarga el Juego y Cambia a Modo Desconectado',
      desc: 'Una vez completada la descarga, haz clic en "Steam" en la esquina superior izquierda del cliente y elige "Cambiar a modo Desconectado...". ¡Listo, puedes jugar sin interrupciones!',
      icon: CloudOff,
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#12182b] to-[#0e1220] border border-blue-500/30 p-4 shadow-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight font-['Space_Grotesk']">
              Guía de Configuración Paso a Paso
            </h2>
            <span className="text-[11px] text-blue-400 font-medium">
              Cómo jugar juegos AAA completamente en modo desconectado en Steam
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mt-1">
          Sigue este tutorial de 5 pasos para iniciar sesión y configurar tu biblioteca offline de Steam con total seguridad.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="p-4 rounded-2xl bg-[#0e1220] border border-[#1b233a] space-y-1.5 shadow-md relative overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span>{s.title}</span>
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
