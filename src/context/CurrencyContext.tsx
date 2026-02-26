"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';


interface CurrencyContextType {
    currencyCode: string;
    formatPrice: (amount: number) => string;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currencyCode, setCurrencyCode] = useState<string>('USD');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const response = await fetch('/api/shop');
                const shopData = await response.json();
                if (shopData?.paymentSettings?.currencyCode) {
                    setCurrencyCode(shopData.paymentSettings.currencyCode);
                }
            } catch (error) {
                console.error('Error fetching shop currency:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrency();
    }, []);

    const formatPrice = useCallback((amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    }, [currencyCode]);

    return (
        <CurrencyContext.Provider value={{ currencyCode, formatPrice, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
