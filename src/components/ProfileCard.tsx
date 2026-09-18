import React from 'react';
import { GameProfile } from '../types';
import { Heart, CheckCircle2, AlertCircle, Loader2, ArrowRight, Shield, Key } from 'lucide-react';

interface ProfileCardProps {
  profile: GameProfile;
  onSelectProfile: (profile: GameProfile) => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onActionClick: (e: React.MouseEvent, profile: GameProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSelectProfile,
  onToggleFavorite,
  onActionClick,
}) => {
  // Badge styling matching requested:
  // Green 'SYNCED', Red 'ACTION REQUIRED', Yellow 'WAITING...'
  const getBadgeStyle = () => {
    switch (profile.badge) {
      case 'SYNCED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35 shadow-emerald-950/40';
      case 'ACTION REQUIRED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/35 shadow-rose-950/40';
      case 'WAITING...':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/35 shadow-amber-950/40';
      default:
        return 'bg-purple-500/15 text-purple-400 border-purple-500/35';
    }
  };

  const getBadgeIcon = () => {
    switch (profile.badge) {
      case 'SYNCED':
        return <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />;
      case 'ACTION REQUIRED':
        return <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />;
      case 'WAITING...':
        return <Loader2 className="w-3 h-3 text-amber-400 animate-spin shrink-0" />;
      default:
        return null;
    }
  };

  const getSubtextStyle = () => {
    switch (profile.statusSubtext) {
      case 'Status: Operational':
        return 'text-emerald-400/90';
      case 'Status: Key Needed':
        return 'text-rose-400/90';
      case 'Status: Processing':
        return 'text-amber-400/90';
      default:
        return 'text-slate-400';
    }
  };

  const getActionButtonStyle = () => {
    switch (profile.actionLabel) {
      case 'VIEW PROFILE':
        return 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/50 shadow-md border-purple-400/30';
      case 'CHECK STATUS':
        return 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-rose-950/50 shadow-md border-rose-400/30';
      case 'FETCHING':
        return 'bg-[#1a2033] hover:bg-[#222b44] text-amber-300 border-amber-500/30 shadow-sm';
      default:
        return 'bg-purple-600 hover:bg-purple-500 text-white';
    }
  };

  return (
    <div
      id={`card-${profile.id}`}
      onClick={() => onSelectProfile(profile)}
      className="group relative flex flex-col bg-[#121520] hover:bg-[#161a28] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1f2638] hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 cursor-pointer transform hover:-translate-y-1 select-none"
    >
      {/* Top Banner / Image area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={profile.coverImage}
          alt={profile.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-[0.85] group-hover:brightness-95"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://shared.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg';
          }}
        />

        {/* Ambient Dark Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121520] via-transparent to-black/50 pointer-events-none" />

        {/* Top Controls Bar: Top-Left Heart Icon & Top-Right Badge */}
        <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-3 flex items-center justify-between z-10">
          {/* Top-left Heart Icon */}
          <button
            id={`fav-btn-${profile.id}`}
            type="button"
            onClick={(e) => onToggleFavorite(e, profile.id)}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 text-white shadow-md cursor-pointer"
            title={profile.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                profile.favorite
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-white/80 hover:text-rose-400'
              }`}
            />
          </button>

          {/* Top-right status badge (Green SYNCED, Red ACTION REQUIRED, Yellow WAITING...) */}
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border backdrop-blur-md shadow-sm pointer-events-none ${getBadgeStyle()}`}
          >
            {getBadgeIcon()}
            <span>{profile.badge}</span>
          </span>
        </div>

        {/* Platform tag pill floating at bottom of cover */}
        <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-slate-300">
            {profile.platformDisplay}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-purple-950/70 border border-purple-800/40 text-purple-300">
            {profile.gamesCount} GAMES
          </span>
        </div>
      </div>

      {/* Card Info & Actions Footer */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#121520]">
        <div>
          {/* Profile Title (Profile_Alpha, Profile_Beta, Profile_Gamma) */}
          <h3 className="font-bold text-white text-base sm:text-lg tracking-tight group-hover:text-purple-300 transition-colors truncate font-['Space_Grotesk']">
            {profile.title}
          </h3>

          {/* Subtext: Status: Operational / Status: Key Needed / Status: Processing */}
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className={`font-semibold text-xs tracking-wide flex items-center gap-1.5 ${getSubtextStyle()}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                profile.badge === 'SYNCED'
                  ? 'bg-emerald-400 animate-pulse'
                  : profile.badge === 'ACTION REQUIRED'
                  ? 'bg-rose-400'
                  : 'bg-amber-400 animate-pulse'
              }`} />
              {profile.statusSubtext}
            </span>

            {profile.syncTag && (
              <span className="text-[10px] font-mono text-slate-500 bg-[#0a0d16] px-1.5 py-0.5 rounded border border-[#1b2336]">
                {profile.syncTag}
              </span>
            )}
          </div>
        </div>

        {/* Action Button: VIEW PROFILE / CHECK STATUS / FETCHING */}
        <div className="pt-1">
          <button
            id={`btn-action-${profile.id}`}
            type="button"
            onClick={(e) => onActionClick(e, profile)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all duration-200 active:scale-[0.98] cursor-pointer ${getActionButtonStyle()}`}
          >
            {profile.actionLabel === 'FETCHING' && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
            )}
            {profile.actionLabel === 'CHECK STATUS' && (
              <Key className="w-3.5 h-3.5 text-rose-200" />
            )}
            {profile.actionLabel === 'VIEW PROFILE' && (
              <Shield className="w-3.5 h-3.5 text-purple-200" />
            )}
            <span>{profile.actionLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
