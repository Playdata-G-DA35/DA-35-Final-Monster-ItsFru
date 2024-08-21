import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import '@styles/globals.css';
import { Layout } from '@components';
import { StoreProvider } from '@contexts/StoreContext';
import { AuthProvider } from '@contexts/AuthContext';
import { CartProvider } from '@contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItsFru = ({ Component, pageProps, router }: AppProps) => {
    const isLandingPage = router.pathname === '/';

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