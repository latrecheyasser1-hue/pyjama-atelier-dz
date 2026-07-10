/**
 * Service pour interroger des bases de données de codes-barres publiques mondiales (Méthode 3)
 */

export async function fetchProductNameFromGlobalDB(barcode: string): Promise<string | null> {
  if (!barcode) return null;

  try {
    // Essai 1 : UPCitemDB (Gratuit, ~100 requêtes/jour par IP, pas de clé requise pour l'API Trial)
    // Utile pour beaucoup de produits importés (Turquie, Chine, etc. s'ils utilisent des codes EAN/UPC standards)
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.items && data.items.length > 0) {
        return data.items[0].title || null;
      }
    }
    
    // Si d'autres APIs gratuites sont trouvées dans le futur (comme Open EAN Database), 
    // elles peuvent être ajoutées ici en "fallback" (Essai 2).

  } catch (error) {
    console.error("Erreur lors de la recherche dans la base de données mondiale :", error);
  }

  return null;
}
