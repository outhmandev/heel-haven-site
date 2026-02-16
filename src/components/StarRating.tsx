import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: number;
}

export default function StarRating({ rating, onRate, size = 16 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          className={cn(
            'transition-colors',
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30',
            onRate && 'cursor-pointer hover:text-amber-400'
          )}
          onClick={() => onRate?.(star)}
        />
      ))}
    </div>
  );
}
