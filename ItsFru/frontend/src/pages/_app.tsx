// pages/_app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '@styles/globals.css';
import Layout from '@components/Layout'; // Layout 컴포넌트 import

const ItsFru = ({ Component, pageProps, router }: AppProps) => {
    // index 페이지를 제외한 모든 페이지에 Layout 적용
    const isLandingPage = router.pathname === '/';

    return (
        <>
            <Head>
                <title>ItsFru - 무인 과일 매장</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="신선한 과일을 제공하는 무인 과일 매장 앱입니다." />
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {isLandingPage ? (
                <Component {...pageProps} />
            ) : (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            )}
        </>
    );
};

export default ItsFru;