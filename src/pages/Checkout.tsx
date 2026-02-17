import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { MOROCCAN_CITIES, CITIES_LIST, CityName } from '@/data/locations';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState<CityName | ''>('');
  const [neighborhood, setNeighborhood] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset neighborhood when city changes
  useEffect(() => {
    setNeighborhood('');
  }, [selectedCity]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) { toast.error('Name is required'); return; }
    if (!phone.trim()) { toast.error('Phone number is required'); return; }
    if (!selectedCity) { toast.error('City is required'); return; }
    if (!neighborhood) { toast.error('Neighborhood is required'); return; }
    if (!address.trim()) { toast.error('Address is required'); return; }

    setIsSubmitting(true);
    try {
      const fullAddress = `${address}, ${neighborhood}, ${selectedCity}`;

      await placeOrder({
        userId: user.id,
        items: [...items],
        total,
        shippingName: name,
        shippingPhone: phone,
        shippingAddress: fullAddress
      });
      clearCart();
      toast.success('Order placed successfully! Cash on delivery.');
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableNeighborhoods = selectedCity ? MOROCCAN_CITIES[selectedCity] : [];

  return (
    <div className="container py-12 max-w-2xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Please complete your shipping details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6 border rounded-lg p-6 bg-card/50">
            <h2 className="font-semibold text-xl">Shipping Information</h2>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="06..."
                  type="tel"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Select value={selectedCity} onValueChange={(val) => setSelectedCity(val as CityName)}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES_LIST.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="neighborhood">Neighborhood <span className="text-red-500">*</span></Label>
                <Select
                  value={neighborhood}
                  onValueChange={setNeighborhood}
                  disabled={!selectedCity}
                >
                  <SelectTrigger id="neighborhood">
                    <SelectValue placeholder={selectedCity ? "Select your neighborhood" : "Select a city first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNeighborhoods.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Detailed Address <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street name, building number, apartment..."
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4 bg-muted/20">
            <h2 className="font-semibold text-xl">Order Summary</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm items-center">
                  <div className="flex gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">(Size {item.size}) × {item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
              Payment Method: Cash on Delivery
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full text-lg" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
          </Button>
        </form>
      </div>
    </div>
  );
}
