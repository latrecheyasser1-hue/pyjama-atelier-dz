import { useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour détecter automatiquement les saisies provenant d'un scanner
 * de code-barres (douchette sans fil, USB, ou Bluetooth) n'importe où dans l'application !
 * 
 * Le principe : une douchette tape les caractères à une vitesse surhumaine (< 30ms par caractère)
 * et termine par la touche "Enter".
 */
export function useBarcodeScanner(onScan: (barcode: string) => void, enabled: boolean = true) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      // Si le temps écoulé depuis la dernière touche est trop long (> 350ms pour tolérer la latence des douchettes sans fil Bluetooth/2.4G),
      // c'est probablement un humain qui tape au clavier normal, on réinitialise le buffer.
      if (elapsedTime > 350) {
        bufferRef.current = '';
      }

      // Ignorer les touches de modification
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Si on appuie sur Entrée ou Tab et qu'on a accumulé un code de plus de 2 caractères
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (bufferRef.current.length >= 2) {
          const scannedCode = bufferRef.current;
          bufferRef.current = '';
          
          // Si l'utilisateur est en train d'écrire dans un champ de texte de formulaire
          // (sauf la barre de recherche rapide), on évite d'interférer si nécessaire.
          const target = e.target as HTMLElement;
          const isFormInput = target && (
            target.tagName === 'TEXTAREA' || 
            (target.tagName === 'INPUT' && target.getAttribute('type') !== 'search' && !target.classList.contains('scanner-friendly'))
          );

          if (!isFormInput) {
            e.preventDefault();
            // 🔔 Jouer un bip sonore de succès type caisse enregistreuse / douchette professionnelle !
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(1500, ctx.currentTime); // Fréquence nette et claire
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.12);
            } catch (err) {
              // Ignorer si l'audio n'est pas supporté ou bloqué
            }
            onScan(scannedCode);
          }
        }
        return;
      }

      // Si c'est un caractère imprimable (lettres, chiffres, tirets, underscores...)
      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onScan, enabled]);
}
