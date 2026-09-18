import React from 'react';
import { Home, Library, Key, Settings, FileText, BookOpen, RefreshCw } from 'lucide-react';
import { NavTab } from '../types';

interface DashboardBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  floatingStatusTag?: string; // 'SYNC-3A57'
  onFloatingActionClick: () => void;
  isSyncing?: boolean;
}

export const DashboardBottomNav: React.FC<DashboardBottomNavProps> = ({
  activeTab,
  onTabChange,
  floatingStatusTag = 'SYNC-3A57',
  onFloatingActionClick,
  isSyncing = false,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'library' as NavTab, label: 'Library', icon: Library },
    { id: 'keys' as NavTab, label: 'Keys', icon: Key },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
    { id: 'rules' as NavTab, label: 'Rules', icon: FileText },
    { id: 'guide' as NavTab, label: 'Guide', icon: BookOpen },
  ];

  return (
    <>
      {/* Floating action button in the bottom right corner with a purple glowing ring displaying sample status tag 'SYNC-3A57' */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          id="floating-sync-fab"
          type="button"
          onClick={onFloatingActionClick}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#151226] hover:bg-[#1c1833] text-white border border-purple-500/60 ring-2 ring-purple-500 ring-offset-2 ring-offset-[#090b14] shadow-[0_0_25px_rgba(168,85,247,0.55)] transition-all duration-300 active:scale-95 cursor-pointer"
          title={`Sync Hub: ${floatingStatusTag}`}
        >
          {/* Glowing pulse indicator dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
          </span>

          {/* Refresh icon */}
          <RefreshCw
            className={`w-4 h-4 text-purple-300 transition-transform ${
              isSyncing ? 'animate-spin' : 'group-hover:rotate-180 duration-500'
            }`}
          />

          {/* Sample status tag label: SYNC-3A57 */}
          <span className="font-mono text-xs font-black tracking-wider text-purple-200">
            {floatingStatusTag}
          </span>
        </button>
      </div>

      {/* Docked Bottom Navigation Bar */}
      <nav
        id="dashboard-bottom-nav"
        className="fixed bottom-0 inset-x-0 z-30 bg-[#0c0e17]/95 border-t border-[#1b2030] backdrop-blur-xl px-2 py-1.5 safe-area-bottom shadow-2xl"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            // Library is highlighted in purple (per user instruction) when active or by default style
            const isActive = activeTab === tab.id;
            const isLibraryTab = tab.id === 'library';

            return (
              <button
                key={tab.id}
                id={`bottom-nav-${tab.id}`}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer group"
              >
                {/* Active pill background - Library highlighted in purple */}
                <div
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-purple-600/30 text-purple-300 ring-1 ring-purple-500/50 shadow-sm shadow-purple-500/20'
                      : isLibraryTab
                      ? 'text-purple-400/80 hover:bg-purple-950/40'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${
                      isActive || isLibraryTab
                        ? 'stroke-purple-400 stroke-[2.2]'
                        : 'stroke-[1.8]'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold mt-0.5 tracking-tight ${
                    isActive || (isLibraryTab && isActive)
                      ? 'text-purple-300 font-bold'
                      : isLibraryTab
                      ? 'text-purple-400/90'
                      : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
