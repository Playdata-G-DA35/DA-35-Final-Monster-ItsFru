import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => (
  <div className="mb-5">
    <Image
      src="/images/logo-home.png"
      alt="ItsFru Logo"
      width={300}
      height={200}
      priority
    />
  </div>
);

const ButtonContainer: React.FC = () => (
  <div className="flex flex-col gap-2.5 md:flex-row md:gap-5">
    <Link href="/login" className="flex items-center justify-center w-full md:w-52 p-2.5 border border-gray-800 rounded-md text-gray-800 bg-white transition-colors duration-300 hover:bg-gray-200">
      <span role="img" aria-label="login">👤</span> 로그인
    </Link>
    <Link href="/signup" className="flex items-center justify-center w-full md:w-52 p-2.5 border border-gray-800 rounded-md text-gray-800 bg-white transition-colors duration-300 hover:bg-gray-200">
      <span role="img" aria-label="signup">✔️</span> 회원 가입
    </Link>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>ItsFru - 홈</title>
        <meta name="description" content="ItsFru에 오신 것을 환영합니다. 로그인 또는 회원 가입을 하세요." />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#4e9e3b] p-2 md:p-3">
        <main className="flex flex-col items-center">
          <Logo />
          <hr className="w-4/5 border-t border-gray-300 my-4 md:my-6" />
          <ButtonContainer />
        </main>
      </div>
    </>
  );
};

export default HomePage;