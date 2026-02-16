import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => boolean;
  getProductReviews: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);
const REVIEWS_KEY = 'shoestore_reviews';

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (review: Omit<Review, 'id' | 'createdAt'>): boolean => {
    if (reviews.find(r => r.productId === review.productId && r.userId === review.userId)) return false;
    setReviews(prev => [...prev, { ...review, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
    return true;
  };

  const getProductReviews = (productId: string) => reviews.filter(r => r.productId === productId);

  const getAverageRating = (productId: string) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
  return ctx;
}
