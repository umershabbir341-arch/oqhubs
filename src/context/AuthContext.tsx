'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// Auth updated to avoid missing imports when woocommerce.ts becomes server-only

import { getCookie, setCookie, deleteCookie } from '@/lib/cookies';
import Swal from 'sweetalert2';

interface AuthContextType {
    customer: any | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (input: any) => Promise<boolean>;
    logout: () => void;
    updateProfile: (input: any) => Promise<boolean>;
    sendOTP: (email: string) => Promise<string | null>;
    verifyOTP: (email: string, code: string) => Promise<boolean>;
    isEmailVerified: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customer, setCustomer] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [verifiedEmails, setVerifiedEmails] = useState<Set<string>>(new Set());
    const [activeOTP, setActiveOTP] = useState<{ email: string; code: string } | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            // Load verified emails from localStorage
            const savedVerified = localStorage.getItem('verifiedEmails');
            if (savedVerified) {
                try {
                    setVerifiedEmails(new Set(JSON.parse(savedVerified)));
                } catch (e) {
                    console.error('Error loading verified emails', e);
                }
            }

            const token = getCookie('shopifyCustomerAccessToken');
            if (token) {
                try {
                    const profileResponse = await fetch('/api/auth', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'getCustomer', token })
                    });
                    const customerData = await profileResponse.json();

                    if (customerData) {
                        // Fetch orders as well
                        const ordersResponse = await fetch('/api/auth', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'getOrders', token })
                        });
                        const ordersData = await ordersResponse.json();
                        setCustomer({ ...customerData, orders: ordersData });
                    } else {
                        // Token might be expired
                        deleteCookie('shopifyCustomerAccessToken');
                    }
                } catch (err) {
                    console.error('Failed to fetch customer:', err);
                    deleteCookie('shopifyCustomerAccessToken');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const isEmailVerified = (email: string) => {
        return verifiedEmails.has(email.toLowerCase());
    };

    const sendOTP = async (email: string) => {
        // Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Show loading state
        Swal.fire({
            title: 'Sending Code...',
            text: `Please wait while we send a verification code to ${email}`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || data.error || 'Failed to send OTP');
            }

            // Store the OTP only after successful send
            setActiveOTP({ email: email.toLowerCase(), code });

            // Simulate sending email by showing a notification
            await Swal.fire({
                title: 'Code Sent!',
                text: `A verification code has been sent to ${email}`,
                icon: 'success',
                confirmButtonColor: '#000',
                confirmButtonText: 'OK'
            });

            return code;
        } catch (error: any) {
            console.error('Error sending OTP:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to send verification code. Please try again.',
                icon: 'error',
                confirmButtonColor: '#000'
            });
            return null;
        }
    };

    const verifyOTP = async (email: string, code: string) => {
        if (activeOTP && activeOTP.email === email.toLowerCase() && activeOTP.code === code) {
            const newVerified = new Set(verifiedEmails);
            newVerified.add(email.toLowerCase());
            setVerifiedEmails(newVerified);
            localStorage.setItem('verifiedEmails', JSON.stringify(Array.from(newVerified)));
            setActiveOTP(null);
            return true;
        }
        return false;
    };

    const login = async (email: string, password: string) => {
        if (!isEmailVerified(email)) {
            Swal.fire({
                title: 'Email Not Verified',
                text: 'Please verify your email before logging in.',
                icon: 'warning',
                confirmButtonColor: '#000'
            });
            return false;
        }

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password })
            });
            const result = await response.json();

            if (result?.customerAccessToken) {
                const token = result.customerAccessToken.accessToken;
                setCookie('shopifyCustomerAccessToken', token);

                const profileResponse = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'getCustomer', token })
                });
                const customerData = await profileResponse.json();

                // Fetch orders as well
                const ordersResponse = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'getOrders', token })
                });
                const ordersData = await ordersResponse.json();
                setCustomer({ ...customerData, orders: ordersData });

                Swal.fire({
                    title: 'Success!',
                    text: 'Logged in successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                return true;
            } else if (result?.customerUserErrors && result.customerUserErrors.length > 0) {
                Swal.fire({
                    title: 'Error',
                    text: result.customerUserErrors[0].message,
                    icon: 'error'
                });
            }
        } catch (err) {
            console.error('Login error:', err);
            Swal.fire({
                title: 'Error',
                text: 'An unexpected error occurred.',
                icon: 'error'
            });
        }
        return false;
    };

    const signup = async (input: any) => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'signup', ...input })
            });
            const result = await response.json();

            if (result?.customer) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Account created successfully. Please login.',
                    icon: 'success'
                });
                return true;
            } else if (result?.customerUserErrors && result.customerUserErrors.length > 0) {
                Swal.fire({
                    title: 'Error',
                    text: result.customerUserErrors[0].message,
                    icon: 'error'
                });
            }
        } catch (err) {
            console.error('Signup error:', err);
            Swal.fire({
                title: 'Error',
                text: 'An unexpected error occurred.',
                icon: 'error'
            });
        }
        return false;
    };

    const logout = () => {
        deleteCookie('shopifyCustomerAccessToken');
        setCustomer(null);
        window.location.href = '/';
    };

    const updateProfile = async (input: any) => {
        const token = getCookie('shopifyCustomerAccessToken');
        if (!token) return false;

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updateProfile', token, input })
            });
            const result = await response.json();

            if (result?.customer) {
                setCustomer({ ...customer, ...result.customer });
                Swal.fire({
                    title: 'Success!',
                    text: 'Profile updated successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                return true;
            } else if (result?.customerUserErrors && result.customerUserErrors.length > 0) {
                Swal.fire({
                    title: 'Error',
                    text: result.customerUserErrors[0].message,
                    icon: 'error'
                });
            }
        } catch (err) {
            console.error('Update profile error:', err);
            Swal.fire({
                title: 'Error',
                text: 'An unexpected error occurred.',
                icon: 'error'
            });
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{
            customer,
            isLoading,
            login,
            signup,
            logout,
            updateProfile,
            sendOTP,
            verifyOTP,
            isEmailVerified
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
