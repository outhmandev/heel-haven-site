import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg uppercase tracking-tight mb-3">ShoeStore</h3>
          <p className="text-sm text-muted-foreground">Premium footwear for men and women. Quality craftsmanship meets modern design.</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-3">Quick Links</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/shop" className="block hover:text-foreground transition-colors">Shop All</Link>
            <Link to="/shop?category=men" className="block hover:text-foreground transition-colors">Men</Link>
            <Link to="/shop?category=women" className="block hover:text-foreground transition-colors">Women</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-3">Account</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/auth" className="block hover:text-foreground transition-colors">Login / Register</Link>
            <Link to="/cart" className="block hover:text-foreground transition-colors">Shopping Cart</Link>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ShoeStore. All rights reserved.
      </div>
    </footer>
  );
}
