import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/contexts/ReviewContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/StarRating';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { getProductReviews, getAverageRating, addReview } = useReviews();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-16 text-center">Loading product...</div>;
  if (error || !product) return <div className="container py-16 text-center">Product not found.</div>;

  const reviews = getProductReviews(product.id);
  const avgRating = getAverageRating(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Please select a size'); return; }
    addItem({ productId: product.id, name: product.name, price: product.price, size: selectedSize, image: product.images[0] });
    toast.success('Added to cart');
  };

  const handleReview = () => {
    if (!user) { toast.error('Please login to review'); return; }
    if (rating === 0) { toast.error('Please select a rating'); return; }
    const ok = addReview({ productId: product.id, userId: user.id, userName: user.name, rating, comment });
    if (ok) { toast.success('Review submitted'); setRating(0); setComment(''); }
    else toast.error('You already reviewed this product');
  };

  return (
    <div className="container py-8 space-y-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-sm bg-muted">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{product.category}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={Math.round(avgRating)} size={16} />
                <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            )}
          </div>
          <p className="text-2xl font-bold">${product.price}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

          <div className="space-y-2">
            <p className="text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`h-10 w-12 rounded-sm border text-sm font-medium transition-colors ${selectedSize === s ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-foreground'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" onClick={handleAddToCart} className="w-full md:w-auto gap-2">
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>

      {/* Reviews */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold">Customer Reviews</h2>

        {user && (
          <div className="border rounded-sm p-4 space-y-3 max-w-lg">
            <h3 className="font-medium text-sm">Write a Review</h3>
            <StarRating rating={rating} onRate={setRating} />
            <Textarea placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} rows={3} />
            <Button size="sm" onClick={handleReview}>Submit Review</Button>
          </div>
        )}

        {reviews.length === 0 && <p className="text-muted-foreground text-sm">No reviews yet.</p>}
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="border-b pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{r.userName}</span>
                <StarRating rating={r.rating} size={12} />
              </div>
              {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
              <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
