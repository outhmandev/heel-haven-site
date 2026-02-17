import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, OrderStatus } from '@/contexts/OrderContext';
import { products as defaultProducts, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
};

const PRODUCTS_KEY = 'shoestore_admin_products';

function getStoredProducts(): Product[] {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
  return defaultProducts;
}

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();
  const [adminProducts, setAdminProducts] = useState<Product[]>(getStoredProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (!user || !isAdmin) { navigate('/'); return null; }

  const saveProducts = (prods: Product[]) => {
    setAdminProducts(prods);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
  };

  const deleteProduct = (id: string) => {
    saveProducts(adminProducts.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const handleProductSave = (product: Product) => {
    if (editingProduct) {
      saveProducts(adminProducts.map(p => (p.id === product.id ? product : p)));
      toast.success('Product updated');
    } else {
      saveProducts([...adminProducts, { ...product, id: crypto.randomUUID() }]);
      toast.success('Product added');
    }
    setEditingProduct(null);
    setShowForm(false);
  };

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('shoestore_users') || '[]');

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 pt-4">
          <Button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="gap-1">
            <Plus className="h-4 w-4" /> Add Product
          </Button>

          {showForm && (
            <ProductForm
              product={editingProduct}
              onSave={handleProductSave}
              onCancel={() => { setShowForm(false); setEditingProduct(null); }}
            />
          )}

          <div className="border rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3 hidden md:table-cell">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminProducts.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 hidden md:table-cell capitalize">{p.category}</td>
                    <td className="p-3">${p.price}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingProduct(p); setShowForm(true); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteProduct(p.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 pt-4">
          {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
          {orders.map(order => (
            <div key={order.id} className="border rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[order.status]}>{order.status}</Badge>
                  <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v as OrderStatus)}>
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Customer:</strong> {order.shippingName}</p>
                <p><strong>Phone:</strong> <a href={`tel:${order.shippingPhone}`} className="text-primary hover:underline">{order.shippingPhone}</a></p>
                <p><strong>Address:</strong> {order.shippingAddress}</p>
                <p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shippingAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-xs flex items-center gap-1"
                  >
                    View Location on Map
                  </a>
                </p>
              </div>
              <div className="text-sm space-y-1">
                {order.items.map((item, i) => (
                  <p key={i}>{item.name} (Size {item.size}) × {item.quantity}</p>
                ))}
              </div>
              <p className="font-bold text-sm">Total: ${order.total}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="users" className="pt-4">
          <div className="border rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }: { product: Product | null; onSave: (p: Product) => void; onCancel: () => void }) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState<'men' | 'women'>(product?.category || 'men');
  const [sizes, setSizes] = useState(product?.sizes?.join(', ') || '40, 41, 42, 43, 44');
  const [image, setImage] = useState(product?.images?.[0] || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: product?.id || '',
      name,
      description,
      price: parseFloat(price),
      category,
      sizes: sizes.split(',').map(s => parseInt(s.trim())).filter(Boolean),
      images: [image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
      featured: product?.featured || false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-sm p-4 space-y-4 max-w-lg">
      <h3 className="font-bold">{product ? 'Edit Product' : 'Add Product'}</h3>
      <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
      <div className="space-y-2"><Label>Price</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} required /></div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={v => setCategory(v as 'men' | 'women')}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="women">Women</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Sizes (comma separated)</Label><Input value={sizes} onChange={e => setSizes(e.target.value)} /></div>
      <div className="space-y-2"><Label>Image URL</Label><Input value={image} onChange={e => setImage(e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{product ? 'Update' : 'Add'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
