import React from 'react';
import type { Product } from '../types/database.types';
import { QrCode, Sparkles, Plus, Search, Eye } from 'lucide-react';

interface ProductGalleryProps {
  products: Product[];
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  onOpenAddModal: () => void;
  searchQuery: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  products,
  isLoading,
  onSelectProduct,
  onOpenAddModal,
  searchQuery
}) => {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium animate-pulse">
          Loading Atelier Models Gallery...
        </p>
      </div>
    );
  }

  // État vide si aucun produit n'est trouvé
  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center border-dashed border-slate-300 bg-white">
          <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6 shadow-inner border border-rose-200">
            {searchQuery ? <Search className="w-10 h-10 text-rose-600" /> : <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain rounded-full" />}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {searchQuery
              ? `No models found for "${searchQuery}"`
              : "The Atelier showcase is empty"}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            {searchQuery
              ? "Try verifying the scanned barcode or the name entered in the search bar."
              : "Start by adding your first pyjama or garment model with its photo and barcode!"}
          </p>
          {!searchQuery && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-700/20 transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Add First Model</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-fade-in">
      
      {/* En-tête de la galerie */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>✨ Models Gallery</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click on any photo to view product details or print barcode labels
          </p>
        </div>
      </div>

      {/* Grille de Produits (Wajiha visuelle : grandes photos élégantes) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="glass-card group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col aspect-[3/4] select-none"
            title={`Click to open ${product.name}`}
          >
            {/* Photo principale du produit en plein fond */}
            <div className="absolute inset-0 w-full h-full bg-slate-100 overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <Sparkles className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>

            {/* Dégradé sombre pour lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

            {/* Badge icône d'œil au survol */}
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
              <Eye className="w-4 h-4 text-rose-600" />
            </div>

            {/* Contenu bas de carte : Nom et Badge Code-Barres */}
            <div className="relative mt-auto p-4 z-10 flex flex-col justify-end">
              <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-2 drop-shadow-md">
                {product.name}
              </h3>
              
              <div className="mt-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-lg w-fit shadow-sm">
                <QrCode className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                <span className="text-xs font-mono font-bold text-slate-900 tracking-wider truncate max-w-[120px] sm:max-w-[150px]">
                  {product.barcode}
                </span>
              </div>
            </div>

            {/* Bordure lumineuse au survol */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-rose-600/50 rounded-2xl transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

    </main>
  );
};
