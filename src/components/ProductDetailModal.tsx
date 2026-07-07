import React, { useEffect, useRef, useState } from 'react';
import type { Product } from '../types/database.types';
import { X, Printer, Trash2, QrCode, Sparkles, Calendar, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import JsBarcode from 'jsbarcode';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onDelete: (id: string, imageUrl: string | null) => Promise<void>;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onDelete
}) => {
  const barcodeRef = useRef<SVGSVGElement | null>(null);
  const printBarcodeRef = useRef<SVGSVGElement | null>(null);
  
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fonction robuste pour générer le code-barres avec fallback et viewBox
  const generateBarcode = (svgElement: SVGSVGElement | null, barcodeText: string, width: number, height: number, fontSize: number, showText: boolean) => {
    if (!svgElement || !barcodeText) return;
    // Nettoyage pour garantir la compatibilité Code 128 (caractères ASCII standard)
    const cleanText = barcodeText.replace(/[^\x20-\x7E]/g, '').trim() || '000000';
    
    try {
      JsBarcode(svgElement, cleanText, {
        format: 'CODE128',
        lineColor: '#000000',
        background: '#ffffff',
        width: width,
        height: height,
        displayValue: showText,
        fontSize: fontSize,
        fontOptions: 'bold',
        font: 'monospace',
        margin: 4
      });
      // Forcer le viewBox pour empêcher le navigateur de réduire la hauteur (height: 0px) lors de l'impression
      const w = svgElement.getAttribute('width');
      const h = svgElement.getAttribute('height');
      if (w && h) {
        svgElement.setAttribute('viewBox', `0 0 ${parseInt(w, 10)} ${parseInt(h, 10)}`);
      }
    } catch (e) {
      console.warn("CODE128 failed, fallback to auto format:", e);
      try {
        JsBarcode(svgElement, cleanText, {
          lineColor: '#000000',
          background: '#ffffff',
          width: width,
          height: height,
          displayValue: showText,
          fontSize: fontSize,
          margin: 4
        });
      } catch (e2) {
        console.error("Erreur critique génération code-barres:", e2);
      }
    }
  };

  // Rendu du code-barres graphique avec JsBarcode (Code 128)
  useEffect(() => {
    if (product) {
      generateBarcode(barcodeRef.current, product.barcode, 2.2, 70, 16, true);
      // Pour l'étiquette thermique 50x30mm (1.80x1.10 in) : barres nettes (width 1.5, height 42px) sans texte intégré pour éviter la double écriture
      generateBarcode(printBarcodeRef.current, product.barcode, 1.5, 42, 11, false);
    }

    setIsConfirmingDelete(false);
  }, [product]);

  if (!product) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(product.id, product.image_url);
      onClose();
    } catch (e) {
      console.error("Erreur de suppression:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(product.created_at).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      {/* ----------------------------------------------------
        * 1. MODALE VISUELLE À L'ÉCRAN (Masquée au Print)
        * ---------------------------------------------------- */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-lg animate-fade-in print:hidden">
        
        <div className="glass-modal w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white flex flex-col md:flex-row max-h-[90vh]">
          
          {/* Colonne Gauche : Grande Photo du Modèle */}
          <div className="w-full md:w-1/2 bg-slate-100 relative min-h-[260px] md:min-h-full flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center max-h-[45vh] md:max-h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Sparkles className="w-16 h-16 mb-2 text-slate-400" />
                <p className="text-sm">No photo available for this model</p>
              </div>
            )}
            
            {/* Badge de date en superposition */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 shadow-md">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>Added on {formattedDate}</span>
            </div>
          </div>

          {/* Colonne Droite : Informations, Code-Barres & Actions */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-slate-50/60">
            
            <div>
              {/* En-tête et Bouton Fermer */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg mb-2">
                    <Sparkles className="w-3 h-3" /> Atelier Specification
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {product.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 shrink-0 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Ligne Code-barres en texte */}
              <div className="mb-6 bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Unique Barcode</p>
                    <p className="font-mono font-bold text-base text-slate-900 tracking-wider">{product.barcode}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Rendu graphique du Code-Barres */}
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm mb-6 border-2 border-slate-200">
                <svg ref={barcodeRef} className="max-w-full h-auto"></svg>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  Ready for wireless / USB barcode scanner
                </p>
              </div>
            </div>

            {/* Boutons d'Action (Imprimer Ticket & Supprimer) */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              
              {/* Bouton Principal : Imprimer le Ticket */}
              <button
                onClick={handlePrint}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 text-white font-extrabold text-base transition-all shadow-lg shadow-rose-700/25 hover:shadow-rose-700/40 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Printer className="w-5 h-5 stroke-[2.5]" />
                <span>🖨️ Print Label / Ticket</span>
              </button>

              {/* Section Suppression */}
              {!isConfirmingDelete ? (
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-200/80 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-transparent hover:border-rose-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete this model</span>
                </button>
              ) : (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2.5 animate-fade-in">
                  <p className="text-xs text-rose-700 font-medium text-center flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Confirm permanent deletion?</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsConfirmingDelete(false)}
                      disabled={isDeleting}
                      className="flex-1 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-lg shadow-rose-600/30"
                    >
                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      <span>Yes, Delete</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* ----------------------------------------------------
        * 2. ZONE SPÉCIALE D'IMPRESSION (Visible UNIQUEMENT au Print - Format 50x30mm / 1.80x1.10 in)
        * ---------------------------------------------------- */}
      <div className="ticket-print-area hidden print:flex">
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1mm 2mm', 
          textAlign: 'center', 
          background: 'white', 
          color: 'black',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          
          {/* En-tête Atelier */}
          <h1 style={{ 
            fontSize: '11px', 
            fontWeight: '900', 
            margin: '0 0 1px 0', 
            letterSpacing: '0.5px', 
            textTransform: 'uppercase',
            lineHeight: '1',
            color: '#000000',
            whiteSpace: 'nowrap'
          }}>
            PYJAMA DZ
          </h1>

          {/* Nom du Modèle */}
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: '800', 
            margin: '0 0 3px 0', 
            lineHeight: '1.1',
            color: '#000000',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.name}
          </h2>

          {/* Code-barres graphique officiel + Numéro en texte clair en dessous */}
          <div style={{ margin: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <svg ref={printBarcodeRef} style={{ maxWidth: '46mm', width: '100%', height: '42px', display: 'block', margin: '0 auto' }}></svg>
            <p style={{ 
              fontSize: '11px', 
              fontWeight: '900', 
              fontFamily: 'monospace', 
              margin: '2px 0 0 0', 
              letterSpacing: '1px', 
              color: '#000000',
              lineHeight: '1',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {product.barcode}
            </p>
          </div>

        </div>
      </div>
    </>
  );
};
