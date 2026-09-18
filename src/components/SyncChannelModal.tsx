import React from 'react';
import { X, Hash, Activity, RefreshCw, CheckCircle2, AlertTriangle, Clock, Radio } from 'lucide-react';
import { GameProfile } from '../types';

interface SyncChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncTag: string;
  profiles: GameProfile[];
  onTriggerSyncAll: () => void;
  isSyncing: boolean;
}

export const SyncChannelModal: React.FC<SyncChannelModalProps> = ({
  isOpen,
  onClose,
  syncTag,
  profiles,
  onTriggerSyncAll,
  isSyncing,
}) => {
  if (!isOpen) return null;

  const operationalCount = profiles.filter((p) => p.badge === 'SYNCED').length;
  const actionRequiredCount = profiles.filter((p) => p.badge === 'ACTION REQUIRED').length;
  const waitingCount = profiles.filter((p) => p.badge === 'WAITING...').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0f121d] border border-[#232b3f] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#141828] border-b border-[#20273c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/25 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-950/50">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Connected Channel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-1 font-['Space_Grotesk']">
                Sync Status &gt; <span className="text-purple-400">#notifications</span>
              </h2>
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
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs text-slate-300">
          
          {/* Active Status Tag Box with purple ring glow */}
          <div className="p-4 rounded-2xl bg-[#090b14] border border-purple-500/40 ring-1 ring-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Active Relay Tag
              </span>
              <div className="text-lg font-black font-mono text-purple-300 tracking-wider">
                {syncTag}
              </div>
            </div>

            <button
              type="button"
              onClick={onTriggerSyncAll}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Sync All Profiles'}</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-[#131726] border border-[#1f273d]">
              <span className="text-emerald-400 font-bold text-sm">{operationalCount}</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">Operational</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#131726] border border-[#1f273d]">
              <span className="text-rose-400 font-bold text-sm">{actionRequiredCount}</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">Key Needed</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#131726] border border-[#1f273d]">
              <span className="text-amber-400 font-bold text-sm">{waitingCount}</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">Processing</p>
            </div>
          </div>

          {/* Live Stream Feed */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              Recent Broadcast Logs (#notifications)
            </h3>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="p-2 rounded-xl bg-[#090b12] border border-[#1a2133] flex items-center justify-between text-emerald-300">
                <span className="truncate">[SYNC] Profile_Alpha handshook with depot (42 games)</span>
                <span className="text-slate-500 text-[10px]">Just now</span>
              </div>
              <div className="p-2 rounded-xl bg-[#090b12] border border-[#1a2133] flex items-center justify-between text-rose-300">
                <span className="truncate">[ALERT] Profile_Beta key expired &gt; manual check required</span>
                <span className="text-slate-500 text-[10px]">14m ago</span>
              </div>
              <div className="p-2 rounded-xl bg-[#090b12] border border-[#1a2133] flex items-center justify-between text-amber-300">
                <span className="truncate">[QUEUE] Profile_Gamma fetching manifest package</span>
                <span className="text-slate-500 text-[10px]">Active</span>
              </div>
              <div className="p-2 rounded-xl bg-[#090b12] border border-[#1a2133] flex items-center justify-between text-slate-300">
                <span className="truncate">[STATUS] Tag {syncTag} assigned to local bridge</span>
                <span className="text-slate-500 text-[10px]">1h ago</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0c16] border-t border-[#1d2336] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171c2c] hover:bg-[#20273d] text-slate-300 text-xs font-semibold rounded-xl border border-[#27324c] cursor-pointer"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
