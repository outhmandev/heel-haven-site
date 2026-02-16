import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground">Add some shoes to get started.</p>
        <Button asChild><Link to="/shop">Shop Now</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-4 border-b pb-4">
              <Link to={`/product/${item.productId}`} className="h-24 w-24 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                <p className="font-semibold text-sm">${item.price}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 ml-2" onClick={() => removeItem(item.productId, item.size)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="font-semibold text-sm">${item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="border rounded-sm p-6 space-y-4 h-fit">
          <h2 className="font-bold">Order Summary</h2>
          <div className="flex justify-between text-sm">
            <span>Items ({itemCount})</span>
            <span>${total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
