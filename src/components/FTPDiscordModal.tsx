import React, { useState } from 'react';
import { X, Send, MessageSquare, Hash, ExternalLink, Bot, CheckCircle2 } from 'lucide-react';

interface FTPDiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTestCode: (code: string) => void;
}

export const FTPDiscordModal: React.FC<FTPDiscordModalProps> = ({
  isOpen,
  onClose,
  onUseTestCode,
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      author: 'FTP Support Bot',
      badge: 'BOT',
      text: '¡Hola! Bienvenido al canal de asistencia y servidor de Discord de FTP. ¿Necesitas el código de desbloqueo de 6 caracteres para títulos como What Remains of Edith Finch o SnowRunner? Únete a nuestro servidor oficial: https://discord.gg/xzyz2UQyjY',
    },
    {
      id: 2,
      sender: 'bot',
      author: 'FTP Support Bot',
      badge: 'BOT',
      text: 'El código VIP activo actual en el canal #codigos-vip de Discord es: H70409. También puedes consultar soporte sobre el modo desconectado de Steam o reportar incidencias en https://discord.gg/xzyz2UQyjY.',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', author: 'Tú', badge: '', text: userText },
    ]);
    setInputQuery('');

    setTimeout(() => {
      let reply =
        'Si estás desbloqueando un juego, ingresa el código H70409 anunciado en nuestro Discord. Recuerda cambiar Steam a modo Desconectado inmediatamente tras iniciar sesión.';
      if (
        userText.toLowerCase().includes('codigo') ||
        userText.toLowerCase().includes('código') ||
        userText.toLowerCase().includes('code')
      ) {
        reply =
          'El código universal fijado en el canal #codigos-vip de Discord es: H70409. ¡Cópialo y pégalo en la vista de detalle del juego!';
      } else if (
        userText.toLowerCase().includes('cloud') ||
        userText.toLowerCase().includes('guardar') ||
        userText.toLowerCase().includes('partida')
      ) {
        reply =
          'Haz clic derecho en el juego en Steam > Propiedades > General, y desmarca "Mantener las partidas guardadas en Steam Cloud".';
      } else if (userText.toLowerCase().includes('discord') || userText.toLowerCase().includes('link') || userText.toLowerCase().includes('invitacion') || userText.toLowerCase().includes('servidor')) {
        reply = 'El enlace de invitación oficial al servidor de Discord es: https://discord.gg/xzyz2UQyjY (Canales #anuncios-steam y #codigos-vip).';
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', author: 'FTP Support Bot', badge: 'BOT', text: reply },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0e1220] border border-[#5865F2]/50 p-5 shadow-2xl flex flex-col h-[540px] max-h-[85vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1b2238]">
          <div className="w-9 h-9 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
            <MessageSquare className="w-5 h-5 fill-[#5865F2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Bot de Soporte Discord FTP
              </h3>
              <span className="px-1.5 py-0.2 bg-[#5865F2] text-white text-[9px] font-black rounded-sm">
                DISCORD
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Canal #asistencia-ftp en línea
            </span>
          </div>
        </div>

        {/* Discord Server Direct Channel Action */}
        <div className="py-2.5 space-y-2">
          {/* Main Join Discord Server Link */}
          <a
            href="https://discord.gg/xzyz2UQyjY"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs transition-all shadow-md shadow-[#5865F2]/30 group"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Unirse a discord.gg/xzyz2UQyjY</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <div className="p-2 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/25 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-indigo-200">
              <Hash className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>Código VIP: <strong>H70409</strong></span>
            </div>
            <button
              type="button"
              onClick={() => {
                onUseTestCode('H70409');
                onClose();
              }}
              className="px-2 py-0.5 bg-[#5865F2]/30 hover:bg-[#5865F2] text-indigo-200 hover:text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors"
            >
              Usar Código
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-2 pr-1 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-2.5 rounded-2xl max-w-[88%] leading-relaxed ${
                m.sender === 'user'
                  ? 'ml-auto bg-[#5865F2] text-white font-medium rounded-br-none shadow'
                  : 'bg-[#14192b] border border-[#212842] text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-semibold">
                {m.sender === 'bot' && <Bot className="w-3 h-3 text-[#5865F2]" />}
                <span className={m.sender === 'bot' ? 'text-indigo-300' : 'text-slate-200'}>
                  {m.author}
                </span>
                {m.badge && (
                  <span className="px-1 py-0.2 bg-[#5865F2] text-white text-[8px] font-black rounded">
                    {m.badge}
                  </span>
                )}
              </div>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="pt-2 flex items-center gap-2 border-t border-[#1b2238]">
          <div className="relative flex-1 flex items-center">
            <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Escribe en #asistencia-discord..."
              className="w-full pl-7 pr-3 py-2 bg-[#141829] border border-[#232c48] focus:border-[#5865F2] text-slate-100 placeholder-slate-500 text-xs rounded-xl outline-none"
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-xl transition-colors cursor-pointer shadow-md shadow-[#5865F2]/20"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
