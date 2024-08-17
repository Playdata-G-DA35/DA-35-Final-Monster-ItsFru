// src/pages/_app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import '@styles/globals.css';
import { Layout } from '../components';
import { StoreProvider } from '../contexts/StoreContext'; // StoreProvider import
import StoreStatus from '../components/StoreStatus'; // Updated import for StoreStatus

const ItsFru = ({ Component, pageProps, router }: AppProps) => {
    const isLandingPage = router.pathname === '/';

    return (
        <StoreProvider> {/* Wrap the application with StoreProvider */}
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
                        <StoreStatus /> {/* Include StoreStatus component if needed */}
                    </Layout>
                )}
            </div>
        </StoreProvider>
    );
};

export default ItsFru;