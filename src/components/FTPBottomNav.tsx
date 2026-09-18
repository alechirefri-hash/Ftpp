import React from 'react';
import {
  Home,
  Play,
  CircleDollarSign,
  Gift,
  FileText,
  BookOpen,
  ArrowUp,
  MessageCircle,
  User,
} from 'lucide-react';
import { NavTab } from '../types';

interface FTPBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onScrollToTop: () => void;
  onOpenAssistant: () => void;
  showScrollTop?: boolean;
}

export const FTPBottomNav: React.FC<FTPBottomNavProps> = ({
  activeTab,
  onTabChange,
  onScrollToTop,
  onOpenAssistant,
  showScrollTop = true,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Inicio', icon: Home },
    { id: 'games' as NavTab, label: 'Juegos', icon: Play },
    { id: 'rental' as NavTab, label: 'Alquiler', icon: CircleDollarSign },
    { id: 'free' as NavTab, label: 'Gratis', icon: Gift },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
    { id: 'rules' as NavTab, label: 'Reglas', icon: FileText },
    { id: 'guide' as NavTab, label: 'Guía', icon: BookOpen },
  ];

  return (
    <>
      {/* Floating Action Buttons (Right side: Scroll-to-Top and Discord / Chat Bot) */}
      <div className="fixed bottom-22 right-4 z-40 flex flex-col items-center gap-3">
        {showScrollTop && (
          <button
            type="button"
            onClick={onScrollToTop}
            className="w-10 h-10 rounded-full bg-[#1b1f33]/90 hover:bg-[#252b45] border border-purple-500/30 text-purple-300 shadow-xl backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
            title="Subir al inicio"
          >
            <ArrowUp className="w-5 h-5 text-purple-300" />
          </button>
        )}

        {/* Discord / Support Bot Floating Button */}
        <button
          type="button"
          onClick={onOpenAssistant}
          className="w-12 h-12 rounded-full bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-xl shadow-[#5865F2]/40 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer border border-indigo-400/40 relative group"
          title="Soporte y Comunidad Discord"
        >
          <MessageCircle className="w-6 h-6 fill-white text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#090b14] rounded-full" />
        </button>
      </div>

      {/* Docked Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-[#090b14]/98 border-t border-[#1a1f33] backdrop-blur-xl px-2 py-1.5 safe-area-bottom shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center py-1 px-1.5 min-w-[50px] transition-all cursor-pointer group"
              >
                {/* Active Icon treatment */}
                {tab.id === 'games' && isActive ? (
                  <div className="w-10 h-7 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
                    <Play className="w-4 h-4 fill-purple-400 text-purple-400" />
                  </div>
                ) : tab.id === 'rental' ? (
                  <div
                    className={`flex items-center justify-center ${
                      isActive ? 'text-amber-400' : 'text-amber-500/80 group-hover:text-amber-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <div
                    className={`flex items-center justify-center transition-colors ${
                      isActive
                        ? 'text-purple-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                )}

                <span
                  className={`text-[10px] font-semibold mt-0.5 tracking-tight ${
                    isActive
                      ? tab.id === 'rental'
                        ? 'text-amber-400 font-bold'
                        : 'text-purple-400 font-bold'
                      : tab.id === 'rental'
                      ? 'text-amber-500/80'
                      : 'text-slate-400'
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
