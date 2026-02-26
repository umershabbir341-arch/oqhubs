import { Product } from '@/types';

export interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    isVerified: boolean;
}

export const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        userName: 'Alex R.',
        rating: 5,
        comment: 'Absolutely love the quality. The fabric is heavy and premium, just what I was looking for. Perfect for both training and casual wear.',
        date: '2024-01-12',
        isVerified: true
    },
    {
        id: '2',
        userName: 'Jordan M.',
        rating: 4,
        comment: 'Great fit and style. The minimal branding is a plus. Only reason it’s not a 5 is the shipping took a day longer than expected.',
        date: '2024-01-08',
        isVerified: true
    },
    {
        id: '3',
        userName: 'Taylor S.',
        rating: 5,
        comment: 'RAWBLOX never misses. This hoodie is built like a tank. Worth every penny.',
        date: '2023-12-28',
        isVerified: true
    }
];
