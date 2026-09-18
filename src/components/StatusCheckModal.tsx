import React, { useState } from 'react';
import { GameProfile } from '../types';
import { X, Key, ShieldCheck, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface StatusCheckModalProps {
  profile: GameProfile | null;
  onClose: () => void;
  onResolveKey: (profileId: string) => void;
}

export const StatusCheckModal: React.FC<StatusCheckModalProps> = ({
  profile,
  onClose,
  onResolveKey,
}) => {
  if (!profile) return null;

  const [inputKey, setInputKey] = useState(profile.keyId || 'KEY-BETA-772');
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setSuccess(true);
      setTimeout(() => {
        onResolveKey(profile.id);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f121d] border border-[#232b3f] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/40 via-[#151928] to-[#0f121d] border-b border-[#20273c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-950/40">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Status Check: {profile.title}
              </h2>
              <p className="text-xs text-rose-300/80 font-mono">
                {profile.statusSubtext}
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-[#141827] border border-[#212a40] space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Authentication Key Verification Needed</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Profile <strong className="text-white">{profile.title}</strong> encountered an entitlement handshake issue. Confirm the offline access key below to restore status to <strong className="text-emerald-400">Operational</strong>.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Access Token / Key ID
              </label>
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="KEY-XXXX-XXXX"
                className="w-full px-3.5 py-2.5 bg-[#0b0e18] border border-[#242e48] rounded-xl text-xs font-mono text-purple-200 outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#090b12] border border-[#1b2234] flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">Destination:</span>
              <span className="text-purple-300">#notifications broadcast</span>
            </div>

            {success ? (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Key Verified! Status updated to Operational.</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Verifying Handshake...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Validate Key & Sync Profile</span>
                  </>
                )}
              </button>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0c16] border-t border-[#1d2336] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171c2c] hover:bg-[#20273d] text-slate-300 text-xs font-semibold rounded-xl border border-[#27324c] cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
