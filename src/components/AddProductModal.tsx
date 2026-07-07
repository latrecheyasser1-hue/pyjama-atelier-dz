import React, { useState, useEffect } from 'react';
import { X, Upload, QrCode, AlertTriangle, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { checkBarcodeExists } from '../services/supabase';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, barcode: string, imageFile: File | null) => Promise<void>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // États de vérification anti-doublon en temps réel
  const [isCheckingBarcode, setIsCheckingBarcode] = useState(false);
  const [barcodeExists, setBarcodeExists] = useState(false);
  const [existingProductName, setExistingProductName] = useState<string | undefined>('');
  
  // États de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Réinitialiser le formulaire à l'ouverture/fermeture
  useEffect(() => {
    if (isOpen) {
      setName('');
      setBarcode('');
      setImageFile(null);
      setImagePreview(null);
      setBarcodeExists(false);
      setExistingProductName('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Vérification en temps réel du code-barres (anti-doublon)
  useEffect(() => {
    if (!barcode || barcode.trim() === '') {
      setBarcodeExists(false);
      setExistingProductName('');
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingBarcode(true);
      try {
        const { exists, productName } = await checkBarcodeExists(barcode.trim());
        setBarcodeExists(exists);
        setExistingProductName(productName);
      } catch (e) {
        console.error("Erreur vérif code-barres:", e);
      } finally {
        setIsCheckingBarcode(false);
      }
    }, 400); // Debounce de 400ms pour ne pas spammer Supabase

    return () => clearTimeout(timer);
  }, [barcode]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !barcode.trim()) {
      setErrorMsg("Please provide both the model name and barcode.");
      return;
    }

    if (barcodeExists) {
      setErrorMsg(`Cannot save: Barcode is already assigned to "${existingProductName}".`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onAdd(name.trim(), barcode.trim(), imageFile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      
      <div className="glass-modal w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white flex flex-col max-h-[90vh]">
        
        {/* En-tête de la Modale */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">New Atelier Model</h3>
              <p className="text-xs text-slate-500">Register a new product with photo and barcode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Message d'Erreur Général */}
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-start gap-3 text-rose-600 text-sm animate-shake">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {/* 1. Nom du Produit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Model / Pyjama Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Satin Pyjama - Navy Blue (Size L)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all"
            />
          </div>

          {/* 2. Code-Barres avec Vérification Anti-Doublon en Temps Réel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Unique Barcode * (Numbers, Letters, "-" or "_")
              </label>
              {isCheckingBarcode && (
                <span className="text-xs text-rose-600 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                </span>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <QrCode className="w-5 h-5 text-rose-700" />
              </div>
              <input
                type="text"
                required
                placeholder="ex: PYJ-SATIN_01"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value.toUpperCase())}
                className={`w-full pl-11 pr-10 py-3 bg-white border rounded-xl font-mono text-sm tracking-wider uppercase text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  barcodeExists
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 text-rose-700'
                    : barcode && !isCheckingBarcode
                    ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500/20'
                    : 'border-slate-300 focus:border-rose-600 focus:ring-rose-600/20'
                }`}
              />
              
              {/* Icône de statut de validation à droite */}
              {barcode && !isCheckingBarcode && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  {barcodeExists ? (
                    <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
              )}
            </div>

            {/* ALERTE ANTI-DOUBLON (LALA HADA CODE RAK DEJA DAYRO) */}
            {barcodeExists && (
              <div className="mt-2.5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm font-semibold animate-bounce">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>
                  ⚠️ Duplicate Barcode: This code is already assigned to <strong className="text-rose-950 underline">{existingProductName}</strong>!
                </span>
              </div>
            )}
            {barcode && !barcodeExists && !isCheckingBarcode && (
              <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Barcode is unique and ready for registration!
              </p>
            )}
          </div>

          {/* 3. Photo du Produit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Product Photo (Optional but recommended)
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 aspect-video flex items-center justify-center group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-rose-700 transition-all flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Change photo
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 hover:border-rose-500/50 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 group-hover:bg-rose-50 flex items-center justify-center mb-3 text-slate-500 group-hover:text-rose-600 transition-colors shadow-sm">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="mb-1 text-sm text-slate-700 font-medium">
                    <span className="text-rose-600 font-bold">Click</span> or drag photo here
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG or WEBP (Max 5 MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Boutons de Validation */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || barcodeExists || isCheckingBarcode || !name.trim() || !barcode.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-sm transition-all shadow-lg shadow-rose-700/20 disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Model</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
