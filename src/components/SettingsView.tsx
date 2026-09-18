import React, { useState } from 'react';
import { Settings, Bell, Hash, Shield, Database, Cpu, Check, Radio } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [channelName, setChannelName] = useState('notifications');
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('15m');
  const [notifyOnAction, setNotifyOnAction] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-6 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/50" />
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-['Space_Grotesk']">
          Dashboard Settings
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Channel Configuration */}
        <div className="p-5 rounded-2xl bg-[#121522] border border-[#20273c] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Broadcast Channel Config</h3>
              <p className="text-xs text-slate-400">
                Configure the destination channel for status sync alerts
              </p>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Active Channel Name
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-[#090b12] border border-[#1d2538] rounded-xl text-slate-500 font-mono text-xs">
                #
              </span>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#090b12] border border-[#1d2538] rounded-xl text-xs font-mono text-white outline-none focus:border-purple-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Currently broadcasting to: <span className="text-purple-300 font-mono">CONNECTED CHANNEL: Sync Status &gt; #{channelName}</span>
            </p>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="p-5 rounded-2xl bg-[#121522] border border-[#20273c] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Automated Sync Interval</h3>
              <p className="text-xs text-slate-400">
                Manage background polling for operational profiles
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#090b12] border border-[#1b2234]">
              <div>
                <span className="text-xs font-bold text-white block">Background Sync</span>
                <span className="text-[11px] text-slate-400">Automatically poll Steam offline entitlements</span>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#090b12] border border-[#1b2234]">
              <div>
                <span className="text-xs font-bold text-white block">Notify on 'ACTION REQUIRED'</span>
                <span className="text-[11px] text-slate-400">Send instant alert when key needs refresh</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnAction}
                onChange={(e) => setNotifyOnAction(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
