import React, { useState } from 'react';
import { Key, ShieldCheck, AlertCircle, RefreshCw, Check, Copy } from 'lucide-react';
import { GameProfile } from '../types';

interface KeysViewProps {
  profiles: GameProfile[];
  onResolveKey: (profileId: string) => void;
}

export const KeysView: React.FC<KeysViewProps> = ({ profiles, onResolveKey }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-6 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/50" />
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-['Space_Grotesk']">
          Key Management & Offline Access
        </h2>
      </div>

      <div className="p-4 rounded-2xl bg-[#0f121e] border border-[#1e263c] flex items-center justify-between text-xs text-slate-300">
        <div>
          <h3 className="font-bold text-white text-sm">Security Tokens Registry</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Profiles use local authentication keys to validate game titles in offline mode.
          </p>
        </div>
        <div className="px-3 py-1 bg-purple-950/70 border border-purple-800/40 rounded-xl text-purple-300 font-mono font-bold text-xs">
          24 KEYS ACTIVE
        </div>
      </div>

      {/* Profiles Keys List */}
      <div className="space-y-2.5">
        {profiles.map((profile) => {
          const isKeyNeeded = profile.badge === 'ACTION REQUIRED';
          return (
            <div
              key={profile.id}
              className="p-3.5 rounded-2xl bg-[#121522] border border-[#1f2638] hover:border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                    isKeyNeeded
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{profile.title}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded-md ${
                        isKeyNeeded
                          ? 'bg-rose-950/70 text-rose-400 border border-rose-800/40'
                          : 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                      }`}
                    >
                      {isKeyNeeded ? 'KEY NEEDED' : 'VERIFIED'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">
                    Token: {profile.keyId || 'KEY-STANDARD-OFFLINE'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleCopy(profile.keyId || 'KEY-DEFAULT', profile.id)}
                  className="px-3 py-1.5 bg-[#0b0e18] hover:bg-[#151a2a] text-slate-300 text-xs rounded-xl border border-[#20283c] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === profile.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>

                {isKeyNeeded && (
                  <button
                    type="button"
                    onClick={() => onResolveKey(profile.id)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Authorize</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
