import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    setTimeout(() => {
      // Vérification des identifiants exacts demandés par l'utilisateur
      if (username === 'username123' && password === '765483cr654') {
        // Succès !
        localStorage.setItem('pyjama_auth_session', 'authenticated_user_123');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setIsLoading(false);
        onLoginSuccess();
      } else {
        // Erreur !
        setError(true);
        setIsLoading(false);
      }
    }, 600); // Petit délai pour un effet visuel pro et réaliste
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 p-4 relative overflow-hidden selection:bg-rose-600 selection:text-white">
      
      {/* Cercles lumineux d'arrière-plan (effet Luxury Glow) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      
      {/* Carte principale Glassmorphism */}
      <div className="max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 relative z-10 transform transition-all">
        
        {/* En-tête avec Logo et Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
            <img 
              src="/logo.svg" 
              alt="Pyjama DZ Logo" 
              className="w-20 h-20 object-contain relative z-10 drop-shadow-md transform hover:scale-105 transition-transform" 
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>Accès Sécurisé Atelier</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Pyjama DZ
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1 justify-center">
            <QrCode className="w-3.5 h-3.5 text-amber-600" /> Atelier Production System
          </p>
        </div>

        {/* Formulaire de Connexion */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Message d'erreur */}
          {error && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-500/40 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2.5 animate-shake">
              <span className="text-base shrink-0">❌</span>
              <span>Nom d'utilisateur ou mot de passe incorrect !</span>
            </div>
          )}

          {/* Champ Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">
              Nom d'utilisateur (Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5 text-rose-600" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600 focus:bg-white focus:ring-4 focus:ring-rose-600/10 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Champ Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider pl-1">
              Mot de passe (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5 text-rose-600" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600 focus:bg-white focus:ring-4 focus:ring-rose-600/10 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Bouton de Soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 hover:from-rose-800 hover:to-amber-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm sm:text-base transition-all shadow-lg shadow-rose-700/25 hover:shadow-xl hover:shadow-rose-700/35 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Se Connecter / Déverrouiller</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Footer info sécurité */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Système protégé — Exclusivement pour l'Atelier</span>
          </p>
        </div>

      </div>
    </div>
  );
};
