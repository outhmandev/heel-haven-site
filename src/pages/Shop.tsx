import { useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = (searchParams.get('category') as 'men' | 'women' | 'all') || 'all';
  const [sort, setSort] = useState('default');

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const filtered = useMemo(() => {
    let result = category === 'all' ? products : products.filter((p: Product) => p.category === category);
    if (sort === 'price-asc') result = [...result].sort((a: Product, b: Product) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a: Product, b: Product) => b.price - a.price);
    if (sort === 'name') result = [...result].sort((a: Product, b: Product) => a.name.localeCompare(b.name));
    return result;
  }, [category, sort, products]);

  const handleCategoryChange = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value === 'all') {
        newParams.delete('category');
      } else {
        newParams.set('category', value);
      }
      return newParams;
    });
  };

  if (isLoading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8">Error loading products</div>;

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">
        {category === 'men' ? "Men's Shoes" : category === 'women' ? "Women's Shoes" : 'All Shoes'}
      </h1>

      <div className="flex flex-wrap gap-4 items-center">
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="women">Women</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>

        <p className="text-sm text-muted-foreground ml-auto">{filtered.length} products</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p: { id: any; }) => <ProductCard key={p.id} product={p} />)}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No products found.</p>
      )}
    </div>
  );
}
