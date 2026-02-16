import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { useReviews } from '@/contexts/ReviewContext';
import StarRating from './StarRating';

export default function ProductCard({ product }: { product: Product }) {
  const { getAverageRating, getProductReviews } = useReviews();
  const avg = getAverageRating(product.id);
  const count = getProductReviews(product.id).length;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-sm bg-muted mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <h3 className="font-medium text-sm">{product.name}</h3>
        <div className="flex items-center gap-2">
          {avg > 0 && (
            <>
              <StarRating rating={Math.round(avg)} size={12} />
              <span className="text-xs text-muted-foreground">({count})</span>
            </>
          )}
        </div>
        <p className="font-semibold">${product.price}</p>
      </div>
    </Link>
  );
}
