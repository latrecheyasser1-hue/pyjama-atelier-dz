export interface Product {
  id: string;
  name: string;
  barcode: string;
  image_url: string | null;
  created_at: string;
}

export type NewProduct = Omit<Product, 'id' | 'created_at'>;
