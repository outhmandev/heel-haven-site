import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) { toast.error('Please fill all fields'); return; }
    placeOrder({ userId: user.id, items: [...items], total, shippingName: name, shippingPhone: phone, shippingAddress: address });
    clearCart();
    toast.success('Order placed successfully! Cash on delivery.');
    navigate('/profile');
  };

  return (
    <div className="container py-8 max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Shipping Information</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Shipping Address</Label>
            <Input id="address" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
        </div>

        <div className="border rounded-sm p-6 space-y-3">
          <h2 className="font-bold">Order Summary</h2>
          {items.map(item => (
            <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
              <span>{item.name} (Size {item.size}) × {item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <p className="text-xs text-muted-foreground">Payment: Cash on Delivery</p>
        </div>

        <Button type="submit" size="lg" className="w-full">Place Order</Button>
      </form>
    </div>
  );
}
