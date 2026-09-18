import React, { useState } from 'react';
import { X, MessageCircle, KeyRound, Shield, Check, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { Game } from '../types';

interface GameAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  accessPin: string;
  onUpdatePin: (newPin: string) => void;
}

export const GameAssistantModal: React.FC<GameAssistantModalProps> = ({
  isOpen,
  onClose,
  games,
  accessPin,
  onUpdatePin,
}) => {
  if (!isOpen) return null;

  const [activeTopic, setActiveTopic] = useState<'tips' | 'pin' | 'offline'>('tips');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSavedSuccess, setPinSavedSuccess] = useState(false);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length >= 4) {
      onUpdatePin(newPinInput.trim());
      setPinSavedSuccess(true);
      setTimeout(() => setPinSavedSuccess(false), 3000);
      setNewPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0f121d] border border-[#232b3f] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header with purple avatar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900/40 via-[#151928] to-[#0f121d] border-b border-[#20273c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <MessageCircle className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Asistente de Catálogo & Guías
              </h2>
              <p className="text-xs text-purple-300/80">
                Soporte de biblioteca, códigos de acceso y guías
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181d2e] hover:bg-[#22293e] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#1b2133] bg-[#0c0e17] px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTopic('tips')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTopic === 'tips'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Consejos de Juegos
          </button>
          <button
            type="button"
            onClick={() => setActiveTopic('offline')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTopic === 'offline'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Modo Offline
          </button>
          <button
            type="button"
            onClick={() => setActiveTopic('pin')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTopic === 'pin'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Código PIN
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-sm text-slate-300">
          {activeTopic === 'tips' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#141827] border border-[#212a40] space-y-1.5">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  SnowRunner • Consejo Esencial
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Antes de cargar materiales pesados, compra neumáticos off-road o para barro tan pronto alcances nivel 6. Evita las rutas principales si están inundadas; conducir por los bordes con hierba ofrece mayor agarre.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141827] border border-[#212a40] space-y-1.5">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Hell is Us • Exploración
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hell is Us no cuenta con mini-mapa ni marcadores de misión. Oriéntate mediante los sonidos del entorno, monumentos visuales y el dron compañero para escanear ruinas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141827] border border-[#212a40] space-y-1.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Elden Ring • Fragmentos Umbríos
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Si un jefe te derrota de 1 o 2 golpes, no subas niveles normales: busca cruces de Miquela y fragmentos del Árbol Umbrío para multiplicar tu absorción de daño.
                </p>
              </div>
            </div>
          )}

          {activeTopic === 'offline' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#141827] border border-[#212a40] space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  ¿Cómo funciona la etiqueta "Steam Offline"?
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  En los videojuegos para un jugador (single-player), activar el <strong>Modo Desconectado (Offline)</strong> de Steam te permite jugar sin consumir ancho de banda, sin interrupciones por descargas automáticas y sin necesidad de conexión a internet continua.
                </p>
                <div className="pt-2 border-t border-[#20273c] text-xs text-slate-400 space-y-1">
                  <p>1. Inicia Steam normalmente en tu equipo.</p>
                  <p>2. Abre el menú superior: <em>Steam &gt; Pasar a modo desconectado...</em></p>
                  <p>3. Reinicia Steam en modo desconectado y disfruta tus partidas de campaña.</p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'pin' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#141827] border border-[#212a40] space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Código de Acceso Personal (PIN)
                </div>
                <p className="text-xs text-slate-300">
                  Este código sirve para proteger y desbloquear las <strong>Guías de Juego, trucos y notas privadas</strong> de cada título en tu biblioteca.
                </p>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e18] border border-[#1d2538] text-xs">
                  <span className="text-slate-400">Código actual configurado:</span>
                  <span className="font-mono font-bold text-white bg-purple-600/30 px-2 py-0.5 rounded border border-purple-500/40">
                    {accessPin}
                  </span>
                </div>

                <form onSubmit={handleSavePin} className="space-y-2 pt-2 border-t border-[#1d2538]">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Cambiar código de acceso (mínimo 4 caracteres):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={12}
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="Nuevo PIN (Ej: 9988)"
                      className="flex-1 px-3 py-2 bg-[#0b0e18] border border-[#242e48] rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={newPinInput.trim().length < 4}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      Actualizar
                    </button>
                  </div>
                  {pinSavedSuccess && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      ¡Código de acceso actualizado con éxito!
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0c16] border-t border-[#1d2336] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171c2c] hover:bg-[#20273d] text-slate-300 text-xs font-semibold rounded-xl border border-[#27324c] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
