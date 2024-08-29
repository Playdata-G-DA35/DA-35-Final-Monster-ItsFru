import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import '@styles/globals.css';
import { Layout } from '@components';
import { StoreProvider } from '@contexts/StoreContext';
import { AuthProvider } from '@contexts/AuthContext';
import { CartProvider } from '@contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ItsFru = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    const isLandingPage = router.pathname === '/';

    useEffect(() => {
        // PWA 설정
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                        console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                        console.log('Service Worker registration failed: ', err);
                    }
                );
            });
        }

        // Axios 인터셉터 설정
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // JWT 토큰이 만료되었거나 유효하지 않은 경우
                    router.push('/login');
                }
                return Promise.reject(error);
            }
        );
    }, [router]);

    return (
        <AuthProvider>
            <StoreProvider>
                <CartProvider>
                    <Head>
                        <title>ItsFru - 무인 과일 매장</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <meta name="description" content="신선한 과일을 제공하는 무인 과일 매장 앱입니다." />
                        <link rel="manifest" href="/manifest.json" />
                        <link rel="icon" href="/favicon.ico" />
                        <meta name="theme-color" content="#ffffff" />
                        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
                    </Head>
                    <div className="min-h-screen">
                        {isLandingPage ? (
                            <Component {...pageProps} />
                        ) : (
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        )}
                    </div>
                    <ToastContainer
                        position="top-center"
                        autoClose={2000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </CartProvider>
            </StoreProvider>
        </AuthProvider>
    );
};

export default ItsFru;