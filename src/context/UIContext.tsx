"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface UIContextType {
    isAnySheetOpen: boolean;
    openSheets: Set<string>;
    setSheetOpen: (id: string, isOpen: boolean) => void;
    // Search Modal state
    isSearchOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [openSheets, setOpenSheets] = useState<Set<string>>(new Set());
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const setSheetOpen = useCallback((id: string, isOpen: boolean) => {
        setOpenSheets(prev => {
            const isAlreadyContained = prev.has(id);
            if (isOpen === isAlreadyContained) return prev;

            const next = new Set(prev);
            if (isOpen) {
                next.add(id);
            } else {
                next.delete(id);
            }
            return next;
        });
    }, []);

    const openSearch = useCallback(() => setIsSearchOpen(true), []);
    const closeSearch = useCallback(() => setIsSearchOpen(false), []);

    const isAnySheetOpen = openSheets.size > 0 || isSearchOpen;

    const value = useMemo(() => ({
        isAnySheetOpen,
        openSheets,
        setSheetOpen,
        isSearchOpen,
        openSearch,
        closeSearch
    }), [isAnySheetOpen, openSheets, setSheetOpen, isSearchOpen, openSearch, closeSearch]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
