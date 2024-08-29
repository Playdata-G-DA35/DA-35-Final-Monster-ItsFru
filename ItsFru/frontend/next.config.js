const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // 개발 환경에서는 PWA 비활성화
  // 기타 PWA 설정 옵션
});

const path = require('path');

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPWA({
  ...nextConfig, // nextConfig의 모든 설정을 포함
  webpack: (config, { isServer, dev }) => {
    // 경로 별칭 설정 추가
    config.resolve.alias['@components'] = path.join(__dirname, 'src/components');
    config.resolve.alias['@styles'] = path.join(__dirname, 'src/styles');
    config.resolve.alias['@contexts'] = path.join(__dirname, 'src/contexts');
    // 추가적인 Webpack 설정이 필요한 경우 여기에 추가
    return config;
  },
});




