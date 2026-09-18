import React from 'react';
import { BookOpen, CheckCircle2, Key, Shield, HelpCircle, Monitor, Layers } from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24 text-xs text-slate-300">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-6 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/50" />
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-['Space_Grotesk']">
          Digital Game Library Guide
        </h2>
      </div>

      <div className="p-5 rounded-2xl bg-[#121522] border border-[#20273c] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">How Profile Synchronization Works</h3>
            <p className="text-xs text-slate-400">Understanding profile statuses and key validation</p>
          </div>
        </div>

        <div className="space-y-3 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#090b12] border border-[#1b2234] space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              SYNCED (Status: Operational)
            </div>
            <p className="text-slate-400">
              Indicates the profile is completely up-to-date. All title licenses, offline manifests, and local saves have been mirrored and can be launched immediately without internet.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090b12] border border-[#1b2234] space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <Key className="w-4 h-4" />
              ACTION REQUIRED (Status: Key Needed)
            </div>
            <p className="text-slate-400">
              The entitlement token has expired or requires renewal. Click <strong>CHECK STATUS</strong> on the card to validate the profile's access key and restore operational status.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090b12] border border-[#1b2234] space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Layers className="w-4 h-4" />
              WAITING... (Status: Processing)
            </div>
            <p className="text-slate-400">
              The dashboard is currently pulling game metadata, cloud backups, or DLC manifests from the central depot. The action button displays <strong>FETCHING</strong> during this state.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#121522] border border-[#20273c] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Monitor className="w-4 h-4 text-purple-400" />
          Steam Offline Mode Best Practices
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-slate-400">
          <li>Always switch Steam into Offline Mode after synchronization completes.</li>
          <li>Do not force close Steam during save writes to preserve cloud state.</li>
          <li>Use the Floating Sync FAB (`SYNC-3A57`) to broadcast manual sync triggers.</li>
        </ul>
      </div>
    </div>
  );
};
