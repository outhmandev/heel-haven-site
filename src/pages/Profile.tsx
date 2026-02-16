import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
};

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  if (!user) { navigate('/auth'); return null; }

  const orders = getUserOrders(user.id);

  const handleSave = () => {
    updateProfile({ name, phone, address });
    toast.success('Profile updated');
  };

  return (
    <div className="container py-8 max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="border rounded-sm p-6 space-y-4">
        <h2 className="font-bold">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} />
          </div>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Order History</h2>
        {orders.length === 0 && <p className="text-muted-foreground text-sm">No orders yet.</p>}
        {orders.map(order => (
          <div key={order.id} className="border rounded-sm p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
              <Badge className={statusColors[order.status]}>{order.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <p key={i} className="text-sm">{item.name} (Size {item.size}) × {item.quantity} — ${item.price * item.quantity}</p>
              ))}
            </div>
            <p className="font-bold text-sm">Total: ${order.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
