import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight uppercase">
          Xstore
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/shop" className="hover:text-muted-foreground transition-colors">Shop</Link>
          <Link to="/shop?category=men" className="hover:text-muted-foreground transition-colors">Men</Link>
          <Link to="/shop?category=women" className="hover:text-muted-foreground transition-colors">Women</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <Shield className="h-5 w-5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => navigate(user ? '/profile' : '/auth')}>
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
          {user && (
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-3">
          <Link to="/shop" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Shop</Link>
          <Link to="/shop?category=men" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Men</Link>
          <Link to="/shop?category=women" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Women</Link>
          <Link to="/cart" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Cart ({itemCount})</Link>
          <Link to={user ? '/profile' : '/auth'} className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
            {user ? 'Profile' : 'Login'}
          </Link>
          {isAdmin && <Link to="/admin" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Admin</Link>}
          {user && <Button variant="outline" size="sm" onClick={() => { logout(); setMobileOpen(false); }}>Logout</Button>}
        </div>
      )}
    </header>
  );
}
