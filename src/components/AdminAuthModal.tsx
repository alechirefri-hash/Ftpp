import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, X, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { verifyAdminCredentials } from '../utils/adminAuth';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Ingresa el nombre de usuario de administrador.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Ingresa la contraseña de administrador.');
      return;
    }

    const verification = verifyAdminCredentials(username, password);

    if (!verification.success) {
      setErrorMessage(verification.message || 'Credenciales incorrectas.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setPassword('');
      setErrorMessage(null);
      onSuccess();
    }, 600);
  };

  const handleClose = () => {
    setErrorMessage(null);
    setPassword('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070e]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0e1222] border border-amber-500/40 p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center mb-1">
            <div className="w-full h-full bg-[#0a0d18] rounded-[14px] flex items-center justify-center text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-base font-black text-white tracking-wide">
            Autenticación de Super Admin
          </h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Introduce el usuario y contraseña del administrador para elevar permisos y acceder al control total.
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>¡Autenticado con éxito! Activando perfil Super Admin...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 block">
              Usuario Administrador
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#141829] border border-[#242c46] focus:border-amber-500 rounded-xl text-white outline-none transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 block">
              Contraseña de Administrador
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-[#141829] border border-[#242c46] focus:border-amber-500 rounded-xl text-white outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Discreet Credentials Reminder */}
          <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-2 text-[10px] text-amber-300/80">
            <KeyRound className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-semibold block text-amber-300">Credenciales por defecto:</span>
              <span className="text-slate-400 font-mono">Usuario: <strong className="text-slate-200">admin</strong> &nbsp;|&nbsp; Clave: <strong className="text-slate-200">admin123</strong></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSuccess}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            <Shield className="w-4 h-4 text-slate-950" />
            <span>Verificar y Entrar como Super Admin</span>
          </button>
        </form>
      </div>
    </div>
  );
};
