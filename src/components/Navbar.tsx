import React from 'react';
import { Search, Plus, QrCode, LogOut } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddModal: () => void;
  totalProducts: number;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  totalProducts,
  onLogout
}) => {
  return (
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

        {/* Boutons d'Action (Ajouter Produit + Déconnexion) */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
          
          {/* Badge Compteur sur Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-xl text-sm font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{totalProducts} {totalProducts === 1 ? 'Model' : 'Models'}</span>
          </div>

          {/* Bouton Ajouter un Produit */}
          <button
            onClick={onOpenAddModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-rose-700/20 hover:shadow-rose-700/30 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Add New Model</span>
          </button>

          {/* Bouton Déconnexion (Verrouiller) */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Se déconnecter / Verrouiller l'Atelier"
              className="flex items-center justify-center p-2.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 rounded-xl transition-all shadow-sm"
            >
              <LogOut className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};


