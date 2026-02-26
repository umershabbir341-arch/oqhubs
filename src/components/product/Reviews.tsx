'use client';

import React, { useState, useEffect } from 'react';
import { Star, User, TrendingUp, MessageSquare } from 'lucide-react';
import { Review } from '@/types';
import ReviewModal from './ReviewModal';
import { motion } from 'motion/react';

interface ReviewsProps {
    productId: string;
    productTitle: string;
}

export default function Reviews({ productId, productTitle }: ReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/products/${productId}/reviews`, {
                cache: 'no-store'
            });
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length,
        percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
    }));

    return (
        <>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-3xl p-8 border border-orange-100 dark:border-orange-900/30">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Overall Rating */}
                        <div className="lg:w-1/3 text-center lg:text-left">
                            <div className="inline-block">
                                <div className="text-6xl font-black text-gray-900 dark:text-white mb-2">
                                    {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                                </div>
                                <div className="flex justify-center lg:justify-start text-amber-500 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={24}
                                            fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                                            stroke={star <= Math.round(averageRating) ? "none" : "currentColor"}
                                        />
                                    ))}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                </div>
                            </div>
                        </div>

                        {/* Right: Rating Distribution */}
                        <div className="lg:w-2/3 space-y-3">
                            {ratingDistribution.map(({ rating, count, percentage }) => (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-16">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rating}</span>
                                        <Star size={14} className="text-amber-500" fill="currentColor" />
                                    </div>
                                    <div className="flex-1 h-2.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                        />
                                    </div>
                                    <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Write Review Button */}
                    <div className="mt-6 pt-6 border-t border-orange-200 dark:border-orange-900/30">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-full font-bold hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <MessageSquare size={20} />
                            Write a Review
                        </button>
                    </div>
                </div>

                {/* Reviews List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center gap-3 text-gray-500">
                            <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            Loading reviews...
                        </div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-gray-300 dark:border-neutral-700">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No reviews yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Be the first to share your thoughts about this product!</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                        >
                            Write the First Review
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {displayedReviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
                                                <User size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 dark:text-white text-lg">{review.reviewer}</span>
                                                    {review.verified && (
                                                        <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.dateCreated)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex text-amber-500 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={18}
                                                fill={star <= review.rating ? "currentColor" : "none"}
                                                stroke={star <= review.rating ? "none" : "currentColor"}
                                            />
                                        ))}
                                    </div>

                                    <div
                                        className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: review.review }}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {reviews.length > 3 && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold hover:underline text-lg"
                                >
                                    {showAll ? (
                                        <>Show Less</>
                                    ) : (
                                        <>
                                            <TrendingUp size={20} />
                                            View all {reviews.length} reviews
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productId={productId}
                productTitle={productTitle}
                onReviewSubmitted={fetchReviews}
            />
        </>
    );
}
