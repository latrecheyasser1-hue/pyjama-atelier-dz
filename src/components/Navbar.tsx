import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Sparkles, QrCode } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddModal: () => void;
  totalProducts: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  totalProducts
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="glass-nav sticky top-0 z-40 w-full px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Titre Atelier */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold text-2xl transform hover:rotate-6 transition-transform">
              <Sparkles className="w-7 h-7 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent">
                Pyjama DZ
              </h1>
              <p className="text-xs text-amber-400 font-medium tracking-widest uppercase flex items-center gap-1">
                <QrCode className="w-3 h-3" /> Atelier Production System
              </p>
            </div>
          </div>

          {/* Badge Compteur sur Mobile/Tablet */}
          <div className="md:hidden bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300">
            {totalProducts} {totalProducts === 1 ? 'Model' : 'Models'}
          </div>
        </div>

        {/* Barre de Recherche Rapide */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-amber-500/80" />
          </div>
          <input
            type="search"
            placeholder="Search by name or scan barcode..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="scanner-friendly w-full pl-11 pr-4 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />
        </div>

        {/* Boutons d'Action (Ajouter Produit + Installer PWA) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Badge Compteur sur Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{totalProducts} {totalProducts === 1 ? 'Model' : 'Models'}</span>
          </div>

          {/* Bouton d'Installation PWA (si disponible sur le PC) */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-amber-500/10 animate-bounce"
              title="Install application on your PC"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install PC App</span>
            </button>
          )}

          {/* Bouton Ajouter un Produit */}
          <button
            onClick={onOpenAddModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Add New Model</span>
          </button>
        </div>

      </div>
    </header>
  );
};
