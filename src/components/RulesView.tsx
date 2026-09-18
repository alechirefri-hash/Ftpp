import React, { useState } from 'react';
import { Shield, KeyRound, Check, FileText, AlertTriangle, Monitor, Lock } from 'lucide-react';

interface RulesViewProps {
  accessPin: string;
  onUpdatePin: (newPin: string) => void;
}

export const RulesView: React.FC<RulesViewProps> = ({ accessPin, onUpdatePin }) => {
  const [pinInput, setPinInput] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length >= 4) {
      onUpdatePin(pinInput.trim());
      setSuccess(true);
      setPinInput('');
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24 text-xs text-slate-300">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-6 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/50" />
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-['Space_Grotesk']">
          Library Rules & Access Code
        </h2>
      </div>

      {/* Access Code Management Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121522] border border-[#20273c] shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Library Master Access PIN
            </h3>
            <p className="text-xs text-slate-400">
              Protects private offline installation notes and configuration parameters
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0a0d16] border border-[#1b2234] flex items-center justify-between">
          <span className="text-xs text-slate-400">Current Access PIN:</span>
          <span className="font-mono text-sm font-bold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-lg border border-purple-800/50">
            {accessPin}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Set New Access PIN:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={10}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter new PIN (e.g. 5678)"
              className="flex-1 px-3 py-2 bg-[#0a0d16] border border-[#20283c] rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={pinInput.trim().length < 4}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer transition-all whitespace-nowrap shadow-md shadow-purple-600/20"
            >
              Update PIN
            </button>
          </div>
          {success && (
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <Check className="w-3.5 h-3.5" />
              PIN updated successfully!
            </p>
          )}
        </form>
      </div>

      {/* Rules & Guidelines */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121522] border border-[#20273c] shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Profile Usage Regulations
            </h3>
            <p className="text-xs text-slate-400">
              Operational rules for digital game library profiles
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#0a0d16] border border-[#1b2234] space-y-1">
            <div className="flex items-center gap-2 font-bold text-white">
              <Monitor className="w-4 h-4 text-purple-400" />
              1. Single Active Session Rule
            </div>
            <p className="text-slate-400">
              Each profile represents an isolated Steam offline container. Ensure the client remains in offline mode during gameplay to prevent cloud overwrite conflicts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0d16] border border-[#1b2234] space-y-1">
            <div className="flex items-center gap-2 font-bold text-white">
              <Shield className="w-4 h-4 text-emerald-400" />
              2. Key Integrity & Verification
            </div>
            <p className="text-slate-400">
              When a profile transitions to <code>ACTION REQUIRED (Status: Key Needed)</code>, access keys must be validated via the status check modal before launching.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0d16] border border-[#1b2234] space-y-1">
            <div className="flex items-center gap-2 font-bold text-white">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3. Channel Broadcast Notifications
            </div>
            <p className="text-slate-400">
              All sync events and health status changes are transmitted live to <code>#notifications</code>. Keep this channel open to monitor depot downloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
