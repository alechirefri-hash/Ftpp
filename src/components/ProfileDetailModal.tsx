import React from 'react';
import { GameProfile } from '../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Heart,
  Gamepad2,
  Key,
  Shield,
  Activity,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProfileDetailModalProps {
  profile: GameProfile | null;
  onClose: () => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onUpdateStatus: (id: string, newBadge: GameProfile['badge'], newSubtext: GameProfile['statusSubtext'], newAction: GameProfile['actionLabel']) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  onClose,
  onToggleFavorite,
  onUpdateStatus,
}) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0f121d] border border-[#232a3f] rounded-3xl overflow-hidden shadow-2xl my-6">
        
        {/* Close Button */}
        <button
          id="btn-close-profile-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Cover Header */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
          <img
            src={profile.coverImage}
            alt={profile.title}
            className="w-full h-full object-cover object-center filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f121d] via-[#0f121d]/60 to-transparent" />

          {/* Quick Header Information */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 text-xs font-black rounded-lg border uppercase tracking-wider ${
                    profile.badge === 'SYNCED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : profile.badge === 'ACTION REQUIRED'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {profile.badge}
                </span>

                <span className="text-xs font-mono text-slate-400 bg-black/50 px-2 py-0.5 rounded border border-white/10">
                  {profile.syncTag}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
                {profile.title}
              </h2>
              <p className="text-xs text-purple-300 font-medium">
                {profile.statusSubtext} • {profile.platformDisplay}
              </p>
            </div>

            {/* Favorite button */}
            <button
              type="button"
              onClick={(e) => onToggleFavorite(e, profile.id)}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                profile.favorite
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-[#181d2d] text-slate-300 border-[#262f48] hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${profile.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[calc(85vh-14rem)] overflow-y-auto">
          
          {/* Description */}
          <div className="p-3.5 rounded-2xl bg-[#090b12] border border-[#1b2234] text-xs text-slate-300 leading-relaxed">
            {profile.description}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[#121522] border border-[#1f2638] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Games Linked
              </span>
              <span className="text-lg font-black text-white font-mono">
                {profile.gamesCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#121522] border border-[#1f2638] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Health Score
              </span>
              <span className="text-lg font-black text-purple-300 font-mono">
                {profile.healthScore}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#121522] border border-[#1f2638] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Last Synced
              </span>
              <span className="text-xs font-bold text-slate-200 mt-1 block truncate">
                {profile.lastSynced}
              </span>
            </div>
          </div>

          {/* Key & Channel Diagnostics */}
          <div className="p-4 rounded-2xl bg-[#121522] border border-[#1f2638] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                Access Key ID
              </span>
              <span className="font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                {profile.keyId || 'KEY-STANDARD-OFFLINE'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#1b2234]">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Broadcast Channel
              </span>
              <span className="font-mono text-slate-200">
                Sync Status &gt; #notifications
              </span>
            </div>
          </div>

          {/* Active / Synced Games in Profile */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              Verified Titles in Profile Library
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {profile.activeGames.map((gameTitle) => (
                <div
                  key={gameTitle}
                  className="p-2.5 rounded-xl bg-[#0b0e18] border border-[#1d2538] flex items-center justify-between text-xs text-slate-200"
                >
                  <span className="font-medium truncate">{gameTitle}</span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    READY
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions depending on status */}
          <div className="pt-2 flex flex-wrap gap-2">
            {profile.badge !== 'SYNCED' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(
                    profile.id,
                    'SYNCED',
                    'Status: Operational',
                    'VIEW PROFILE'
                  );
                }}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Operational (Sync Now)</span>
              </button>
            )}

            {profile.badge === 'SYNCED' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(
                    profile.id,
                    'WAITING...',
                    'Status: Processing',
                    'FETCHING'
                  );
                }}
                className="flex-1 py-2.5 px-4 bg-[#1a2033] hover:bg-[#222b44] text-purple-300 border border-purple-500/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Loader2 className="w-4 h-4" />
                <span>Re-verify Entitlements</span>
              </button>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0a0d16] border-t border-[#1b2234] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-600/25"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
