import React, { useState, useRef } from 'react';
import {
  Shield,
  Lock,
  User,
  Mail,
  Gamepad2,
  Sparkles,
  Crown,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Check,
  UploadCloud,
  Loader2,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';
import { AVATAR_PRESETS, ADMIN_USER_PROFILE } from '../data/initialProfile';
import { processUploadedImage } from '../utils/imageUpload';
import { verifyAdminCredentials, DEFAULT_ADMIN_USERNAMES } from '../utils/adminAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onRegister: (newProfileData: Partial<UserProfile>) => void;
  onLoginAsAdmin: () => void;
  onLoginAsUser: (username: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onLoginAsAdmin,
  onLoginAsUser,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Register Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [platform, setPlatform] = useState('PC Windows');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [registerError, setRegisterError] = useState('');

  const handleCustomAvatarFile = async (file: File) => {
    try {
      setIsUploadingAvatar(true);
      setRegisterError('');
      const dataUrl = await processUploadedImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.88,
      });
      setCustomAvatar(dataUrl);
      setSelectedAvatar(dataUrl);
    } catch (err: any) {
      setRegisterError(err?.message || 'Error al procesar la imagen seleccionada.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Login Form State
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!username.trim()) {
      setRegisterError('Por favor ingresa un nombre de usuario o gamer tag.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setRegisterError('Ingresa un correo electrónico válido.');
      return;
    }
    if (!password || password.length < 4) {
      setRegisterError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (!agreeTerms) {
      setRegisterError('Debes aceptar las condiciones de acceso offline.');
      return;
    }

    const tag = `#${Math.floor(1000 + Math.random() * 9000)}`;

    onRegister({
      username: username.trim(),
      tag,
      email: email.trim(),
      avatarUrl: selectedAvatar,
      isRegistered: true,
      role: 'user',
      isAdmin: false,
      tierBadge: 'Gamer Verificado',
      memberSince: new Date().toLocaleDateString('es-ES', {
        month: 'short',
        year: 'numeric',
      }),
      bio: `Gamer activo en FTP (${platform}). Disfrutando de la biblioteca Steam offline.`,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUser.trim()) {
      setLoginError('Ingresa tu usuario o correo.');
      return;
    }

    if (!loginPassword.trim()) {
      setLoginError('Ingresa tu contraseña para continuar.');
      return;
    }

    // Check if user is attempting to login as admin
    const cleanUser = loginUser.trim().toLowerCase();
    const isAdminUser = DEFAULT_ADMIN_USERNAMES.includes(cleanUser);

    if (isAdminUser) {
      const verification = verifyAdminCredentials(cleanUser, loginPassword);
      if (!verification.success) {
        setLoginError('Usuario o contraseña incorrectos.');
        return;
      }
      onLoginAsAdmin();
      return;
    }

    // Regular gamer login
    if (loginPassword.trim().length < 4) {
      setLoginError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    onLoginAsUser(loginUser.trim(), loginUser.includes('@') ? loginUser.trim() : `${loginUser.trim().toLowerCase()}@gamer.ftp`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#05070e]/95 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-md my-auto rounded-3xl bg-[#0b0e1b] border border-purple-500/40 p-5 sm:p-6 shadow-[0_0_50px_rgba(147,51,234,0.25)] space-y-5 animate-fadeIn">
        
        {/* Optional Close Button if modal opened to switch account */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Glow ambient effect */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* FTP Header Branding */}
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[2px] shadow-xl shadow-purple-600/30 flex items-center justify-center mb-1">
            <div className="w-full h-full bg-[#090b14] rounded-[14px] flex items-center justify-center">
              <span className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-['Space_Grotesk']">
                FTP
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">
            <Sparkles className="w-3 h-3 text-purple-400" />
            REGISTRO OBLIGATORIO
          </div>

          <h2 className="text-xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Bienvenido a FTP Gaming
          </h2>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Para acceder a las licencias Steam offline y a la biblioteca, debes crear tu perfil gamer oficial.
          </p>
        </div>

        {/* Tab Selector: Crear Cuenta vs Iniciar Sesión */}
        <div className="flex p-1 bg-[#101528] rounded-2xl border border-[#1d2542]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegisterError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear Cuenta Nueva
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ya tengo Cuenta
          </button>
        </div>

        {/* TAB 1: REGISTRO (MANDATORY FOR NEW USERS) */}
        {activeTab === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {registerError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{registerError}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Nombre de Usuario / Gamer Tag</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. PhoenixRider, Valkyrie77"
                className="w-full px-3.5 py-2.5 bg-[#13182a] border border-[#232c48] focus:border-purple-500 rounded-xl text-white text-xs outline-none transition-colors"
                autoFocus
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Correo Electrónico</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full px-3.5 py-2.5 bg-[#13182a] border border-[#232c48] focus:border-purple-500 rounded-xl text-white text-xs outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Contraseña</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#13182a] border border-[#232c48] focus:border-purple-500 rounded-xl text-white text-xs outline-none transition-colors"
              />
            </div>

            {/* Avatar Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  Elige o Sube tu Avatar (PFP)
                </label>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>Subir foto propia</span>
                </button>
              </div>

              {/* Hidden file input for custom PFP */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCustomAvatarFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {/* Custom Uploaded Avatar Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatar) {
                      setSelectedAvatar(customAvatar);
                    } else {
                      avatarInputRef.current?.click();
                    }
                  }}
                  className={`relative shrink-0 w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                    customAvatar && selectedAvatar === customAvatar
                      ? 'border-purple-400 bg-purple-600/20 ring-2 ring-purple-400'
                      : 'border-purple-500/50 hover:border-purple-400 bg-[#121626]'
                  }`}
                  title={customAvatar ? 'Tu foto personalizada subida' : 'Subir tu propia foto desde tu PC o teléfono'}
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  ) : customAvatar ? (
                    <img
                      src={customAvatar}
                      alt="Avatar subido"
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UploadCloud className="w-4 h-4 text-purple-400" />
                  )}
                  {customAvatar && selectedAvatar === customAvatar && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white border border-[#0b0e1b]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* Anime Presets */}
                {AVATAR_PRESETS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.url)}
                    className={`relative shrink-0 rounded-full p-0.5 transition-all cursor-pointer ${
                      selectedAvatar === avatar.url
                        ? 'ring-2 ring-purple-400 scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover bg-slate-800"
                    />
                    {selectedAvatar === avatar.url && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white border border-[#0b0e1b]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-purple-400" />
                <span>Dispositivo Principal</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['PC Windows', 'Steam Deck', 'Laptop Gamer'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer text-center ${
                      platform === p
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                        : 'bg-[#121626] border-[#222942] text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 bg-[#13182a] border-[#232c48] cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 leading-snug">
                Acepto usar las cuentas exclusivamente en modo desconectado (Steam Offline) y respetar la comunidad FTP.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-purple-600/40 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Crear Cuenta y Entrar a la Biblioteca</span>
            </button>
          </form>
        ) : (
          /* TAB 2: INICIAR SESIÓN & ADMIN ACCESS */
          <div className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Usuario o Correo</span>
                </label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Tu usuario o email"
                  className="w-full px-3.5 py-2.5 bg-[#13182a] border border-[#232c48] focus:border-purple-500 rounded-xl text-white text-xs outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Contraseña</span>
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#13182a] border border-[#232c48] focus:border-purple-500 rounded-xl text-white text-xs outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </form>

            <div className="pt-2 border-t border-[#1d2542] flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Conexión segura para credenciales de la biblioteca</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
