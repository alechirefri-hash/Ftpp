import React from 'react';
import { Gamepad2, Plus, Search, Trophy, Clock, Play, Download, Upload, RotateCcw } from 'lucide-react';
import { Game } from '../types';

interface NavbarProps {
  games: Game[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenAddModal: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  games,
  searchTerm,
  onSearchChange,
  onOpenAddModal,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const totalHours = games.reduce((acc, g) => acc + (g.hoursPlayed || 0), 0);
  const playingCount = games.filter((g) => g.status === 'jugando').length;
  const completedCount = games.filter((g) => g.status === 'completado').length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-white font-['Space_Grotesk']">
                  Game<span className="text-cyan-400">Vault</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full">
                  Catálogo Personal
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-400">Tu biblioteca digital de juegos</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar en tu biblioteca por título o género..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/90 border border-slate-750 focus:border-cyan-500 text-slate-100 placeholder-slate-500 rounded-xl outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Quick Stats Badges (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span className="font-medium text-white">{playingCount}</span>
              <span className="text-slate-400">jugando</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-white">{completedCount}</span>
              <span className="text-slate-400">completados</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium text-white">{totalHours}h</span>
              <span className="text-slate-400">jugadas</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Backup actions */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={onExportData}
                title="Exportar copia de seguridad en JSON"
                className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
              </button>
              <label
                title="Importar catálogo guardado"
                className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>
              <button
                onClick={onResetData}
                title="Restablecer datos de muestra"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Game Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Registrar Juego</span>
            </button>
          </div>

        </div>

        {/* Mobile search bar */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar título o género..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-500 rounded-xl outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
