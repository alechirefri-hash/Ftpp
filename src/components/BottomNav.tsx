import React from 'react';
import { Home, Play, DollarSign, Gift, FileText, MessageCircle } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAssistant: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAssistant,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'games' as NavTab, label: 'Games', icon: Play },
    { id: 'rental' as NavTab, label: 'Rental', icon: DollarSign },
    { id: 'free' as NavTab, label: 'Free', icon: Gift },
    { id: 'rules' as NavTab, label: 'Rules', icon: FileText },
  ];

  return (
    <>
      {/* Floating Chat / Assistant Action Button (Bottom Right, purple circle from screenshot) */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          id="assistant-floating-btn"
          type="button"
          onClick={onOpenAssistant}
          className="w-13 h-13 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer border border-purple-400/30"
          title="Asistente de Guías y Recomendaciones"
        >
          <MessageCircle className="w-6 h-6 fill-white/20 text-white" />
        </button>
      </div>

      {/* Docked Bottom Navigation Bar (matches the screenshot) */}
      <nav
        id="app-bottom-nav"
        className="fixed bottom-0 inset-x-0 z-30 bg-[#0c0e17]/95 border-t border-[#1b2030] backdrop-blur-xl px-2 py-2 safe-area-bottom shadow-2xl"
      >
        <div className="max-w-md mx-auto flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`bottom-nav-${tab.id}`}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer group"
              >
                {/* Active pill background for 'games' or current active tab */}
                <div
                  className={`w-11 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-purple-600/25 text-purple-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'fill-purple-500/30 stroke-purple-400 stroke-[2.2]' : 'stroke-[1.8]'
                    }`}
                  />
                </div>
                <span
                  className={`text-[11px] font-semibold mt-0.5 tracking-tight ${
                    isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'
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
