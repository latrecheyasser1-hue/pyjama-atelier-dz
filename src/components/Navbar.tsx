import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, QrCode, X, Monitor, Laptop, CheckCircle2 } from 'lucide-react';

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
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // En mode localhost ou si le navigateur n'a pas encore déclenché le prompt, on affiche le guide !
      setShowInstallGuide(true);
    }
  };

  return (
    <>
      <header className="glass-nav sticky top-0 z-40 w-full px-4 sm:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Titre Atelier */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="Pyjama DZ Logo" 
                className="w-14 h-14 object-contain drop-shadow-md transform hover:scale-105 transition-transform" 
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                  Pyjama DZ
                </h1>
                <p className="text-xs text-rose-700 font-bold tracking-widest uppercase flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-amber-600" /> Atelier Production System
                </p>
              </div>
            </div>
          </div>

          {/* Barre de Recherche (friendly pour Scanner et Clavier) */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-rose-600" />
            </div>
            <input
              type="search"
              placeholder="Search by name or scan barcode..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="scanner-friendly w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all shadow-sm"
            />
          </div>

          {/* Boutons d'Action (Ajouter Produit + Installer PWA) */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Badge Compteur sur Desktop */}
            <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-xl text-sm font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{totalProducts} {totalProducts === 1 ? 'Model' : 'Models'}</span>
            </div>

            {/* Bouton d'Installation PWA (TOUJOURS VISIBLE) */}
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-600/40 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md animate-bounce"
              title="Install application on your PC Desktop"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Install PC App</span>
            </button>

            {/* Bouton Ajouter un Produit */}
            <button
              onClick={onOpenAddModal}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-rose-700/20 hover:shadow-rose-700/30 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Add New Model</span>
            </button>
          </div>

        </div>
      </header>

      {/* MODAL GUIDE D'INSTALLATION SUR LE BUREAU WINDOWS */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 font-bold shrink-0">
                <Monitor className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Installer Pyjama DZ sur le Bureau</h3>
                <p className="text-sm font-semibold text-rose-600">Application Logiciel Windows 10/11</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 mb-6">
              <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl text-amber-900">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  💡 Pourquoi ce message ?
                </p>
                <p className="text-xs leading-relaxed">
                  En mode local (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">localhost</code>), Google Chrome et Edge demandent une installation manuelle rapide en 2 clics !
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-rose-600" /> Sur Google Chrome :
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs font-medium text-slate-700 pl-1">
                  <li>Cliquez sur les <strong>3 points (⋮)</strong> en haut à droite du navigateur.</li>
                  <li>Allez sur <strong>Enregistrer et partager</strong> (Save and share).</li>
                  <li>Cliquez sur <strong>Installer la page en tant qu'application...</strong> (ou <em>Créer un raccourci ➔ cocher "Ouvrir dans une fenêtre"</em>).</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-600" /> Sur Microsoft Edge :
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs font-medium text-slate-700 pl-1">
                  <li>Cliquez sur les <strong>3 points (...)</strong> en haut à droite.</li>
                  <li>Allez sur <strong>Applications</strong> (Apps).</li>
                  <li>Cliquez sur <strong>Installer ce site en tant qu'application</strong>.</li>
                </ol>
              </div>

              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200/60 p-3.5 rounded-xl font-bold text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>L'icône "Pyjama DZ" apparaîtra sur votre Bureau Windows et s'ouvrira comme un vrai logiciel !</span>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-slate-900/20"
            >
              J'ai compris, fermer !
            </button>
          </div>
        </div>
      )}
    </>
  );
};
