export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'men' | 'women';
  sizes: number[];
  featured: boolean;
}

export const products: Product[] = [

];
