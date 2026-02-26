"use client";

import React from 'react';
import { useUI } from '@/context/UIContext';
import SearchModal from './SearchModal';

const GlobalComponents = () => {
    const { isSearchOpen, closeSearch } = useUI();

    return (
        <>
            <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
        </>
    );
};

export default GlobalComponents;
