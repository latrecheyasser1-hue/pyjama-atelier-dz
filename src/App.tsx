import { useState, useEffect, useCallback } from 'react';
import type { Product } from './types/database.types';
import { getProducts, addProduct, deleteProduct } from './services/supabase';
import { useBarcodeScanner } from './hooks/useBarcodeScanner';
import { Navbar } from './components/Navbar';
import { ProductGallery } from './components/ProductGallery';
import { AddProductModal } from './components/AddProductModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import confetti from 'canvas-confetti';
import { QrCode, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Toast de notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'scan' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'scan') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Chargement des produits depuis Supabase
  const fetchProducts = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      const data = await getProducts(query);
      setProducts(data);
    } catch (e: any) {
      console.error("Erreur de chargement:", e);
      showToast("Impossible de charger les modèles depuis Supabase.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 300); // Debounce sur la recherche
    return () => clearTimeout(timer);
  }, [searchQuery, fetchProducts]);

  // 2. Détection automatique du Scanner de Code-Barres en Arrière-Plan !
  const handleBarcodeScanned = useCallback((scannedCode: string) => {
    const code = scannedCode.trim().toUpperCase();
    console.log("👉 [SCAN DETECTÉ] Code-barres reçu:", code);

    // Chercher si le produit existe déjà dans la liste chargée
    const foundProduct = products.find(p => p.barcode.toUpperCase() === code);

    if (foundProduct) {
      // 🎯 PRODUIT TROUVÉ -> Ouverture instantanée de la fiche et effet sonore/visuel !
      setSelectedProduct(foundProduct);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast(`📦 Modèle détecté : "${foundProduct.name}" !`, "scan");
    } else {
      // ⚠️ PRODUIT INCONNU -> On ouvre la modale d'ajout pour lui !
      showToast(`⚠️ Code-barres scanné "${code}" introuvable. Ouvrez "Ajouter un Modèle" pour l'enregistrer.`, "error");
    }
  }, [products]);

  // Activation du hook de scanner sur toute l'application
  useBarcodeScanner(handleBarcodeScanned, true);

  // 3. Gestionnaires d'actions (Ajout / Suppression)
  const handleAddProduct = async (name: string, barcode: string, imageFile: File | null) => {
    const newProduct = await addProduct(name, barcode, imageFile);
    
    // Ajout immédiat en haut de la liste
    setProducts(prev => [newProduct, ...prev]);
    
    // Feu d'artifice visuel
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    
    showToast(`✨ Modèle "${newProduct.name}" ajouté avec succès à l'atelier !`, "success");
  };

  const handleDeleteProduct = async (id: string, imageUrl: string | null) => {
    await deleteProduct(id, imageUrl);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("🗑️ Modèle supprimé définitivement de l'atelier.", "success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Flottant de Notification (Masqué au Print) */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in print:hidden">
          <div className={`px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
            toast.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' 
              : toast.type === 'scan'
              ? 'bg-amber-950/90 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-300'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'scan' && <QrCode className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Barre de Navigation Supérieure (Masquée au Print) */}
      <div className="print:hidden">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          totalProducts={products.length}
        />
      </div>

      {/* Galerie des Produits ("Wajiha" visuelle avec photos) */}
      <div className="flex-1">
        <ProductGallery
          products={products}
          isLoading={isLoading}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
        />
      </div>

      {/* Modale d'Ajout d'un Produit (Masquée au Print) */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />

      {/* Modale de Détail & Impression du Ticket Code-Barres */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onDelete={handleDeleteProduct}
      />

      {/* Pied de page Atelier (Masqué au Print) */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Pyjama DZ - L'Atelier de Confection. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            <span>Conçu avec excellence & passion pour l'artisanat algérien</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
          </p>
        </div>
      </footer>

    </div>
  );
}
