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
          Chargement de la galerie de l'Atelier...
        </p>
      </div>
    );
  }

  // État vide si aucun produit n'est trouvé
  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center border-dashed border-slate-700">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-amber-500 shadow-inner">
            {searchQuery ? <Search className="w-10 h-10" /> : <Sparkles className="w-10 h-10" />}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {searchQuery
              ? `Aucun modèle trouvé pour "${searchQuery}"`
              : "La vitrine de l'Atelier est vide"}
          </h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            {searchQuery
              ? "Essayez de vérifier le code-barres scanné ou le nom saisi dans la barre de recherche."
              : "Commencez par ajouter votre premier pyjama ou modèle de confection avec sa photo et son code-barres !"}
          </p>
          {!searchQuery && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Ajouter le Premier Modèle</span>
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
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>✨ Galerie des Modèles</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cliquez sur une photo pour afficher la fiche détaillée ou imprimer l'étiquette code-barres
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
            title={`Cliquez pour ouvrir ${product.name}`}
          >
            {/* Photo principale du produit en plein fond */}
            <div className="absolute inset-0 w-full h-full bg-slate-800 overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <Sparkles className="w-12 h-12 text-slate-600" />
                </div>
              )}
            </div>

            {/* Dégradé sombre et effet de survol */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Badge icône d'œil au survol */}
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
              <Eye className="w-4 h-4 text-amber-400" />
            </div>

            {/* Contenu bas de carte : Nom et Badge Code-Barres */}
            <div className="relative mt-auto p-4 z-10 flex flex-col justify-end">
              <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-2 drop-shadow-md">
                {product.name}
              </h3>
              
              <div className="mt-2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg w-fit">
                <QrCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-mono font-semibold text-slate-200 tracking-wider truncate max-w-[120px] sm:max-w-[150px]">
                  {product.barcode}
                </span>
              </div>
            </div>

            {/* Bordure lumineuse au survol */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/50 rounded-2xl transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

    </main>
  );
};
