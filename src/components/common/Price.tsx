"use client";

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';

interface PriceProps {
    amount: number;
    className?: string;
}

const Price: React.FC<PriceProps> = ({ amount, className }) => {
    const { formatPrice, isLoading } = useCurrency();

    if (isLoading) {
        return <span className={className}>...</span>;
    }

    return <span className={className}>{formatPrice(amount)}</span>;
};

export default Price;
