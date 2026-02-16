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
  {
    id: '1',
    name: 'Classic Oxford',
    description: 'Timeless leather Oxford shoes with a polished finish. Perfect for formal occasions and business settings. Crafted from premium full-grain leather with a comfortable cushioned insole.',
    price: 189,
    images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=600&fit=crop'],
    category: 'men',
    sizes: [40, 41, 42, 43, 44, 45],
    featured: true,
  },
  {
    id: '2',
    name: 'Urban Runner',
    description: 'Lightweight running sneakers with responsive cushioning. Engineered mesh upper for breathability and a sleek modern silhouette that transitions from gym to street.',
    price: 129,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
    category: 'men',
    sizes: [40, 41, 42, 43, 44, 45, 46],
    featured: true,
  },
  {
    id: '3',
    name: 'Chelsea Boot',
    description: 'Sleek suede Chelsea boots with elastic side panels. A versatile wardrobe staple that pairs well with both casual and smart outfits. Pull-on style for easy wear.',
    price: 219,
    images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=600&fit=crop'],
    category: 'men',
    sizes: [40, 41, 42, 43, 44, 45],
    featured: false,
  },
  {
    id: '4',
    name: 'Canvas Slip-On',
    description: 'Casual canvas slip-on shoes for everyday comfort. Lightweight construction with a padded collar and flexible rubber outsole. Available in classic neutral tones.',
    price: 69,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop'],
    category: 'men',
    sizes: [40, 41, 42, 43, 44, 45],
    featured: false,
  },
  {
    id: '5',
    name: 'Leather Loafer',
    description: 'Premium leather loafers with a refined silhouette. Hand-stitched details and a flexible sole for all-day comfort. The perfect dress-casual shoe.',
    price: 159,
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&h=600&fit=crop'],
    category: 'men',
    sizes: [40, 41, 42, 43, 44],
    featured: false,
  },
  {
    id: '6',
    name: 'Elegant Stiletto',
    description: 'Classic pointed-toe stiletto heels in premium leather. A statement piece for evening events and formal occasions. Features a comfortable padded footbed.',
    price: 199,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop'],
    category: 'women',
    sizes: [36, 37, 38, 39, 40, 41],
    featured: true,
  },
  {
    id: '7',
    name: 'Minimalist Sneaker',
    description: 'Clean white leather sneakers with a minimalist design. Premium leather upper with a comfortable foam insole. Pairs perfectly with everything from jeans to dresses.',
    price: 139,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop'],
    category: 'women',
    sizes: [36, 37, 38, 39, 40, 41],
    featured: true,
  },
  {
    id: '8',
    name: 'Ankle Bootie',
    description: 'Chic suede ankle boots with a block heel. Versatile enough for both casual and dressed-up looks. Side zip closure for easy on and off.',
    price: 179,
    images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop'],
    category: 'women',
    sizes: [36, 37, 38, 39, 40],
    featured: false,
  },
  {
    id: '9',
    name: 'Strappy Sandal',
    description: 'Elegant strappy sandals with a mid-height heel. Soft leather straps with an adjustable ankle buckle. Perfect for summer events and warm-weather occasions.',
    price: 119,
    images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop'],
    category: 'women',
    sizes: [36, 37, 38, 39, 40, 41],
    featured: false,
  },
  {
    id: '10',
    name: 'Ballet Flat',
    description: 'Classic ballet flats in soft nappa leather. Timeless elegance meets everyday comfort with a cushioned insole and flexible sole. A wardrobe essential.',
    price: 99,
    images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop'],
    category: 'women',
    sizes: [36, 37, 38, 39, 40],
    featured: false,
  },
];
