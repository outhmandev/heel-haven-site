import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function HomePage() {
  const featured = products.filter(p => p.featured);
  const menProducts = products.filter(p => p.category === 'men').slice(0, 3);
  const womenProducts = products.filter(p => p.category === 'women').slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="container py-24 md:py-36 text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] opacity-80">New Collection 2026</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Step Into<br />Your Style
          </h1>
          <p className="text-lg opacity-80 max-w-md mx-auto">
            Premium footwear for men and women. Crafted for comfort, designed for life.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/shop?category=men">Shop Men</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/shop?category=women">Shop Women</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container py-16 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="bg-muted/50">
        <div className="container py-16 space-y-12">
          <h2 className="text-2xl font-bold text-center">Shop by Category</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/shop?category=men" className="group relative block aspect-[4/3] overflow-hidden rounded-sm bg-accent">
              <img src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&h=600&fit=crop" alt="Men's shoes" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-primary/40 flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-bold text-primary-foreground">Men</h3>
                  <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/shop?category=women" className="group relative block aspect-[4/3] overflow-hidden rounded-sm bg-accent">
              <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop" alt="Women's shoes" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-primary/40 flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-bold text-primary-foreground">Women</h3>
                  <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-16 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold">Stay in the Loop</h2>
        <p className="text-muted-foreground text-sm">Get updates on new arrivals and exclusive offers.</p>
        <div className="flex gap-2">
          <input type="email" placeholder="Enter your email" className="flex-1 h-10 px-3 rounded-sm border bg-background text-sm" />
          <Button>Subscribe</Button>
        </div>
      </section>
    </div>
  );
}
