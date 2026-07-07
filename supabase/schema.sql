-- Schéma SQL pour Atelier Barcode & Gallery App (Pyjama DZ)
-- Base de données Supabase PostgreSQL

-- 1. Création de la table des produits (Sel3a)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    barcode TEXT NOT NULL UNIQUE, -- Contrainte UNIQUE pour interdire à 10000% les doublons !
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour recherche ultrarapide par code-barres et par nom
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);

-- 2. Configuration de la sécurité Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politique autorisant l'accès complet (Lecture, Ajout, Modification, Suppression)
CREATE POLICY "Allow full access to products for atelier" 
ON public.products 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. Création du Bucket de Stockage pour les photos des produits
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

-- 4. Politiques de sécurité pour le Bucket Storage
CREATE POLICY "Allow public read access on product-images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Allow public insert/upload on product-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public update on product-images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images');

CREATE POLICY "Allow public delete on product-images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images');
