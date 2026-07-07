import { createClient } from '@supabase/supabase-js';
import type { Product } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yteqyltoykqrwqhumetw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZXF5bHRveWtxcndxaHVtZXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MjE2NTMsImV4cCI6MjA5ODk5NzY1M30.MnNC5WbzefsqJ660R4HjXpBA2IPU1ktB-D4RmVx90OY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Récupère tous les produits (ou filtrés par recherche textuelle sur nom / code-barres)
 */
export async function getProducts(searchQuery?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.trim();
    // Recherche par nom ILIKE ou code-barres ILIKE
    query = query.or(`name.ilike.%${q}%,barcode.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
  return data || [];
}

/**
 * Vérifie en temps réel si un code-barres existe déjà (pour interdire les doublons)
 */
export async function checkBarcodeExists(barcode: string): Promise<{ exists: boolean; productName?: string }> {
  if (!barcode || barcode.trim() === '') return { exists: false };
  
  const { data, error } = await supabase
    .from('products')
    .select('name')
    .eq('barcode', barcode.trim())
    .maybeSingle();

  if (error) {
    console.error('Erreur de vérification de code-barres:', error);
    return { exists: false };
  }

  if (data) {
    return { exists: true, productName: data.name };
  }
  return { exists: false };
}

/**
 * Upload de l'image dans le bucket Supabase Storage "product-images"
 */
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `atelier/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("Erreur d'upload de l'image:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Ajoute un nouveau produit dans la base de données
 */
export async function addProduct(name: string, barcode: string, imageFile: File | null): Promise<Product> {
  // 1. Vérification ultime anti-doublon avant insertion
  const { exists, productName } = await checkBarcodeExists(barcode);
  if (exists) {
    throw new Error(`Duplicate Barcode: "${barcode}" is already assigned to "${productName}".`);
  }

  // 2. Upload de l'image si fournie
  let imageUrl: string | null = null;
  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile);
  } else {
    // Image par défaut élégante si aucune photo n'est fournie
    imageUrl = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80';
  }

  // 3. Insertion dans la table products
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: name.trim(),
        barcode: barcode.trim(),
        image_url: imageUrl
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Erreur d'insertion du produit:", error);
    throw error;
  }

  return data;
}

/**
 * Supprime un produit et son image de stockage
 */
export async function deleteProduct(id: string, imageUrl: string | null): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erreur de suppression du produit:", error);
    throw error;
  }

  // Tenter de supprimer l'image du storage si c'est une image uploadée chez nous
  if (imageUrl && imageUrl.includes('product-images')) {
    try {
      const parts = imageUrl.split('product-images/');
      if (parts.length === 2) {
        await supabase.storage.from('product-images').remove([parts[1]]);
      }
    } catch (e) {
      console.warn("Impossible de supprimer l'image du storage:", e);
    }
  }
}
